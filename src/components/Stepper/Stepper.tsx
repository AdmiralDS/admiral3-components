import {
  Children,
  forwardRef,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

import { STEPPER_MOBILE_PADDING, STEPPER_MOBILE_STEP_WIDTH, STEPPER_STATUS_LABELS } from './constants';
import { Step } from './Step';
import { StepperContext } from './StepperContext';
import { HiddenText, StepList, StyledStepper } from './style';
import type { StepperProps, StepProps } from './types';
import { refSetter } from '../../utils/refSetter';

const getActions = (list: HTMLOListElement | null) =>
  list ? Array.from(list.querySelectorAll<HTMLButtonElement>(':scope > li > button[data-step-action]')) : [];

const isAvailable = (button: HTMLButtonElement) => {
  if (!button.isConnected || button.disabled || button.closest('[hidden], [inert]')) return false;
  const ownerWindow = button.ownerDocument.defaultView;
  if (!ownerWindow) return false;
  if (ownerWindow.getComputedStyle(button).visibility !== 'visible') return false;
  for (let element: HTMLElement | null = button; element; element = element.parentElement) {
    if (ownerWindow.getComputedStyle(element).display === 'none') return false;
  }
  return true;
};

const getAvailableActions = (list: HTMLOListElement | null) => getActions(list).filter(isAvailable);

const setTabStop = (buttons: HTMLButtonElement[], target: HTMLButtonElement | undefined) => {
  buttons.forEach((button) => {
    button.tabIndex = button === target ? 0 : -1;
  });
};

const getEntryButton = (buttons: HTMLButtonElement[]) =>
  buttons.find((button) => button.getAttribute('aria-current') === 'step') ?? buttons[0];

/** Stepper показывает последовательность шагов и управляет фокусом внутри неё. */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      children,
      activeStep,
      dimension = 'm',
      orientation: orientationProp = 'horizontal',
      colorMode = 'colored',
      mobile = false,
      stepWidth,
      lineClamp = 2,
      showLastStepLine = false,
      onStepChange,
      statusLabels: labels,
      onFocus,
      onBlur,
      onKeyDown,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLOListElement>(null);
    const focusedRef = useRef<HTMLButtonElement | null>(null);
    const navigationId = useId();
    const orientation = mobile ? 'horizontal' : orientationProp;
    const statusLabels = { ...STEPPER_STATUS_LABELS, ...labels };
    const steps = Children.toArray(children).filter(isValidElement<StepProps>);
    if (steps.some((step) => step.type !== Step)) {
      throw new Error('Stepper only accepts direct Step children.');
    }
    const interactive = Boolean(onStepChange);
    const resolvedStepWidth =
      stepWidth !== undefined && Number.isFinite(stepWidth) && stepWidth > 0
        ? stepWidth
        : mobile
          ? STEPPER_MOBILE_STEP_WIDTH
          : undefined;

    // После удаления или блокировки шага возвращаем фокус только из самого степпера.
    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const actions = getActions(listRef.current);
      const buttons = actions.filter(isAvailable);
      const previous = focusedRef.current;
      const activeElement = root.ownerDocument.activeElement;
      const entry = getEntryButton(buttons);
      const stillFocused = previous && buttons.includes(previous) && activeElement === previous;
      setTabStop(actions, stillFocused ? previous : entry);
      if (!previous || stillFocused) return;
      const outside = activeElement && activeElement !== root.ownerDocument.body && !root.contains(activeElement);
      focusedRef.current = null;
      if (outside) return;
      if (entry) {
        entry.focus({ preventScroll: true });
        focusedRef.current = entry;
      } else {
        root.focus({ preventScroll: true });
      }
    });

    useLayoutEffect(() => {
      const root = rootRef.current;
      const list = listRef.current;
      if (!mobile || !root || !list) return;
      const alignCurrent = () => {
        const item = list.querySelector('[aria-current="step"]')?.closest('li');
        if (!item || item.parentElement !== list) return;
        const left =
          root.scrollLeft +
          item.getBoundingClientRect().left -
          root.getBoundingClientRect().left -
          root.clientLeft -
          STEPPER_MOBILE_PADDING;
        root.scrollLeft = Math.max(0, Math.min(left, root.scrollWidth - root.clientWidth));
      };
      alignCurrent();
      let previousWidth = root.clientWidth;
      const ownerWindow = root.ownerDocument.defaultView;
      const observer = ownerWindow?.ResizeObserver
        ? new ownerWindow.ResizeObserver(() => {
            if (root.clientWidth === previousWidth) return;
            previousWidth = root.clientWidth;
            alignCurrent();
          })
        : undefined;
      observer?.observe(root);
      return () => observer?.disconnect();
    }, [activeStep, mobile, resolvedStepWidth, steps.length]);

    const getEventButton = (target: EventTarget | null) =>
      getAvailableActions(listRef.current).find((button) => button === target || button.contains(target as Node));

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (event.defaultPrevented) return;
      const button = getEventButton(event.target);
      if (!button) return;
      focusedRef.current = button;
      setTabStop(getActions(listRef.current), button);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      const next = event.relatedTarget as Node | null;
      // blur() и клик по нефокусируемой области тоже означают выход из группы.
      // При удалении или скрытии кнопки оставляем восстановление фокуса layout-эффекту.
      const intentionalBlur = !next && focusedRef.current && isAvailable(focusedRef.current);
      if ((next && !rootRef.current?.contains(next)) || intentionalBlur) {
        focusedRef.current = null;
        const buttons = getActions(listRef.current);
        setTabStop(buttons, getEntryButton(buttons.filter(isAvailable)));
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const buttons = getAvailableActions(listRef.current);
      const current = getEventButton(event.target);
      if (!current) return;
      const index = buttons.indexOf(current);
      const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      let next: HTMLButtonElement | undefined;
      switch (event.key) {
        case 'Home':
          next = buttons[0];
          break;
        case 'End':
          next = buttons.at(-1);
          break;
        case previousKey:
          next = buttons[(index - 1 + buttons.length) % buttons.length];
          break;
        case nextKey:
          next = buttons[(index + 1) % buttons.length];
          break;
        default:
          return;
      }
      if (!next) return;
      event.preventDefault();
      focusedRef.current = next;
      setTabStop(buttons, next);
      next.focus({ preventScroll: mobile });
      const root = rootRef.current;
      if (mobile && root) {
        const bounds = next.getBoundingClientRect();
        const viewport = root.getBoundingClientRect();
        if (bounds.left < viewport.left + STEPPER_MOBILE_PADDING) {
          root.scrollLeft += bounds.left - viewport.left - STEPPER_MOBILE_PADDING;
        } else if (bounds.right > viewport.right - STEPPER_MOBILE_PADDING) {
          root.scrollLeft += bounds.right - viewport.right + STEPPER_MOBILE_PADDING;
        }
      }
    };

    return (
      <StyledStepper
        ref={refSetter(rootRef, ref)}
        role="group"
        aria-label="Этапы выполнения"
        tabIndex={-1}
        {...props}
        aria-describedby={[describedBy, interactive ? navigationId : undefined].filter(Boolean).join(' ') || undefined}
        data-dimension={dimension}
        data-orientation={orientation}
        data-color-mode={colorMode}
        data-mobile={mobile ? '' : undefined}
        $orientation={orientation}
        $mobile={mobile}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {interactive && (
          <HiddenText id={navigationId}>
            {orientation === 'horizontal' ? statusLabels.horizontalNavigation : statusLabels.verticalNavigation}
          </HiddenText>
        )}
        <StepList ref={listRef} role="list" $orientation={orientation} $mobile={mobile} $stepWidth={resolvedStepWidth}>
          {steps.map((step, index) => (
            <StepperContext.Provider
              key={step.key ?? index}
              value={{
                index,
                active: activeStep === index,
                dimension,
                orientation,
                colorMode,
                lineClamp,
                hideLine: index === steps.length - 1 && !showLastStepLine,
                onStepChange,
                statusLabels,
              }}
            >
              {step}
            </StepperContext.Provider>
          ))}
        </StepList>
      </StyledStepper>
    );
  },
);

Stepper.displayName = 'Stepper';

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

import { useRovingFocus, type RovingFocusItem } from '#src/hooks/useRovingFocus';

import { STEPPER_MOBILE_PADDING, STEPPER_MOBILE_STEP_WIDTH, STEPPER_STATUS_LABELS } from './constants';
import { Step } from './Step';
import { StepperContext, type StepRegistration } from './StepperContext';
import { HiddenText, StepList, StyledStepper } from './style';
import type { StepperProps, StepProps } from './types';
import { refSetter } from '../../utils/refSetter';

const isAvailable = (button: HTMLButtonElement) => {
  if (button.tagName !== 'BUTTON' || !button.isConnected || button.disabled) return false;
  const ownerWindow = button.ownerDocument.defaultView;
  if (!ownerWindow) return false;
  if (ownerWindow.getComputedStyle(button).visibility !== 'visible') return false;
  for (let element: HTMLElement | null = button; element; element = element.parentElement) {
    if (element.hidden || element.inert) return false;
    if (ownerWindow.getComputedStyle(element).display === 'none') return false;
  }
  return true;
};

const isActionAvailable = (item: RovingFocusItem<HTMLButtonElement, string>) =>
  !item.disabled && item.ref.current !== null && isAvailable(item.ref.current);

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
    const registrations = useRef(new Map<string, StepRegistration>());
    const navigationId = useId();
    const orientation = mobile ? 'horizontal' : orientationProp;
    const statusLabels = { ...STEPPER_STATUS_LABELS, ...labels };
    const steps = Children.toArray(children).filter(isValidElement<StepProps>);
    if (steps.some((step) => step.type !== Step)) {
      throw new Error('Stepper only accepts direct Step children.');
    }
    const stepIds = steps.map((step, index) => String(step.key ?? index));
    const revealFocusedItem = useCallback(
      (item: RovingFocusItem<HTMLButtonElement, string>) => {
        const root = rootRef.current;
        const button = item.ref.current;
        if (!mobile || !root || !button) return;
        const bounds = button.getBoundingClientRect();
        const viewport = root.getBoundingClientRect();
        if (bounds.left < viewport.left + STEPPER_MOBILE_PADDING) {
          root.scrollLeft += bounds.left - viewport.left - STEPPER_MOBILE_PADDING;
        } else if (bounds.right > viewport.right - STEPPER_MOBILE_PADDING) {
          root.scrollLeft += bounds.right - viewport.right + STEPPER_MOBILE_PADDING;
        }
      },
      [mobile],
    );
    const {
      focusableItemId,
      registerItem,
      onBlur: handleRovingBlur,
      onFocus: handleRovingFocus,
      onKeyDown: handleRovingKeyDown,
    } = useRovingFocus<HTMLButtonElement, string>({
      containerRef: rootRef,
      orientation,
      entryItemId: stepIds[activeStep] ?? null,
      preventScroll: mobile,
      fallbackRef: rootRef,
      isItemAvailable: isActionAvailable,
      onMoveFocus: revealFocusedItem,
    });
    const registerStep = useCallback(
      (step: StepRegistration) => {
        registrations.current.set(step.id, step);
        const unregisterAction = registerItem({
          id: step.id,
          ref: step.buttonRef,
          disabled: !step.interactive || !step.available,
        });
        return () => {
          unregisterAction();
          if (registrations.current.get(step.id) === step) registrations.current.delete(step.id);
        };
      },
      [registerItem],
    );
    const interactive = Boolean(onStepChange);
    const resolvedStepWidth =
      stepWidth !== undefined && Number.isFinite(stepWidth) && stepWidth > 0
        ? stepWidth
        : mobile
          ? STEPPER_MOBILE_STEP_WIDTH
          : undefined;

    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!mobile || !root) return;
      const alignCurrent = () => {
        const item = Array.from(registrations.current.values()).find(({ index }) => index === activeStep)?.itemRef
          .current;
        if (!item) return;
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

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (!event.defaultPrevented) handleRovingFocus(event);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      handleRovingBlur(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      handleRovingKeyDown(event);
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
        <StepList role="list" $orientation={orientation} $mobile={mobile} $stepWidth={resolvedStepWidth}>
          {steps.map((step, index) => (
            <StepperContext.Provider
              key={step.key ?? index}
              value={{
                stepId: stepIds[index],
                index,
                active: activeStep === index,
                dimension,
                orientation,
                colorMode,
                lineClamp,
                hideLine: index === steps.length - 1 && !showLastStepLine,
                focusableStepId: focusableItemId,
                onStepChange,
                statusLabels,
                registerStep,
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

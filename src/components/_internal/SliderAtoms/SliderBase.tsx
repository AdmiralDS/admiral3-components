import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, PointerEvent } from 'react';

import { SLIDER_TOOLTIP_KEYBOARD_DURATION } from './constants';
import { getSliderPositionStyle } from './position.style';
import { nearestSliderPoint } from './sliderMarks';
import { NativeSliderInput, SliderTooltipAnchor } from './style';
import type { SliderBaseProps } from './types';
import { Tooltip } from '../../Tooltip/Tooltip';

const SLIDER_CONTROL_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

export const SliderBase = forwardRef<HTMLInputElement, SliderBaseProps>(
  (
    {
      dimension,
      appearance,
      position,
      disabled,
      showTooltip,
      tooltipContent,
      segmentPositions,
      allowedValues,
      trackStyles,
      hideTrack = false,
      thumbOnly = false,
      onValueChange,
      onKeyDown,
      onKeyUp,
      onBlur,
      onPointerDown,
      onPointerUp,
      onPointerMove,
      onPointerLeave,
      style,
      'aria-valuetext': ariaValueText,
      ...props
    },
    ref,
  ) => {
    // Невидимый якорь совпадает с ползунком и нужен для позиционирования Tooltip и проверки наведения.
    const [targetElement, setTargetElement] = useState<HTMLSpanElement | null>(null);
    const [thumbHovered, setThumbHovered] = useState(false);
    // Нажатия указателем и клавиатурой завершаются разными событиями, поэтому отслеживаются отдельно.
    const [pointerPressed, setPointerPressed] = useState(false);
    const [keyboardPressed, setKeyboardPressed] = useState(false);
    // Подсказка после изменения с клавиатуры остаётся видимой и после отпускания клавиши.
    const [keyboardTooltip, setKeyboardTooltip] = useState(false);
    // Способ ввода нужен обработчику change, но его изменение само по себе не требует рендера.
    const keyboardInput = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // При размонтировании отменяем отложенное скрытие подсказки.
    useEffect(() => () => clearTimeout(timer.current), []);

    // Отпускание или отмена указателя за пределами input также должны снимать состояние нажатия.
    useEffect(() => {
      if (!pointerPressed || !targetElement) return;
      const document = targetElement.ownerDocument;
      const finish = () => setPointerPressed(false);
      document.addEventListener('pointerup', finish);
      document.addEventListener('pointercancel', finish);
      return () => {
        document.removeEventListener('pointerup', finish);
        document.removeEventListener('pointercancel', finish);
      };
    }, [pointerPressed, targetElement]);

    const handlePointerDown = (event: PointerEvent<HTMLInputElement>) => {
      // Изменения указателем не должны запускать таймер клавиатурной подсказки.
      keyboardInput.current = false;
      onPointerDown?.(event);
      // Учитываем отмену пользовательским обработчиком и только основной указатель с основной кнопкой.
      if (!event.defaultPrevented && !event.currentTarget.matches(':disabled') && event.isPrimary && event.button === 0)
        setPointerPressed(true);
    };

    const handlePointerUp = (event: PointerEvent<HTMLInputElement>) => {
      setPointerPressed(false);
      onPointerUp?.(event);
    };

    // У нативного ползунка нет отдельного DOM-элемента: проверяем наведение по границам якоря,
    // чтобы hover на дорожке не включал hover-стили ползунка и Tooltip.
    const handlePointerMove = (event: PointerEvent<HTMLInputElement>) => {
      if (targetElement && !event.currentTarget.matches(':disabled')) {
        const rect = targetElement.getBoundingClientRect();
        setThumbHovered(
          event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom,
        );
      } else setThumbHovered(false);
      onPointerMove?.(event);
    };

    const handlePointerLeave = (event: PointerEvent<HTMLInputElement>) => {
      setThumbHovered(false);
      onPointerLeave?.(event);
    };

    const handleValueChange = (next: number) => {
      onValueChange(next);
      if (showTooltip && keyboardInput.current) {
        // Каждое изменение с клавиатуры заново запускает двухсекундный показ подсказки.
        clearTimeout(timer.current);
        setKeyboardTooltip(true);
        timer.current = setTimeout(() => setKeyboardTooltip(false), SLIDER_TOOLTIP_KEYBOARD_DURATION);
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.matches(':disabled')) return;
      if (allowedValues?.length) {
        event.currentTarget.value = String(nearestSliderPoint(event.currentTarget.valueAsNumber, allowedValues));
      }
      handleValueChange(event.currentTarget.valueAsNumber);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      // Только управляющие клавиши включают состояние нажатия.
      if (
        !event.currentTarget.matches(':disabled') &&
        !event.defaultPrevented &&
        SLIDER_CONTROL_KEYS.includes(event.key)
      ) {
        keyboardInput.current = true;
        setKeyboardPressed(true);
        if (allowedValues?.length) {
          event.preventDefault();
          const input = event.currentTarget;
          const current = nearestSliderPoint(input.valueAsNumber, allowedValues);

          let nextIndex: number;
          if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = allowedValues.length - 1;
          else {
            const index = allowedValues.indexOf(current);
            const direction = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(event.key) ? 1 : -1;
            nextIndex = index + direction;
          }

          nextIndex = Math.min(allowedValues.length - 1, Math.max(0, nextIndex));
          const next = allowedValues[nextIndex];
          if (next !== current) {
            handleValueChange(next);
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
      // Снимаем нажатие, сохраняя подсказку до истечения таймера.
      setKeyboardPressed(false);
      onKeyUp?.(event);
    };

    // Потеря фокуса завершает клавиатурное взаимодействие и отменяет его подсказку.
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      keyboardInput.current = false;
      setKeyboardPressed(false);
      setKeyboardTooltip(false);
      clearTimeout(timer.current);
      onBlur?.(event);
    };

    const isPressed = !disabled && (pointerPressed || keyboardPressed);
    // Tooltip видим при наведении на ползунок, нажатии указателем или временном показе с клавиатуры.
    const isTooltipVisible = showTooltip && !disabled && (thumbHovered || pointerPressed || keyboardTooltip);

    return (
      <>
        <SliderTooltipAnchor
          ref={setTargetElement}
          $dimension={dimension}
          style={getSliderPositionStyle(position)}
          aria-hidden="true"
        />
        <NativeSliderInput
          ref={ref}
          type="range"
          disabled={disabled}
          aria-valuetext={
            ariaValueText ??
            (typeof tooltipContent === 'string' || typeof tooltipContent === 'number'
              ? String(tooltipContent)
              : undefined)
          }
          $dimension={dimension}
          $appearance={appearance}
          $segmentPositions={segmentPositions}
          $trackStyles={trackStyles}
          $hideTrack={hideTrack}
          $thumbOnly={thumbOnly}
          style={getSliderPositionStyle(position, style)}
          data-thumb-hovered={!disabled && thumbHovered ? '' : undefined}
          data-pressed={isPressed ? '' : undefined}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          {...props}
        />
        {isTooltipVisible && (
          <Tooltip targetElement={targetElement} dimension="s" tooltipPosition="top">
            {tooltipContent}
          </Tooltip>
        )}
      </>
    );
  },
);
SliderBase.displayName = 'SliderBase';

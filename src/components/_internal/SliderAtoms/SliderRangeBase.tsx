import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';

import { normalizeSliderValue } from './normalizeSliderValue';
import { getSliderRangePositionStyle } from './position.style';
import { SliderRangeContainer, SliderRangeTrack } from './range.style';
import { SliderBase } from './SliderBase';
import type { SliderRangeBaseProps } from './types';
import { refSetter } from '../../../utils/refSetter';

/** Два нативных ползунка на общей шкале. Подписи и состояние значения принадлежат владельцу. */
export const SliderRangeBase = ({
  dimension,
  thumbAppearance,
  min,
  max,
  step,
  value: [lower, upper],
  onChange,
  allowSwap,
  minValueDistance,
  disabled,
  showTooltip,
  lowerTooltipContent,
  upperTooltipContent,
  lowerNativeSliderProps,
  upperNativeSliderProps,
  lowerNativeSliderRef,
  upperNativeSliderRef,
}: SliderRangeBaseProps) => {
  const { onFocus: onLowerFocus, ...lowerProps } = lowerNativeSliderProps ?? {};
  const { onFocus: onUpperFocus, ...upperProps } = upperNativeSliderProps ?? {};
  // Границы, шаг и значения уже нормализованы публичным SliderRange.
  // Проценты общей шкалы нужны для заливки диапазона, якорей Tooltip и выбора ближайшего Handle.
  const lowerPosition = max > min ? ((lower - min) / (max - min)) * 100 : 0;
  const upperPosition = max > min ? ((upper - min) / (max - min)) * 100 : 0;
  const lowerRef = useRef<HTMLInputElement>(null);
  const upperRef = useRef<HTMLInputElement>(null);
  // Внешние refs следуют логическим границам, сами DOM-input при обмене не перемонтируются.
  const mergedLowerRef = useCallback(
    (input: HTMLInputElement | null) => refSetter(lowerRef, lowerNativeSliderRef)(input),
    [lowerNativeSliderRef],
  );
  const mergedUpperRef = useCallback(
    (input: HTMLInputElement | null) => refSetter(upperRef, upperNativeSliderRef)(input),
    [upperNativeSliderRef],
  );
  // Активный input располагается выше второго: это определяет получателя событий при наложении Handle.
  const [activeThumb, setActiveThumb] = useState<'lower' | 'upper'>('upper');
  // DOM-ползунки сохраняют порядок и нативный drag; при пересечении меняются только их роли.
  const [swapped, setSwapped] = useState(false);
  const pendingSwap = useRef<{ lower: number; upper: number; previous: boolean } | null>(null);
  // Во время нативного перетаскивания наведение не меняет выбранный DOM-ползунок.
  const dragging = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    const pending = pendingSwap.current;
    if (!pending) return;
    pendingSwap.current = null;
    // Если controlled-владелец отклонил изменение, восстанавливаем и роль ползунка.
    if (pending.lower !== lower || pending.upper !== upper) setSwapped(pending.previous);
  }, [lower, upper, swapped]);

  // Во время drag разрешаем обмен; клавиатура сохраняет роль и ограничение соседней границей.
  const change = (bound: 'lower' | 'upper', next: number) => {
    if (disabled || (bound === 'lower' ? lowerRef : upperRef).current?.matches(':disabled')) return;
    const normalized = normalizeSliderValue(next, min, max, step);
    const distance = dragging.current ? 0 : minValueDistance;
    const crossing = allowSwap && dragging.current && (bound === 'lower' ? normalized > upper : normalized < lower);
    const nextLower =
      bound === 'lower'
        ? normalizeSliderValue(Math.min(upper - distance, normalized), min, max, step)
        : crossing
          ? normalized
          : lower;
    const nextUpper =
      bound === 'upper'
        ? normalizeSliderValue(Math.max(lower + distance, normalized), min, max, step)
        : crossing
          ? normalized
          : upper;
    if (nextLower !== lower || nextUpper !== upper) {
      if (crossing) {
        pendingSwap.current = { lower: nextLower, upper: nextUpper, previous: swapped };
        setSwapped(!swapped);
      }
      setActiveThumb(crossing ? (bound === 'lower' ? 'upper' : 'lower') : bound);
      onChange([nextLower, nextUpper]);
    }
  };

  const finishDrag = useCallback(() => {
    const input = dragging.current;
    dragging.current = null;
    if (!input || disabled || input.matches(':disabled')) return;
    if (Number((upper - lower).toPrecision(15)) >= minValueDistance) return;
    // Роль определяем по актуальным refs, поскольку за время жеста ползунки могли обменяться ролями.
    const isLower = input === lowerRef.current;
    const next = normalizeSliderValue(isLower ? upper - minValueDistance : lower + minValueDistance, min, max, step);
    const interval: [number, number] = isLower ? [next, upper] : [lower, next];
    // Если активный ползунок упёрся в край, недостающий зазор восстанавливаем движением соседа.
    if (Number((interval[1] - interval[0]).toPrecision(15)) < minValueDistance) {
      if (isLower) interval[1] = normalizeSliderValue(next + minValueDistance, min, max, step);
      else interval[0] = normalizeSliderValue(next - minValueDistance, min, max, step);
    }
    if (interval[0] !== lower || interval[1] !== upper) onChange(interval);
  }, [disabled, lower, upper, minValueDistance, min, max, step, onChange]);

  // Отпускание или отмена указателя вне контейнера также завершают жест и восстанавливают зазор.
  useEffect(() => {
    const ownerDocument = lowerRef.current?.ownerDocument;
    ownerDocument?.addEventListener('pointerup', finishDrag);
    ownerDocument?.addEventListener('pointercancel', finishDrag);
    return () => {
      ownerDocument?.removeEventListener('pointerup', finishDrag);
      ownerDocument?.removeEventListener('pointercancel', finishDrag);
    };
  }, [finishDrag]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // При движении указателя поднимаем ближайший Handle через z-index, чтобы он мог принять нажатие.
    // Значение при перетаскивании меняет нативный input; результат приходит через onValueChange в change.
    // Во время перетаскивания сохраняем выбранный Handle, а касания обрабатываем в handlePointerDown.
    // При совпадении сохраняем последний использованный Handle, не меняя его наведением.
    if (dragging.current || disabled || lower === upper || event.pointerType === 'touch') return;
    const box = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - box.left) / box.width) * 100;
    // Середина между Handle разделяет области выбора; при равном расстоянии выбираем верхнюю границу.
    setActiveThumb(position < (lowerPosition + upperPosition) / 2 ? 'lower' : 'upper');
  };
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Принимаем только основной указатель и основную кнопку у доступного компонента.
    if (disabled || lowerRef.current?.matches(':disabled') || !event.isPrimary || event.button !== 0) return;
    // Сравниваем сами inputs: их конструктор может принадлежать другому окну при рендеринге в iframe.
    // Нажатие на ползунок оставляем нативному механизму перетаскивания.
    if (event.target === lowerRef.current || event.target === upperRef.current) {
      dragging.current = event.target as HTMLInputElement;
      setActiveThumb(event.target === lowerRef.current ? 'lower' : 'upper');
      return;
    }
    // Нажатие на общую дорожку перемещает ближайший Handle; координату ограничиваем краями шкалы.
    const box = event.currentTarget.getBoundingClientRect();
    const position = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    const bound = position * 100 < (lowerPosition + upperPosition) / 2 ? 'lower' : 'upper';
    setActiveThumb(bound);
    change(bound, min + position * (max - min));
  };
  const handleLowerChange = (next: number) => {
    change('lower', next);
  };
  const handleUpperChange = (next: number) => {
    change('upper', next);
  };
  // Клавиатурный фокус также поднимает соответствующий input; внешний обработчик сохраняется.
  const handleLowerFocus = (event: FocusEvent<HTMLInputElement>) => {
    setActiveThumb('lower');
    onLowerFocus?.(event);
  };
  const handleUpperFocus = (event: FocusEvent<HTMLInputElement>) => {
    setActiveThumb('upper');
    onUpperFocus?.(event);
  };

  // Одинаковые нативные min/max сохраняют общую геометрию inputs; порядок границ поддерживает change.
  // Собственные дорожки скрыты: рисуем одну общую, pointer-события inputs принимает только Handle.
  const sharedProps = {
    dimension,
    thumbAppearance,
    min,
    max,
    step,
    disabled,
    showTooltip,
    hideTrack: true,
    thumbOnly: true,
  };

  const lowerThumbProps = {
    ref: mergedLowerRef,
    'data-bound': 'lower',
    value: lower,
    position: lowerPosition,
    tooltipContent: lowerTooltipContent,
    'aria-valuemin': min,
    'aria-valuemax': Math.max(lower, upper - minValueDistance),
    tabIndex: disabled ? -1 : 0,
    onValueChange: handleLowerChange,
    onFocus: handleLowerFocus,
    ...lowerProps,
  };
  const upperThumbProps = {
    ref: mergedUpperRef,
    'data-bound': 'upper',
    value: upper,
    position: upperPosition,
    tooltipContent: upperTooltipContent,
    'aria-valuemin': Math.min(upper, lower + minValueDistance),
    'aria-valuemax': max,
    tabIndex: disabled ? -1 : 0,
    onValueChange: handleUpperChange,
    onFocus: handleUpperFocus,
    ...upperProps,
  };

  return (
    <SliderRangeContainer
      $dimension={dimension}
      // При совпадении на краю поднимаем Handle, который может двигаться внутрь шкалы.
      $activeThumb={lower === upper ? (lower === min ? 'upper' : lower === max ? 'lower' : activeThumb) : activeThumb}
      data-disabled={disabled ? '' : undefined}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <SliderRangeTrack style={getSliderRangePositionStyle(lowerPosition, upperPosition, dimension)} />
      {/* Aria-границы учитывают соседний Handle, сохраняя общие нативные min/max. */}
      <SliderBase {...sharedProps} {...(swapped ? upperThumbProps : lowerThumbProps)} />
      <SliderBase {...sharedProps} {...(swapped ? lowerThumbProps : upperThumbProps)} />
    </SliderRangeContainer>
  );
};

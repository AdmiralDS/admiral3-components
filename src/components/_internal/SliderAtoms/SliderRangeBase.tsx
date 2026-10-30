import { useEffect, useMemo, useRef, useState } from 'react';
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
  appearance,
  min,
  max,
  step,
  value: [lower, upper],
  onChange,
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
  // Сохраняем доступ к inputs для установки фокуса и передаём те же элементы внешним ref.
  const mergedLowerRef = useMemo(() => refSetter(lowerRef, lowerNativeSliderRef), [lowerNativeSliderRef]);
  const mergedUpperRef = useMemo(() => refSetter(upperRef, upperNativeSliderRef), [upperNativeSliderRef]);
  // Активный input располагается выше второго: это определяет получателя событий при наложении Handle.
  const [activeThumb, setActiveThumb] = useState<'lower' | 'upper'>('upper');
  // Во время нативного перетаскивания не переключаем активный Handle; флаг не участвует в отрисовке.
  const dragging = useRef(false);

  // Отпускание или отмена указателя вне контейнера тоже должны завершать перетаскивание.
  useEffect(() => {
    const ownerDocument = lowerRef.current?.ownerDocument;
    const finish = () => {
      dragging.current = false;
    };
    ownerDocument?.addEventListener('pointerup', finish);
    ownerDocument?.addEventListener('pointercancel', finish);
    return () => {
      ownerDocument?.removeEventListener('pointerup', finish);
      ownerDocument?.removeEventListener('pointercancel', finish);
    };
  }, []);

  // Ограничиваем изменяемую границу соседней и сообщаем владельцу только о реальном изменении.
  const change = (bound: 'lower' | 'upper', next: number) => {
    if (disabled || (bound === 'lower' ? lowerRef : upperRef).current?.matches(':disabled')) return;
    const normalized = normalizeSliderValue(next, min, max, step);
    const nextLower = bound === 'lower' ? Math.min(upper, normalized) : lower;
    const nextUpper = bound === 'upper' ? Math.max(lower, normalized) : upper;
    if (nextLower !== lower || nextUpper !== upper) {
      setActiveThumb(bound);
      onChange([nextLower, nextUpper]);
    }
  };

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
      dragging.current = true;
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
  const handlePointerEnd = () => {
    dragging.current = false;
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

  // Одинаковые нативные min/max сохраняют общую геометрию inputs; пересечение ограничивает change.
  // Собственные дорожки скрыты: рисуем одну общую, pointer-события inputs принимает только Handle.
  const sharedProps = {
    dimension,
    appearance,
    min,
    max,
    step,
    disabled,
    showTooltip,
    hideTrack: true,
    thumbOnly: true,
  };

  return (
    <SliderRangeContainer
      $dimension={dimension}
      // При совпадении на краю поднимаем Handle, который может двигаться внутрь шкалы.
      $activeThumb={lower === upper ? (lower === min ? 'upper' : lower === max ? 'lower' : activeThumb) : activeThumb}
      data-disabled={disabled ? '' : undefined}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <SliderRangeTrack style={getSliderRangePositionStyle(lowerPosition, upperPosition, dimension)} />
      {/* Aria-границы учитывают соседний Handle, сохраняя общие нативные min/max. */}
      <SliderBase
        {...sharedProps}
        ref={mergedLowerRef}
        data-bound="lower"
        value={lower}
        position={lowerPosition}
        tooltipContent={lowerTooltipContent}
        aria-valuemin={min}
        aria-valuemax={upper}
        tabIndex={disabled ? -1 : 0}
        onValueChange={handleLowerChange}
        onFocus={handleLowerFocus}
        {...lowerProps}
      />
      <SliderBase
        {...sharedProps}
        ref={mergedUpperRef}
        data-bound="upper"
        value={upper}
        position={upperPosition}
        tooltipContent={upperTooltipContent}
        aria-valuemin={lower}
        aria-valuemax={max}
        tabIndex={disabled ? -1 : 0}
        onValueChange={handleUpperChange}
        onFocus={handleUpperFocus}
        {...upperProps}
      />
    </SliderRangeContainer>
  );
};

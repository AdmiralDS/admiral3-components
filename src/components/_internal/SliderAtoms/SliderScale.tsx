import { SliderScaleLabel, SliderScaleRow } from './scale.style';
import { SliderTextRow } from './style';
import type { SliderScaleProps } from './types';
import { hasSlotContent } from '../../../utils/hasSlotContent';

/** Подписи отметок в числовых позициях; значения выбранного участка выделены. */
export const SliderScale = ({
  dimension,
  hasStart = false,
  hasEnd = false,
  values,
  currentValue,
  renderMarks = String,
  min,
  max,
  onSelect,
  disabled = false,
}: SliderScaleProps) => {
  const labels = [...new Set(values)].flatMap((value) => {
    const label = renderMarks?.(value);
    return hasSlotContent(label) ? [{ value, label }] : [];
  });
  if (!labels.length) return null;
  return (
    <SliderTextRow $dimension={dimension} $hasStart={hasStart} $hasEnd={hasEnd}>
      <SliderScaleRow $dimension={dimension}>
        {labels.map(({ value, label }) => {
          const handleClick = () => onSelect(value);
          return (
            <SliderScaleLabel
              key={value}
              $position={max > min ? ((value - min) / (max - min)) * 100 : 0}
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={handleClick}
              data-min={value === min ? '' : undefined}
              data-max={value === max ? '' : undefined}
              data-passed={currentValue !== undefined && value <= currentValue ? '' : undefined}
              data-future={currentValue !== undefined && value > currentValue ? '' : undefined}
            >
              {label}
            </SliderScaleLabel>
          );
        })}
      </SliderScaleRow>
    </SliderTextRow>
  );
};

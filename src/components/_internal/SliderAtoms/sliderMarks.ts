import { normalizeSliderValue } from './normalizeSliderValue';

/** Только переданные отметки внутри шкалы, без дублей и недопустимых чисел. */
export const getSliderMarks = (min: number, max: number, marks: readonly number[] = []) =>
  [...new Set(marks.filter((point) => Number.isFinite(point) && point >= min && point <= max))].sort((a, b) => a - b);

export const nearestSliderPoint = (value: number, points: readonly number[]) =>
  points.reduce(
    (nearest, point) => (Math.abs(point - value) <= Math.abs(nearest - value) ? point : nearest),
    points[0],
  );

export const normalizeSliderSelection = (
  value: number,
  min: number,
  max: number,
  step: number | null,
  points: readonly number[],
) =>
  step === null
    ? nearestSliderPoint(Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min, points)
    : normalizeSliderValue(value, min, max, step);

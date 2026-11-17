/** Приводит значение к допустимому шагу нативного range относительно min. */
export const normalizeSliderValue = (value: number, min: number, max: number, step: number) => {
  const bounded = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const lastStep = Math.floor(Number(((max - min) / step).toPrecision(15)));
  const index = Math.min(lastStep, Math.max(0, Math.round((bounded - min) / step)));
  return Number((min + index * step).toPrecision(15));
};

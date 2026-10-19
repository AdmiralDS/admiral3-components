const RECT_KEYS = ['height', 'width', 'x', 'y'] as const;

type RectKey = (typeof RECT_KEYS)[number];

export type Rect = Readonly<Record<RectKey, number>>;

/** Сравнивает свойства прямоугольника, определяющие его положение и размер. */
export const rectChanged = (previous: Rect | undefined, next: Rect) =>
  !previous || RECT_KEYS.some((key) => previous[key] !== next[key]);

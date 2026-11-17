import { textStyles } from '@admiral-ds/admiral3-tokens';

export const SLIDER_DIMENSIONS = ['m', 's', 'xs'] as const;
export const SLIDER_THUMB_APPEARANCES = ['stroke', 'filled'] as const;
export const SLIDER_DIMENSION_PARAMETERS = {
  m: { controlSize: 24, thumbSize: 18, thumbBorderWidthPress: 4, gap: 8, typography: textStyles.body.body1Short },
  s: { controlSize: 20, thumbSize: 16, thumbBorderWidthPress: 4, gap: 8, typography: textStyles.body.body2Short },
  xs: { controlSize: 16, thumbSize: 14, thumbBorderWidthPress: 3, gap: 6, typography: textStyles.caption.caption1 },
} as const;
export const SLIDER_TRACK_HEIGHT = 4;
export const SLIDER_THUMB_BORDER_WIDTH = 2;
export const SLIDER_FOCUS_OUTLINE_WIDTH = 4;
export const SLIDER_VERTICAL_GAP = 6;
export const SLIDER_TOOLTIP_KEYBOARD_DURATION = 2000;
/** Промежуток между сегментами в master Slider Steps. */
export const SLIDER_SEGMENT_GAP = 3;

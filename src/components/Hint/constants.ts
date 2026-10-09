export const HINT_OFFSET = 8;
export const HINT_MAX_HEIGHT = 320;
export const HINT_PADDING = '8px 0';
export const HINT_CONTENT_PADDING = '4px 16px';
export const HINT_CLOSE_BUTTON = {
  size: 20,
  top: 12,
  right: 16,
  gap: 12,
} as const;
export const HINT_CONTENT_PADDING_WITH_CLOSE = `4px ${
  HINT_CLOSE_BUTTON.right + HINT_CLOSE_BUTTON.size + HINT_CLOSE_BUTTON.gap
}px 4px 16px`;

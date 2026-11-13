import { getHintTooltipLayouts, type HintTooltipPositionConfig } from '../_internal/FloatingPortal';

export const HINT_OFFSET = 8;
export const HINT_LAYOUTS = getHintTooltipLayouts(HINT_OFFSET);
export const HINT_MOBILE_BREAKPOINT = 640;
export const HINT_MAX_HEIGHT = 320;
export const HINT_PADDING = '8px 0';
export const HINT_CONTENT_PADDING = '4px 16px';
export const HINT_CLOSE_BUTTON_POSITION = {
  top: 12,
  right: 16,
} as const;
export const HINT_CONTENT_PADDING_WITH_CLOSE = '4px 48px 4px 16px';

const HINT_POSITION_PRIORITY = [
  'bottomRight',
  'bottomLeft',
  'topRight',
  'topLeft',
  'leftBottom',
  'leftTop',
  'rightBottom',
  'rightTop',
  'bottom',
  'top',
  'left',
  'right',
  'bottomPageCenter',
  'topPageCenter',
] as const;

export const HINT_POSITION_CONFIG: HintTooltipPositionConfig = {
  positionPriority: HINT_POSITION_PRIORITY,
  positionPriorityByPosition: {
    bottom: ['bottomRight', 'bottomLeft', 'bottom', 'bottomPageCenter'],
    top: ['topRight', 'topLeft', 'top', 'topPageCenter'],
    left: ['leftBottom', 'leftTop', 'left'],
    right: ['rightBottom', 'rightTop', 'right'],
  },
  fallbackPosition: (position) => {
    switch (position) {
      case 'left':
        return 'leftBottom';
      case 'right':
        return 'rightBottom';
      case 'top':
        return 'topRight';
      case 'bottom':
      default:
        return 'bottomRight';
    }
  },
  offset: HINT_OFFSET,
  /** Второй проход по доступному месту в документе — стратегия именно для Hint. У Hint обычно более длинный
   * жизненный цикл, чем у Tooltip: он может содержать интерактивный контент и оставаться открытым во время
   * прокрутки. Поэтому реалистичен сценарий, когда Hint сейчас не помещается, но станет видимым после прокрутки. */
  checkDocumentScroll: true,
};

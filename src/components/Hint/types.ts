import type { AriaAttributes, CSSProperties, HTMLAttributes, ReactNode, RefCallback } from 'react';

import type { HINT_DIMENSIONS } from './constants';
import type { TooltipAnchorSide, TooltipPosition } from '../Tooltip/types';

export type HintDimension = (typeof HINT_DIMENSIONS)[number];
export type HintPosition = TooltipPosition;

export interface HintProps extends HTMLAttributes<HTMLDivElement> {
  /** Размер компонента. Значение по умолчанию 'm'. */
  dimension?: HintDimension;
  /** Содержимое Hint. */
  children?: ReactNode;
  /** Элемент, относительно которого позиционируется Hint. */
  targetElement: Element | null;
  /** Предпочтительное направление открытия Hint. */
  hintPosition?: HintPosition;
}

export interface UseHintOptions {
  /** Задержка открытия Hint при наведении в миллисекундах. */
  delay?: number;
  /**
   * Элемент, относительно которого позиционируется Hint. Если не задан, Hint позиционируется
   * относительно элемента-триггера из triggerProps. Не участвует в управлении видимостью:
   * наведение и фокус на этом элементе не открывают и не удерживают Hint.
   */
  targetElement?: Element | null;
}

export interface UseHintResult<T extends HTMLElement = HTMLElement> {
  /** Признак видимости Hint. */
  isVisible: boolean;
  /** Готовые свойства для элемента-триггера, управляющего видимостью Hint. */
  triggerProps: {
    ref: RefCallback<T>;
    'aria-describedby': AriaAttributes['aria-describedby'];
  };
  /** Готовые свойства, связывающие Hint с элементом позиционирования. */
  hintProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: Element | null;
  };
}

export interface StyledHintProps {
  $dimension: HintDimension;
}

export interface StyledHintWrapperProps {
  $margin: CSSProperties['margin'];
  $anchorSide: TooltipAnchorSide;
  $alignSelf: CSSProperties['alignSelf'];
}

export interface StyledPortalProps {
  $flexDirection?: CSSProperties['flexDirection'];
}

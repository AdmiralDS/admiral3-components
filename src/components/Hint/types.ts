import type {
  AriaAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  RefCallback,
} from 'react';

import type { ComponentStyleConfig } from '../../types';
import type { DataAttributes } from '../../utils/dataAttributes';
import type { TooltipAnchorSide, TooltipPosition } from '../Tooltip/types';

export type HintPosition = TooltipPosition;
export type HintTriggerMode = 'hover' | 'click';
export type HintCloseButtonProps = AriaAttributes &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'className' | 'title' | 'tabIndex'> &
  DataAttributes;

export interface HintProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  /** Содержимое Hint. */
  children?: ReactNode;
  /** Элемент, относительно которого позиционируется Hint. */
  targetElement: Element | null;
  /** Предпочтительное направление открытия Hint. */
  hintPosition?: HintPosition;
  /** Пользовательские стили Hint. */
  hintStyles?: ComponentStyleConfig;
  /** Отображает внутри Hint кнопку с иконкой закрытия. */
  showCloseIcon?: boolean;
  /** Вызывается при нажатии на кнопку с иконкой закрытия. */
  onClose?: () => void;
  /** Безопасные HTML-, ARIA- и data-атрибуты кнопки закрытия. */
  closeButtonProps?: HintCloseButtonProps;
}

export interface UseHintOptions {
  /**
   * Способ управления видимостью Hint. Значение по умолчанию 'hover'.
   *
   * В режиме 'click' для ненативного элемента-триггера потребитель обязан самостоятельно задать
   * `role="button"` и `tabIndex={0}`. Без них доступность триггера и клавиатурная навигация не гарантируются.
   */
  triggerMode?: HintTriggerMode;
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
  /**
   * Готовые свойства для элемента-триггера, управляющего видимостью Hint.
   * Для ненативного интерактивного элемента дополнительно требуются `role="button"` и `tabIndex={0}`.
   */
  triggerProps: {
    ref: RefCallback<T>;
    id?: string;
    'aria-describedby'?: AriaAttributes['aria-describedby'];
    'aria-expanded'?: AriaAttributes['aria-expanded'];
    'aria-controls'?: AriaAttributes['aria-controls'];
    'aria-haspopup'?: AriaAttributes['aria-haspopup'];
  };
  /** Готовые свойства, связывающие Hint с элементом позиционирования. */
  hintProps: {
    ref: RefCallback<HTMLDivElement>;
    id: string;
    targetElement: Element | null;
    showCloseIcon?: boolean;
    onClose?: () => void;
    role?: HTMLAttributes<HTMLDivElement>['role'];
    'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  };
}

export interface StyledHintProps {
  $cssMixin?: ComponentStyleConfig['cssMixin'];
}

export interface StyledHintContentProps {
  $showCloseIcon: boolean;
}

export interface StyledHintWrapperProps {
  $margin: CSSProperties['margin'];
  $anchorSide: TooltipAnchorSide;
  $alignSelf: CSSProperties['alignSelf'];
}

export interface StyledPortalProps {
  $flexDirection?: CSSProperties['flexDirection'];
}

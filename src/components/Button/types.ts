import type { BUTTON_APPEARANCES, BUTTON_DIMENSIONS, BUTTON_COLOR_MODES, BUTTON_LOADING_POSITIONS } from './constants';

/** Цветовой вариант Button. */
export type ButtonAppearance = (typeof BUTTON_APPEARANCES)[number];
/** Размер Button. */
export type ButtonDimension = (typeof BUTTON_DIMENSIONS)[number];
/** Режим цветового окрашивания Button. */
export type ButtonColorMode = (typeof BUTTON_COLOR_MODES)[number];
/** Варианты отображения Spinner относительно контента Button (слева или справа). */
export type ButtonLoadingPosition = (typeof BUTTON_LOADING_POSITIONS)[number];

/** Пользовательский цвет фона Button. */
export interface BackgroundColorConfig {
  /** Базовый цвет фона Button. */
  rest: string;
  /** Цвет фона Button в состоянии hover. */
  hover: string;
  /** Цвет фона Button в состоянии press. */
  press: string;
}

/** Пользовательские цвета Button.
 *
 * По умолчанию Button окрашивается согласно своему appearance,
 * с помощью свойств ButtonColorConfig можно частично или полностью изменить
 * цветовое окрашивание Button. Кроме режимов colorMode='neutral' и colorMode='staticWhite',
 * когда кнопка находится в данных режимах, она не подлежит кастомизации.
 **/
export interface ButtonColorConfig {
  /** Цвет фона Button. */
  backgroundColor?: BackgroundColorConfig;
  /** Цвет фона Button в disabled состоянии. */
  backgroundColorDisabled?: string;
  /** Цвет текста/иконок Button. */
  textColor?: string;
  /** Цвет текста/иконок Button в disabled состоянии. */
  textColorDisabled?: string;
  /** Цвет обводки Button. */
  borderColor?: string;
  /** Цвет обводки Button в disabled состоянии. */
  borderColorDisabled?: string;
  /** Цвет контура фокуса Button. */
  focusColor?: string;
}

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Размер Button. Значение по умолчанию 'm'. */
  dimension?: ButtonDimension;
  /** Пользовательские цвета Button. */
  colorConfig?: ButtonColorConfig;
  /**
   * Отображение Button в disabled-стиле, сохраняя фокус и обработку нажатий.
   * Используйте, когда основное действие недоступно, но по нажатию на кнопку
   * нужно объяснить причину блокировки (н-р, через нотификацию или тултип).
   */
  inactive?: boolean;
  /** Отображение Button квадратной */
  square?: boolean;
  /** Отображение Spinner для визуализации состояния загрузки. */
  loading?: boolean;
  /** Отображение Spinner сбоку от основного контента кнопки (слева/справа).
   * Если параметр не задан, то Spinner отображается поверх
   * контента Button по центру, сохраняя изначальную ширину компонента. */
  loadingPosition?: ButtonLoadingPosition;
  /** Состояние скелетона. */
  skeleton?: boolean;
  /** Содержимое компонента. */
  children?: React.ReactNode;
}

export interface SolidGhostAppearanceProps extends BaseButtonProps {
  /** Цветовой вариант Button. */
  appearance?: Extract<ButtonAppearance, 'solid' | 'ghost'>;
  /** Режим цветового окрашивания Button. Значение по умолчанию 'colored'. */
  colorMode?: Exclude<ButtonColorMode, 'staticWhite'>;
}

export interface FlatOutlineAppearanceProps extends BaseButtonProps {
  /** Цветовой вариант Button. */
  appearance: Extract<ButtonAppearance, 'flat' | 'outline'>;
  /** Режим цветового окрашивания Button. Значение по умолчанию 'colored'. */
  colorMode?: ButtonColorMode;
}

export type ButtonProps = SolidGhostAppearanceProps | FlatOutlineAppearanceProps;

export interface StyledButtonProps {
  $appearance: ButtonAppearance;
  $buttonGroup?: boolean;
  $colorMode: ButtonColorMode;
  $dimension: ButtonDimension;
  $colorConfig?: ButtonColorConfig;
  $inactive?: boolean;
  $square?: boolean;
  $loading?: boolean;
  $loadingPosition?: ButtonLoadingPosition;
  $skeleton?: boolean;
}

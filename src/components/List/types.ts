import type {
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
  SVGProps,
} from 'react';

import type { css } from 'styled-components';

import type { LIST_DIMENSIONS, ORDERED_LIST_TYPE, UNORDERED_LIST_TYPE } from './constants';

export type ListDimension = (typeof LIST_DIMENSIONS)[number];
export type OrderedListType = (typeof ORDERED_LIST_TYPE)[number];
export type UnorderedListType = (typeof UNORDERED_LIST_TYPE)[number];

export interface OrderedListProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'reversed'> {
  /** Размер компонента */
  dimension?: ListDimension;
  /** Стиль маркеров в списке */
  styleType?: OrderedListType;
  /** Расстояние между пунктами списка. По умолчанию 8px */
  gap?: CSSProperties['gap'];
  /** Css mixin для кастомизации стилей маркера */
  markerCssMixin?: ReturnType<typeof css>;
}

export interface UnorderedListProps extends HTMLAttributes<HTMLUListElement> {
  /** Размер компонента */
  dimension?: ListDimension;
  /** Стиль маркеров в списке */
  styleType?: UnorderedListType;
  /** Расстояние между пунктами списка. По умолчанию 8px */
  gap?: CSSProperties['gap'];
  /** Css mixin для кастомизации стилей маркера */
  markerCssMixin?: ReturnType<typeof css>;
}

export interface StyledListProps {
  $styleType: OrderedListType | UnorderedListType;
  $dimension: ListDimension;
  $gap: CSSProperties['gap'];
  $markerCssMixin?: ReturnType<typeof css>;
}

export interface StyledOrderedListProps extends StyledListProps {
  start?: number;
}

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Содержимое компонента. */
  children?: ReactNode;
  /** Номер пункта упорядоченного списка. */
  value?: number;
}

/**
 * ListIcon является декоративным и скрыт от accessibility tree.
 * Accessibility-атрибуты использовать не следует.
 */
export interface ListIconProps extends SVGProps<SVGSVGElement> {
  /** Элемент, который будет отрисован в качестве иконки */
  as: ComponentType<SVGProps<SVGSVGElement>>;
  /** Цвет иконки */
  color?: string;
}

export interface StyledListIconProps {
  $color?: string;
}

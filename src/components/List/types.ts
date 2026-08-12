import type { HTMLAttributes, SVGAttributes, ReactNode, CSSProperties } from 'react';

import type { css } from 'styled-components';

import type { LIST_DIMENSIONS, ORDERED_LIST_TYPE, UNORDERED_LIST_TYPE } from './constants';

export type ListDimension = (typeof LIST_DIMENSIONS)[number];
export type OrderedListType = (typeof ORDERED_LIST_TYPE)[number];
export type UnorderedListType = (typeof UNORDERED_LIST_TYPE)[number];

export interface OrderedListProps extends HTMLAttributes<HTMLOListElement> {
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

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Содержимое компонента. */
  children?: ReactNode;
}

export interface ListIconProps extends SVGAttributes<SVGSVGElement> {
  /** Элемент, который будет отрисован в качестве иконки */
  as: React.ElementType;
  /** Цвет иконки */
  color?: string;
}

export interface StyledListIconProps {
  $color?: string;
}

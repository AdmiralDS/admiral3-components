import type { ComponentType, CSSProperties, HTMLAttributes, LiHTMLAttributes, ReactNode, SVGProps } from 'react';

import type { css } from 'styled-components';

import type { LIST_DIMENSIONS, ORDERED_LIST_TYPE, UNORDERED_LIST_TYPE } from './constants';

export type ListDimension = (typeof LIST_DIMENSIONS)[number];
export type OrderedListType = (typeof ORDERED_LIST_TYPE)[number];
export type UnorderedListType = (typeof UNORDERED_LIST_TYPE)[number];

// Внутреннее архитектурное решение: для точного контроля размеров и выравнивания маркера, расстояния до текста,
// многострочной вёрстки и пользовательских иконок пункты используют display: inline-flex вместо нативного
// display: list-item. Браузерный маркер отключён, а маркеры и нумерация создаются псевдоэлементом и CSS-счётчиком.
// Поэтому OrderedList принимает общие HTML-атрибуты и не поддерживает специфичные атрибуты type, start и reversed:
// они управляют нативным маркером и не влияют на кастомный счётчик. Для reversed дополнительно потребовалось бы
// заранее знать число отрисованных пунктов; его нельзя надёжно определить по React-дереву с Fragment и обёртками,
// а подсчёт через DOM создаёт дополнительный рендер и риск расхождения при SSR-гидратации.
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

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> {
  /** Содержимое компонента. */
  children?: ReactNode;
  /** Значение пункта упорядоченного списка. */
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

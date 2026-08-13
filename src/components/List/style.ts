import styled, { css } from 'styled-components';

import { LIST_DIMENSION_PARAMETERS } from './constants';
import type {
  ListItemProps,
  OrderedListType,
  StyledListIconProps,
  StyledListProps,
  StyledOrderedListProps,
  UnorderedListType,
} from './types';
import { cssToken } from '../../theme/cssToken';

export const listItemColor = cssToken(
  '--admiral-color-neutral-text-1-rest',
  (theme) => theme.color.neutral.text._1.rest,
);
export const listIconColor = cssToken(
  '--admiral-color-neutral-text-2-rest',
  (theme) => theme.color.neutral.text._2.rest,
);
export const listBulletMarkerColor = cssToken(
  '--admiral-color-neutral-base-4-rest',
  (theme) => theme.color.neutral.base._4.rest,
);

const cyrillicStyle = css`
  @counter-style lower-cyrillic {
    system: fixed;
    symbols: а б в г д е ж з и к л м н о п р с т у ф х ц ч ш щ ы э ю я;
  }
  @counter-style upper-cyrillic {
    system: fixed;
    symbols: А Б В Г Д Е Ж З И К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ы Э Ю Я;
  }
`;

const orderedMarkerStyles = {
  numbers: css`
    content: counters(admiral-list-counter, '.') '.';
  `,
  'lower-letters': css`
    ${cyrillicStyle}
    content: counter(admiral-list-counter, lower-cyrillic) ')';
  `,
  'upper-letters': css`
    ${cyrillicStyle}
    content: counter(admiral-list-counter, upper-cyrillic) ')';
  `,
} satisfies Record<OrderedListType, ReturnType<typeof css>>;

const unorderedMarkerStyles = {
  bullet: css`
    content: '•';
    /** Размер шрифта, при котором достигается необходимый размер точки */
    font-size: 18px;
    color: ${listBulletMarkerColor};
  `,
  virgule: css`
    content: '—';
  `,
  icon: css`
    content: none;
  `,
} satisfies Record<UnorderedListType, ReturnType<typeof css>>;

const markerStyles: Record<StyledListProps['$styleType'], ReturnType<typeof css>> = {
  ...orderedMarkerStyles,
  ...unorderedMarkerStyles,
};

const listMixin = css<StyledListProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => (typeof $gap === 'string' ? $gap : `${$gap}px`)};
  padding: 0;
  margin: 0;
  list-style: none;
  counter-reset: admiral-list-counter 0;

  & > li ul,
  & > li ol {
    margin-top: ${({ $gap }) => (typeof $gap === 'string' ? $gap : `${$gap}px`)};
  }
`;

const listMarkerMixin = css<StyledListProps>`
  display: inline-flex;
  flex-shrink: 0;
  height: ${(p) => LIST_DIMENSION_PARAMETERS[p.$dimension].markerSize}px;
  margin-inline-end: ${(p) => LIST_DIMENSION_PARAMETERS[p.$dimension].gap}px;
  ${(p) => markerStyles[p.$styleType]}
  ${(p) => p.$markerCssMixin}
`;

export const OrderedListComponent = styled.ol<StyledOrderedListProps>`
  ${listMixin}
  counter-reset: admiral-list-counter ${(p) => p.$counterReset};

  & > li::before {
    ${listMarkerMixin}
    justify-content: flex-start;
    min-width: ${(p) =>
      p.$styleType == 'numbers' ? 'auto' : `${LIST_DIMENSION_PARAMETERS[p.$dimension].markerSize}px`};
  }
`;

export const UnorderedListComponent = styled.ul<StyledListProps>`
  ${listMixin}
  & > li::before {
    ${listMarkerMixin}
    justify-content: center;
    width: ${(p) => LIST_DIMENSION_PARAMETERS[p.$dimension].markerSize}px;
  }
`;

export const ListItemComponent = styled.li<ListItemProps>`
  display: inline-flex;
  color: ${listItemColor};
  counter-increment: admiral-list-counter 1;
  ol[reversed] > & {
    counter-increment: admiral-list-counter -1;
  }

  ${(p) =>
    p.value !== undefined &&
    css`
      ol > & {
        counter-set: admiral-list-counter ${String(p.value)};
      }
    `}

  ol[data-dimension='m'] &,
  ul[data-dimension='m'] & {
    ${LIST_DIMENSION_PARAMETERS['m'].typography}
  }
  ol[data-dimension='s'] &,
  ul[data-dimension='s'] & {
    ${LIST_DIMENSION_PARAMETERS['s'].typography}
  }
  ol[data-dimension='xs'] &,
  ul[data-dimension='xs'] & {
    ${LIST_DIMENSION_PARAMETERS['xs'].typography}
  }
`;

export const ListItemContent = styled.div`
  display: block;
`;

export const Icon = styled.svg<StyledListIconProps>`
  ul[data-dimension='m'] & {
    width: ${LIST_DIMENSION_PARAMETERS['m'].markerSize}px;
    height: ${LIST_DIMENSION_PARAMETERS['m'].markerSize}px;
    margin-inline-end: ${LIST_DIMENSION_PARAMETERS['m'].gap}px;
  }
  ul[data-dimension='s'] & {
    width: ${LIST_DIMENSION_PARAMETERS['s'].markerSize}px;
    height: ${LIST_DIMENSION_PARAMETERS['s'].markerSize}px;
    margin-inline-end: ${LIST_DIMENSION_PARAMETERS['s'].gap}px;
  }
  ul[data-dimension='xs'] & {
    width: ${LIST_DIMENSION_PARAMETERS['xs'].markerSize}px;
    height: ${LIST_DIMENSION_PARAMETERS['xs'].markerSize}px;
    margin-inline-end: ${LIST_DIMENSION_PARAMETERS['xs'].gap}px;
  }
  vertical-align: bottom;
  color: ${(p) => (p.$color ? p.$color : listIconColor)};
`;

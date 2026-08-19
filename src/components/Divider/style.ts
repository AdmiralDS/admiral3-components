import styled from 'styled-components';

import { DIVIDER_DIMENSION_PARAMETERS, DIVIDER_ROOT_DATA_ATTRIBUTE } from './constants';
import type { DividerAppearance, StyledDividerProps } from './types';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

export const dividerBackgroundColors: Record<DividerAppearance, CssToken> = {
  default: cssToken('--admiral-color-neutral-stroke-1-rest', (theme) => theme.color.neutral.stroke._1.rest),
  subtle: cssToken('--admiral-color-neutral-stroke-subtle-rest', (theme) => theme.color.neutral.stroke.subtle.rest),
  strong: cssToken('--admiral-color-neutral-stroke-hard-rest', (theme) => theme.color.neutral.stroke.hard.rest),
  primary: cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest),
  staticWhite: cssToken(
    '--admiral-color-neutral-stroke-static-white-1',
    (theme) => theme.color.neutral.stroke.staticWhite._1,
  ),
};

const toCssSize = (value: string | number) => (typeof value === 'string' ? value : `${value}px`);

export const StyledDivider = styled.div.attrs<
  StyledDividerProps & {
    'data-appearance': string;
    'data-dimension': string;
    'data-orientation': string;
  }
>((props) => ({
  [DIVIDER_ROOT_DATA_ATTRIBUTE]: 'true',
  'data-appearance': props.$appearance,
  'data-dimension': props.$dimension,
  'data-orientation': props.$orientation,
}))<StyledDividerProps>`
  box-sizing: border-box;
  background-color: ${(props) =>
    dividerBackgroundColors[props.$appearance as DividerAppearance]?.(props) ?? props.$appearance};
  width: ${({ $dimension, $length, $orientation }) =>
    $orientation === 'horizontal' ? toCssSize($length) : `${DIVIDER_DIMENSION_PARAMETERS[$dimension]}px`};
  height: ${({ $dimension, $length, $orientation }) =>
    $orientation === 'vertical' ? toCssSize($length) : `${DIVIDER_DIMENSION_PARAMETERS[$dimension]}px`};
`;

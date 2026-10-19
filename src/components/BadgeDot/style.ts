import styled from 'styled-components';

import { BADGE_DOT_DIMENSION_PARAMETERS } from './constants';
import type { BadgeDotAppearance, StyledBadgeDotProps } from './types';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

export const badgeDotBackgroundColors: Record<BadgeDotAppearance, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-base-4-rest', (theme) => theme.color.neutral.base._4.rest),
  info: cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest),
  error: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
  success: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
  warning: cssToken('--admiral-color-warning-base-1-rest', (theme) => theme.color.warning.base._1.rest),
  attention: cssToken('--admiral-color-attention-base-1-rest', (theme) => theme.color.attention.base._1.rest),
};

export const StyledBadgeDot = styled.div.attrs<
  StyledBadgeDotProps & {
    'data-appearance': string;
    'data-dimension': string;
  }
>((props) => ({
  'data-appearance': props.$colorConfig ? 'custom' : props.$appearance,
  'data-dimension': String(props.$dimension),
}))<StyledBadgeDotProps>`
  position: relative;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$colorConfig?.backgroundColor ?? badgeDotBackgroundColors[props.$appearance](props)};
  width: ${({ $dimension }) => BADGE_DOT_DIMENSION_PARAMETERS[$dimension]}px;
  height: ${({ $dimension }) => BADGE_DOT_DIMENSION_PARAMETERS[$dimension]}px;
  border-radius: 50%;
`;

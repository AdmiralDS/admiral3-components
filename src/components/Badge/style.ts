import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { type CSSObject } from 'styled-components';

import { BADGE_DIMENSION_PARAMETERS } from './constants';
import type { BadgeAppearance, BadgeDimension, StyledBadgeProps } from './types';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

export const badgeBackgroundColors: Record<BadgeAppearance, CssToken> = {
  neutral1: cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest),
  neutral1Inactive: cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest),
  neutral1Disable: cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest),
  neutral2: cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest),
  neutral2Inactive: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  neutral2Disable: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  neutral3: cssToken('--admiral-color-neutral-base-inverted-rest', (theme) => theme.color.neutral.base.inverted.rest),
  info: cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest),
  warning: cssToken('--admiral-color-warning-base-1-rest', (theme) => theme.color.warning.base._1.rest),
  success: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
  error: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
  whiteStatic: cssToken(
    '--admiral-color-neutral-text-static-white-1',
    (theme) => theme.color.neutral.text.staticWhite._1,
  ),
};

export const badgeTextColors: Record<BadgeAppearance, CssToken> = {
  neutral1: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  neutral1Inactive: cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest),
  neutral1Disable: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
  neutral2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  neutral2Inactive: cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest),
  neutral2Disable: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
  neutral3: cssToken('--admiral-color-neutral-text-inverted-rest', (theme) => theme.color.neutral.text.inverted.rest),
  info: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  warning: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  success: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  error: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  whiteStatic: cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest),
};

export const badgeTypography: Record<BadgeDimension, CSSObject> = {
  s: textStyles.caption.caption1,
  m: textStyles.body.body2Long,
};

export const StyledBadge = styled.div.attrs<
  StyledBadgeProps & {
    'data-appearance': string;
    'data-dimension': string;
  }
>((props) => ({
  'data-appearance': props.$colorConfig ? 'custom' : props.$appearance,
  'data-dimension': String(props.$dimension),
}))<StyledBadgeProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: ${({ $dimension }) => BADGE_DIMENSION_PARAMETERS[$dimension].size}px;
  height: ${({ $dimension }) => BADGE_DIMENSION_PARAMETERS[$dimension].size}px;
  padding: 0 ${({ $dimension }) => BADGE_DIMENSION_PARAMETERS[$dimension].horizontalPadding}px;
  border-radius: var(--Round, 1000px);
  background-color: ${(props) =>
    props.$colorConfig?.backgroundColor ?? badgeBackgroundColors[props.$appearance](props)};
  color: ${(props) => props.$colorConfig?.textColor ?? badgeTextColors[props.$appearance](props)};
  white-space: nowrap;
  ${({ $dimension }) => badgeTypography[$dimension]}
`;

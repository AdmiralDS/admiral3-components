import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { PILLS_CONTENT_GAP, PILLS_HEIGHT, PILLS_HORIZONTAL_PADDING } from './constants';
import type { PillAppearance, StyledPillProps, StyledPillsProps } from './types';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

export const pillBackgroundColors: Record<PillAppearance, CssToken> = {
  neutral1: cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest),
  neutral2: cssToken('--admiral-color-neutral-base-inverted-rest', (theme) => theme.color.neutral.base.inverted.rest),
  info1: cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest),
  info2: cssToken('--admiral-color-primary-base-2-rest', (theme) => theme.color.primary.base._2.rest),
  success1: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
  success2: cssToken('--admiral-color-success-base-2-rest', (theme) => theme.color.success.base._2.rest),
  error1: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
  error2: cssToken('--admiral-color-error-base-2-rest', (theme) => theme.color.error.base._2.rest),
  warning1: cssToken('--admiral-color-warning-base-1-rest', (theme) => theme.color.warning.base._1.rest),
  warning2: cssToken('--admiral-color-warning-base-2-rest', (theme) => theme.color.warning.base._2.rest),
  attention1: cssToken('--admiral-color-attention-base-1-rest', (theme) => theme.color.attention.base._1.rest),
  attention2: cssToken('--admiral-color-attention-base-2-rest', (theme) => theme.color.attention.base._2.rest),
};

export const pillTextColors: Record<PillAppearance, CssToken> = {
  neutral1: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  neutral2: cssToken('--admiral-color-neutral-text-inverted-rest', (theme) => theme.color.neutral.text.inverted.rest),
  info1: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  info2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  success1: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  success2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  error1: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  error2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  warning1: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  warning2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  attention1: cssToken(
    '--admiral-color-neutral-text-static-black-1',
    (theme) => theme.color.neutral.text.staticBlack._1,
  ),
  attention2: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
};

export const pillBorderRadius = cssToken('--admiral-radius-small', (theme) => theme.radius.small);
const pillFocusColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);

export const PillLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledPill = styled.button.attrs<
  StyledPillProps & {
    'data-appearance': string;
  }
>((props) => ({
  'data-appearance': props.$colorConfig ? 'custom' : props.$appearance,
}))<StyledPillProps>`
  ${textStyles.caption.caption1}
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${PILLS_CONTENT_GAP}px;
  width: fit-content;
  max-width: 100%;
  height: ${PILLS_HEIGHT}px;
  padding: 0 ${PILLS_HORIZONTAL_PADDING}px;
  margin: 0;
  border: 0;
  border-radius: ${pillBorderRadius};
  background-color: ${(props) => props.$colorConfig?.backgroundColor ?? pillBackgroundColors[props.$appearance](props)};
  color: ${(props) => props.$colorConfig?.textColor ?? pillTextColors[props.$appearance](props)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  appearance: none;
  vertical-align: middle;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid ${pillFocusColor};
    outline-offset: 2px;
  }

  > svg {
    flex: 0 0 auto;
    width: 12px;
    height: 12px;
    color: currentColor;
  }
`;

export const StyledPills = styled.div<StyledPillsProps>`
  display: inline-flex;
  flex-wrap: ${({ $connected }) => ($connected ? 'nowrap' : 'wrap')};
  gap: ${({ $connected }) => ($connected ? 0 : PILLS_CONTENT_GAP)}px;

  &[data-connected] > [data-pill] {
    border-radius: 0;
  }

  &[data-connected] > [data-pill]:first-child {
    border-radius: ${(props) => `${pillBorderRadius(props)} 0 0 ${pillBorderRadius(props)}`};
  }

  &[data-connected] > [data-pill]:last-child {
    border-radius: ${(props) => `0 ${pillBorderRadius(props)} ${pillBorderRadius(props)} 0`};
  }

  &[data-connected] > [data-pill]:only-child {
    border-radius: ${pillBorderRadius};
  }
`;

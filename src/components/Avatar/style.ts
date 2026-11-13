import styled from 'styled-components';

import { cssToken, type CssToken } from '#src/theme/cssToken';

import { AVATAR_DIMENSION_PARAMETERS } from './constants';
import type { AvatarDimension, AvatarStatus, StyledAvatarSVGProps, StyledAvatarWrapperProps } from './types';

const avatarStatusColors: Record<AvatarStatus, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-base-4-rest', (theme) => theme.color.neutral.base._4.rest),
  success: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
  error: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
  attention: cssToken('--admiral-color-attention-base-1-rest', (theme) => theme.color.attention.base._1.rest),
};

export const StyledAvatarSVG = styled.svg<StyledAvatarSVGProps>`
  --admiral-avatar-background-color: ${(props) =>
    (typeof props.$appearance === 'object' ? props.$appearance.backgroundColor : undefined) ??
    cssToken('--admiral-color-neutral-base-3-rest', (theme) => theme.color.neutral.base._3.rest)(props)};
  --admiral-avatar-status-color: ${(props) =>
    typeof props.$status === 'object'
      ? props.$status.backgroundColor
      : avatarStatusColors[props.$status ?? 'neutral'](props)};
  --admiral-avatar-ring-color: ${cssToken(
    '--admiral-color-primary-stroke-1-rest',
    (theme) => theme.color.primary.stroke._1.rest,
  )};
`;

export const RoundedImage = styled.image`
  clip-path: circle();
`;

export const Wrapper = styled.button.attrs<
  StyledAvatarWrapperProps & {
    'data-dimension': AvatarDimension;
    'data-status': string;
  }
>((props) => ({
  'data-dimension': props.$dimension,
  'data-status': props.$statusColorConfig ? 'custom' : props.$status,
}))<StyledAvatarWrapperProps>`
  position: relative;
  width: ${({ $dimension, $withActivityRing }) =>
    AVATAR_DIMENSION_PARAMETERS[$dimension].size + ($withActivityRing ? 8 : 0)}px;
  height: ${({ $dimension, $withActivityRing }) =>
    AVATAR_DIMENSION_PARAMETERS[$dimension].size + ($withActivityRing ? 8 : 0)}px;
  margin: 0;
  padding: 0;
  border: none;
  appearance: none;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border-radius: 50%;
  isolation: isolate;

  &:focus-visible {
    outline: none;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border: 2px solid
        ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
    }
  }
`;

export const IconWrapper = styled.div<{
  $dimension: AvatarDimension;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].iconSize}px;
  height: ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].iconSize}px;

  & > svg {
    color: ${cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest)};
  }
`;

export const Text = styled.span<{
  $dimension: AvatarDimension;
  $textColor?: string;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  color: ${(props) =>
    props.$textColor ??
    cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest)(props)};

  ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].typography}
`;

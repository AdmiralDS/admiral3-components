import styled from 'styled-components';

import { cssToken } from '#src/theme/cssToken';

import { AVATAR_DIMENSION_PARAMETERS } from './constants';
import type { AvatarDimension, StyledAvatarWrapperProps } from './types';

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
  width: ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].iconSize}px;
  height: ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].iconSize}px;
  margin: 0;
  padding: 0;
  border: none;
  appearance: none;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  //TODO или использовать 50%?
  border-radius: ${cssToken('--admiral-radius-small', (theme) => theme.radius.round)};

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid
      ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
  }
`;

const IconWrapper = styled.div<{
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

const Text = styled.span<{
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

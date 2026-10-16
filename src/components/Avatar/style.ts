import styled from 'styled-components';

import { AVATAR_DIMENSION_PARAMETERS } from './constants';
import type { StyledAvatarProps } from './types';

export const StyledAvatar = styled.div<StyledAvatarProps>`
  box-sizing: border-box;
  display: inline-flex;
  min-height: ${({ $dimension }) => AVATAR_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  align-items: center;
`;

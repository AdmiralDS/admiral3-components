import styled from 'styled-components';

import { HINT_DIMENSION_PARAMETERS } from './constants';
import type { StyledHintProps } from './types';

export const StyledHint = styled.div<StyledHintProps>`
  box-sizing: border-box;
  display: inline-flex;
  min-height: ${({ $dimension }) => HINT_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  align-items: center;
`;

import styled from 'styled-components';

import { TOOLTIP_DIMENSION_PARAMETERS } from './constants';
import type { StyledTooltipProps } from './types';

export const StyledTooltip = styled.div<StyledTooltipProps>`
  box-sizing: border-box;
  display: inline-flex;
  min-height: ${({ $dimension }) => TOOLTIP_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  align-items: center;
`;

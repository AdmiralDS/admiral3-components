import styled from 'styled-components';

import { TEMPLATE_NAME_DIMENSION_PARAMETERS } from './constants';
import type { StyledTemplateNameProps } from './types';

export const StyledTemplateName = styled.div<StyledTemplateNameProps>`
  box-sizing: border-box;
  display: inline-flex;
  min-height: ${({ $dimension }) => TEMPLATE_NAME_DIMENSION_PARAMETERS[$dimension].minHeight}px;
  align-items: center;
`;

import styled from 'styled-components';

import { StyledBaseInputContainer as BaseInputContainer } from '../_internal/InputAtoms/style';

export { NativeInput, StyledBaseInputBorder, StyledIconPanel } from '../_internal/InputAtoms/style';

export const StyledBaseInputContainer = styled(BaseInputContainer)`
  &:has(> input:placeholder-shown) [data-role='clear-input-button'],
  &:has(> input:placeholder-shown) > [data-role='icon-panel-after'][data-clear-only] {
    display: none;
  }
`;

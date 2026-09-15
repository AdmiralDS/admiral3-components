import styled from 'styled-components';

import { StyledBaseInputContainer as BaseInputContainer } from '../_internal/InputAtoms/style';

export { NativeInput, StyledBaseInputBorder, StyledIconPanel } from '../_internal/InputAtoms/style';

/* :placeholder-shown здесь служит нативным признаком пустого input.
   При скрытой clear-icon-only панели сохраняем правый отступ у самого input. */
export const StyledBaseInputContainer = styled(BaseInputContainer)`
  &:has(> input:placeholder-shown) {
    [data-role='clear-input-button'] {
      display: none;
    }

    &[data-clear-icon-only] {
      > [data-role='icon-panel-after'] {
        display: none;
      }

      > input {
        padding-inline-end: var(--admiral-input-padding-inline);
      }
    }
  }
`;

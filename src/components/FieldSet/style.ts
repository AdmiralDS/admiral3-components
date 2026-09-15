import styled from 'styled-components';

import { FIELDSET_DIMENSION_PARAMETERS } from './constants';
import type { StyledFieldSetProps } from './types';
import { cssToken } from '../../theme/cssToken';

const colorRest = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const colorDisabled = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const colorRequired = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);

const toCssSize = (value: string | number) => (typeof value === 'string' ? value : `${value}px`);

export const StyledFieldSet = styled.fieldset<StyledFieldSetProps>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${(p) => (p.$orientation === 'horizontal' ? 'row' : 'column')};
  border: none;
  padding: 0;
  margin: 0;
  gap: ${(p) =>
    p.$gap !== undefined ? toCssSize(p.$gap) : `${FIELDSET_DIMENSION_PARAMETERS[p.$dimension].gap[p.$orientation]}px`};

  legend {
    ${(p) => FIELDSET_DIMENSION_PARAMETERS[p.$dimension].typography}
    margin-bottom: ${(p) => FIELDSET_DIMENSION_PARAMETERS[p.$dimension].gap.vertical}px;
  }
`;

export const StyledLegend = styled.legend`
  padding: 0;
  color: ${colorRest};

  fieldset:disabled & {
    color: ${colorDisabled};
  }

  fieldset[data-required] &:after {
    content: ' *' / '';
    color: ${colorRequired};
  }

  fieldset[aria-invalid='true'] & {
    color: ${colorRequired};
  }
`;

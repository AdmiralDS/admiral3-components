import styled from 'styled-components';

import { SELECTION_CONTROL_INFORMER_SIZES } from './constants';
import { cssToken } from '../../theme/cssToken';

const informerColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const informerHoverColor = cssToken(
  '--admiral-color-neutral-text-2-hover',
  (theme) => theme.color.neutral.text._2.hover,
);

export const SelectionControlInformer = styled.span<{ $dimension: keyof typeof SELECTION_CONTROL_INFORMER_SIZES }>`
  width: ${({ $dimension }) => SELECTION_CONTROL_INFORMER_SIZES[$dimension]}px;

  color: ${informerColor};
  &:hover {
    color: ${informerHoverColor};
  }
`;

import styled from 'styled-components';

import type { NativeTextAreaStyleProps } from './types';
import { baseInputEditableStyles, StyledBaseInputContainer, StyledIconPanel } from '../_internal/InputAtoms';

export const TextAreaContainer = styled(StyledBaseInputContainer)`
  &&[data-dimension] {
    display: block;
    height: auto;
  }

  > textarea {
    padding-inline: var(--admiral-input-padding-inline);
  }

  &[data-action] > textarea:not(:placeholder-shown) {
    padding-inline-end: calc(
      var(--admiral-input-padding-inline) + var(--admiral-input-icon-size) + var(--admiral-input-layout-gap)
    );
  }

  &:has(> textarea:placeholder-shown) > [data-role='text-area-action'] {
    display: none;
  }
`;

export const NativeTextArea = styled.textarea<NativeTextAreaStyleProps>`
  ${baseInputEditableStyles}
  display: block;
  height: auto;
  min-height: calc(${({ $minRows }) => $minRows}lh + 2 * var(--admiral-input-padding-block));
  max-height: ${({ $maxRows }) =>
    $maxRows === undefined ? 'none' : `calc(${$maxRows}lh + 2 * var(--admiral-input-padding-block))`};
  overflow: auto;
  resize: ${({ $resize }) => ($resize ? 'vertical' : 'none')};

  &:disabled {
    cursor: not-allowed;
  }
`;

export const TextAreaActionPanel = styled(StyledIconPanel)`
  position: absolute;
  inset-block-start: var(--admiral-input-padding-block);
  inset-inline-end: var(--admiral-input-padding-inline);

  && {
    padding: 0;
  }
`;

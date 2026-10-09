import { css } from 'styled-components';

import { ghostColors } from './colors';
import type { ButtonColorMode } from '../types';

export const ghostAppearanceMixin = css<{ $colorMode: ButtonColorMode }>`
  background-color: ${(p) => ghostColors[p.$colorMode].background};
  color: ${(p) => ghostColors[p.$colorMode].color};
  &&& *[fill^='#'] {
    fill: ${(p) => ghostColors[p.$colorMode].color};
  }

  &&&:hover:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => ghostColors[p.$colorMode].backgroundHover};
  }

  &&&:active:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => ghostColors[p.$colorMode].backgroundPress};
  }

  &&&&[data-appearance~='disabled'],
  &&&:disabled {
    background-color: ${(p) => ghostColors[p.$colorMode].backgroundDisabled};
    color: ${(p) => ghostColors[p.$colorMode].colorDisabled};
    &&& *[fill^='#'] {
      fill: ${(p) => ghostColors[p.$colorMode].colorDisabled};
    }
  }
`;

import { css } from 'styled-components';

import { flatColors } from './colors';
import type { ButtonColorMode } from '../types';

export const flatAppearanceMixin = css<{ $buttonGroup?: boolean; $colorMode: ButtonColorMode }>`
  background-color: ${(p) => flatColors[p.$colorMode].background};
  color: ${(p) => flatColors[p.$colorMode].color};
  &&& *[fill^='#'] {
    fill: ${(p) => flatColors[p.$colorMode].color};
  }

  &&&:hover:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => flatColors[p.$colorMode].backgroundHover};
  }

  &&&:active:not(:disabled):not([aria-disabled]),
  &&&[data-button-pressed]:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => flatColors[p.$colorMode].backgroundPress};
  }

  &&&&[data-appearance~='disabled'],
  &&&:disabled {
    background-color: ${(p) =>
      (p.$buttonGroup ? flatColors[p.$colorMode].background : flatColors[p.$colorMode].backgroundDisabled)(p)};
    color: ${(p) => flatColors[p.$colorMode].colorDisabled};
    &&& *[fill^='#'] {
      fill: ${(p) => flatColors[p.$colorMode].colorDisabled};
    }
  }
`;

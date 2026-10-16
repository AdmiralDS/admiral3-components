import { css } from 'styled-components';

import { outlineColors } from './colors';
import type { ButtonColorMode } from '../types';

export const outlineAppearanceMixin = css<{
  $buttonGroup?: boolean;
  $colorMode: ButtonColorMode;
  $skeleton?: boolean;
}>`
  background-color: ${(p) => outlineColors[p.$colorMode].background};
  color: ${(p) => outlineColors[p.$colorMode].color};
  box-shadow: ${(p) => (p.$skeleton ? 'none' : css`inset 0 0 0 1px ${outlineColors[p.$colorMode].border}`)};
  &&& *[fill^='#'] {
    fill: ${(p) => outlineColors[p.$colorMode].color};
  }

  &&&:hover:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => outlineColors[p.$colorMode].backgroundHover};
  }

  &&&:active:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => outlineColors[p.$colorMode].backgroundPress};
  }

  &&&&[data-appearance~='disabled'],
  &&&:disabled {
    background-color: ${(p) =>
      (p.$buttonGroup ? outlineColors[p.$colorMode].background : outlineColors[p.$colorMode].backgroundDisabled)(p)};
    color: ${(p) => outlineColors[p.$colorMode].colorDisabled};
    box-shadow: inset 0 0 0 1px
      ${(p) => (p.$buttonGroup ? outlineColors[p.$colorMode].border : outlineColors[p.$colorMode].borderDisabled)(p)};
    &&& *[fill^='#'] {
      fill: ${(p) => outlineColors[p.$colorMode].colorDisabled};
    }
  }
`;

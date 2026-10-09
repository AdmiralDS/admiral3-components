import { css, type ExecutionContext } from 'styled-components';

import { solidColors } from './colors';
import { cssToken } from '../../../theme/cssToken';
import type { ButtonColorMode } from '../types';

const buttonGroupColoredDisabledText = cssToken(
  '--admiral-color-neutral-text-static-white-3',
  (theme) => theme.color.neutral.text.staticWhite._3,
);
const buttonGroupNeutralDisabledText = cssToken(
  '--admiral-color-neutral-text-inverted-disable',
  (theme) => theme.color.neutral.text.inverted.disable,
);

interface SolidAppearanceProps {
  $buttonGroup?: boolean;
  $colorMode: ButtonColorMode;
}

const getDisabledBackground = (props: ExecutionContext & SolidAppearanceProps) =>
  (props.$buttonGroup ? solidColors[props.$colorMode].background : solidColors[props.$colorMode].backgroundDisabled)(
    props,
  );

export const getSolidDisabledText = (props: ExecutionContext & SolidAppearanceProps) => {
  if (!props.$buttonGroup || props.$colorMode === 'staticWhite') {
    return solidColors[props.$colorMode].colorDisabled(props);
  }

  return props.$colorMode === 'colored' ? buttonGroupColoredDisabledText(props) : buttonGroupNeutralDisabledText(props);
};

export const solidAppearanceMixin = css<SolidAppearanceProps>`
  background-color: ${(p) => solidColors[p.$colorMode].background(p)};
  color: ${(p) => solidColors[p.$colorMode].color(p)};
  &&& *[fill^='#'] {
    fill: ${(p) => solidColors[p.$colorMode].color(p)};
  }

  &&&:hover:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => solidColors[p.$colorMode].backgroundHover};
  }

  &&&:active:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) => solidColors[p.$colorMode].backgroundPress};
  }

  &&&&[data-appearance~='disabled'],
  &&&:disabled {
    background-color: ${getDisabledBackground};
    color: ${getSolidDisabledText};
    &&& *[fill^='#'] {
      fill: ${getSolidDisabledText};
    }
  }
`;

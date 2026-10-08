import { css, type ExecutionContext } from 'styled-components';

import { getToken } from './colors';
import { getSolidDisabledText } from './solidAppearanceMixin';
import type { ButtonColorMode, ButtonAppearance, ButtonColorConfig } from '../types';

interface CustomAppearanceProps {
  $colorMode: ButtonColorMode;
  $appearance: ButtonAppearance;
  $buttonGroup?: boolean;
  $colorConfig?: ButtonColorConfig;
  $skeleton?: boolean;
}

const getDisabledBackground = (props: ExecutionContext & CustomAppearanceProps) => {
  if (props.$colorMode === 'colored' && props.$colorConfig?.backgroundColorDisabled) {
    return props.$colorConfig.backgroundColorDisabled;
  }

  if (props.$buttonGroup && props.$colorMode === 'colored' && props.$colorConfig?.backgroundColor?.rest) {
    return props.$colorConfig.backgroundColor.rest;
  }

  const colors = getToken(props.$appearance)[props.$colorMode];
  return (props.$buttonGroup ? colors.background : colors.backgroundDisabled)?.(props);
};

const getDisabledText = (props: ExecutionContext & CustomAppearanceProps) => {
  if (props.$colorMode === 'colored' && props.$colorConfig?.textColorDisabled) {
    return props.$colorConfig.textColorDisabled;
  }

  if (!props.$buttonGroup) {
    return getToken(props.$appearance)[props.$colorMode].colorDisabled?.(props);
  }

  if (props.$appearance === 'solid') {
    return getSolidDisabledText(props);
  }

  return getToken(props.$appearance)[props.$colorMode].colorDisabled?.(props);
};

const getDisabledBorder = (props: ExecutionContext & CustomAppearanceProps) => {
  if (props.$colorMode === 'colored' && props.$colorConfig?.borderColorDisabled) {
    return props.$colorConfig.borderColorDisabled;
  }

  if (
    props.$buttonGroup &&
    props.$appearance === 'outline' &&
    props.$colorMode === 'colored' &&
    props.$colorConfig?.borderColor
  ) {
    return props.$colorConfig.borderColor;
  }

  const colors = getToken(props.$appearance)[props.$colorMode];
  return (props.$buttonGroup ? colors.border : colors.borderDisabled)?.(props);
};

export const customAppearanceMixin = css<CustomAppearanceProps>`
  background-color: ${(p) =>
    p.$colorMode === 'colored' && p.$colorConfig?.backgroundColor?.rest
      ? p.$colorConfig.backgroundColor.rest
      : getToken(p.$appearance)[p.$colorMode].background};

  color: ${(p) =>
    p.$colorMode === 'colored' && p.$colorConfig?.textColor
      ? p.$colorConfig.textColor
      : getToken(p.$appearance)[p.$colorMode].color};

  ${(p) =>
    p.$colorMode === 'colored' && p.$colorConfig?.borderColor
      ? css`
          box-shadow: inset 0 0 0 1px ${p.$colorConfig.borderColor};
        `
      : 'border' in getToken(p.$appearance)[p.$colorMode]
        ? css`
            box-shadow: inset 0 0 0 1px ${getToken(p.$appearance)[p.$colorMode].border};
          `
        : ''}
  ${(p) => (p.$skeleton ? 'box-shadow: none;' : '')}

  &&& *[fill^='#'] {
    fill: ${(p) =>
      p.$colorMode === 'colored' && p.$colorConfig?.textColor
        ? p.$colorConfig.textColor
        : getToken(p.$appearance)[p.$colorMode].color};
  }

  &&&:hover:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) =>
      p.$colorMode === 'colored' && p.$colorConfig?.backgroundColor?.hover
        ? p.$colorConfig.backgroundColor.hover
        : getToken(p.$appearance)[p.$colorMode].backgroundHover};
  }

  &&&:active:not(:disabled):not([aria-disabled]),
  &&&[data-button-pressed]:not(:disabled):not([aria-disabled]) {
    background-color: ${(p) =>
      p.$colorMode === 'colored' && p.$colorConfig?.backgroundColor?.press
        ? p.$colorConfig.backgroundColor.press
        : getToken(p.$appearance)[p.$colorMode].backgroundPress};
  }

  &&&&[data-appearance~='disabled'],
  &&&:disabled {
    background-color: ${getDisabledBackground};
    color: ${getDisabledText};
    ${(p) => {
      const border = getDisabledBorder(p);
      return border
        ? css`
            box-shadow: inset 0 0 0 1px ${border};
          `
        : '';
    }}
    &&& *[fill^='#'] {
      fill: ${getDisabledText};
    }
  }
`;

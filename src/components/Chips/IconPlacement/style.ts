import styled, { css } from 'styled-components';

import { cssToken } from '#src/theme/cssToken';

import {
  IconSizeL,
  IconSizeM,
  IconSizeS,
  HighlighterOffsetBig,
  HighlighterOffsetMedium,
  HighlighterOffsetSmall,
} from './constants';
import type {
  IconPlacementDimension,
  IconColorStyleProps,
  IconPlacementContentStyleProps,
  IconPlacementDimensionStyleProps,
  IconPlacementFocusStyleProps,
  IconPlacementButtonStyleProps,
} from './types';

function getIconSize(dimension?: IconPlacementDimension) {
  switch (dimension) {
    case 'lSmall':
    case 'lBig':
    case 'lMedium':
      return IconSizeL;
    case 'mSmall':
    case 'mBig':
    case 'mMedium':
      return IconSizeM;
    case 'sSmall':
    case 'sBig':
    case 'sMedium':
      return IconSizeS;
    default:
      return IconSizeL;
  }
}

function getHighlighterOffset(dimension?: IconPlacementDimension) {
  switch (dimension) {
    case 'lBig':
    case 'mBig':
    case 'sBig':
      return HighlighterOffsetBig;
    case 'lMedium':
    case 'mMedium':
    case 'sMedium':
      return HighlighterOffsetMedium;
    case 'lSmall':
    case 'mSmall':
    case 'sSmall':
      return HighlighterOffsetSmall;
    default:
      return HighlighterOffsetBig;
  }
}

function getHighlighterSize(dimension?: IconPlacementDimension) {
  return getIconSize(dimension) + getHighlighterOffset(dimension) * 2;
}

const IconColor = css<IconColorStyleProps>`
  & *[fill^='#'] {
    fill: ${(p) => {
      switch (p.$iconColor) {
        case 'primary':
          return cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest);
        case 'secondary':
          return cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
        default:
          return p.$iconColor;
      }
    }};
  }
`;

export const IconPlacementContent = styled.div<IconPlacementContentStyleProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;

  ${IconColor}

  & > svg {
    height: ${(p) => getIconSize(p.$dimension)}px;
    width: ${(p) => getIconSize(p.$dimension)}px;
  }
`;

export const ActivityHighlighter = styled.div<IconPlacementDimensionStyleProps>`
  width: ${(p) => getHighlighterSize(p.$dimension)}px;
  height: ${(p) => getHighlighterSize(p.$dimension)}px;
  border-radius: 50%;
  background-color: transparent;
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const eventsMixin = css<IconPlacementFocusStyleProps>`
  &:focus-visible {
    outline-offset: 2px;
    outline: ${cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest)} solid 2px;
  }

  &:hover {
    > ${ActivityHighlighter} {
      background-color: ${cssToken(
        '--admiral-color-primary-text-1-hover',
        (theme) => theme.color.primary.text._1.hover,
      )};
    }
  }
  &:focus {
    > ${ActivityHighlighter} {
      background-color: ${(p) =>
        p.$highlightFocus
          ? cssToken('--admiral-color-neutral-stroke-2-focus', (theme) => theme.color.neutral.stroke._2.focus)
          : 'transparent'};
    }
  }
  &:active {
    > ${ActivityHighlighter} {
      background-color: ${cssToken(
        '--admiral-color-primary-text-1-press',
        (theme) => theme.color.primary.text._1.press,
      )};
    }
  }
  &:focus-visible {
    > ${ActivityHighlighter} {
      background-color: transparent;
    }
  }
`;

export const IconPlacementButton = styled.button<IconPlacementButtonStyleProps>`
  position: relative;
  padding: 0;
  margin: ${(p) => getHighlighterOffset(p.$dimension)}px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  appearance: none;
  flex: 0 0 auto;
  height: ${(p) => getIconSize(p.$dimension)}px;
  width: ${(p) => getIconSize(p.$dimension)}px;

  overflow: visible;

  cursor: pointer;
  > * {
    pointer-events: none;
  }

  &:disabled {
    cursor: not-allowed;
    & *[fill^='#'] {
      fill: ${cssToken('--admiral-color-neutral-text-disable-rest', (theme) => theme.color.neutral.text.disable.rest)};
    }
  }
  &:not(:disabled) {
    ${eventsMixin}
  }
`;

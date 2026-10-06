import styled, { css } from 'styled-components';

import { hoverPressLeaveTransition } from '#src/theme/animation';
import { cssToken } from '#src/theme/cssToken';

import { ICON_PLACEMENT_SIZE } from './constants';
import type { IconPlacementButtonStyleProps } from './types';

const iconColorMixin = css<Pick<IconPlacementButtonStyleProps, '$colorMode'>>`
  & svg {
    color: ${(p) => {
      switch (p.$colorMode) {
        case 'colored':
          return cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest);
        case 'neutral':
          return cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
        case 'staticWhite':
          return cssToken(
            '--admiral-color-neutral-text-static-white-1',
            (theme) => theme.color.neutral.text.staticWhite._1,
          );
        default:
          return p.$colorMode?.iconColor;
      }
    }};
  }
  &:hover {
    & svg {
      color: ${(p) =>
        p.$colorMode === 'staticWhite'
          ? cssToken('--admiral-color-neutral-text-static-white-2', (theme) => theme.color.neutral.text.staticWhite._2)
          : cssToken('--admiral-color-neutral-text-2-hover', (theme) => theme.color.neutral.text._2.hover)};
    }
  }
  &:active {
    & svg {
      color: ${(p) =>
        p.$colorMode === 'staticWhite'
          ? cssToken('--admiral-color-neutral-text-static-white-3', (theme) => theme.color.neutral.text.staticWhite._3)
          : cssToken('--admiral-color-neutral-text-2-press', (theme) => theme.color.neutral.text._2.press)};
    }
  }
`;

const eventsMixin = css<Pick<IconPlacementButtonStyleProps, '$colorMode'>>`
  &:focus-visible {
    outline-offset: 2px;
    outline: ${(p) =>
        p.$colorMode === 'staticWhite'
          ? cssToken(
              '--admiral-color-primary-stroke-inverted-rest',
              (theme) => theme.color.primary.stroke.inverted.rest,
            )
          : cssToken('--admiral-color-neutral-stroke-1-rest', (theme) => theme.color.neutral.stroke._1.rest)}
      solid 2px;
  }
`;

export const IconPlacementButton = styled.button<IconPlacementButtonStyleProps>`
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  box-sizing: border-box;
  border: none;
  appearance: none;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: inherit;
  height: ${(p) => ICON_PLACEMENT_SIZE[p.$dimension]}px;
  width: ${(p) => ICON_PLACEMENT_SIZE[p.$dimension]}px;

  & svg {
    transition: color ${hoverPressLeaveTransition};
  }

  > * {
    pointer-events: none;
  }

  &:disabled {
    cursor: not-allowed;

    & svg {
      color: ${(p) =>
        p.$colorMode === 'staticWhite'
          ? cssToken(
              '--admiral-color-neutral-text-static-white-disable',
              (theme) => theme.color.neutral.text.staticWhite.disable,
            )
          : cssToken('--admiral-color-neutral-text-disable-rest', (theme) => theme.color.neutral.text.disable.rest)};
    }
  }
  &:not(:disabled) {
    ${iconColorMixin}
    ${eventsMixin}
  }
`;

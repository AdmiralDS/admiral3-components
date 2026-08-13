import { animation } from '@admiral-ds/admiral3-tokens';
import styled, { css } from 'styled-components';

import { LINK_DIMENSION_PARAMETERS } from './constants';
import type { StyledLinkProps } from './types';
import { cssToken } from '../../theme/cssToken';

const coloredRest = cssToken('--admiral-color-primary-text-link-rest', (theme) => theme.color.primary.text.link.rest);
const coloredHover = cssToken(
  '--admiral-color-primary-text-link-hover',
  (theme) => theme.color.primary.text.link.hover,
);
const coloredPress = cssToken(
  '--admiral-color-primary-text-link-press',
  (theme) => theme.color.primary.text.link.press,
);
const neutralRest = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const disabledColor = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const focusColor = cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest);
const transitionDuration = `var(--admiral-animation-motion-duration-short-2, ${animation.motion.duration.short_2}ms)`;
const transitionEasing = `var(--admiral-animation-motion-easing-linear, ${animation.motion.easing.linear})`;

export const StyledLink = styled.a<StyledLinkProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: flex-start;
  width: fit-content;
  gap: ${({ $dimension }) => LINK_DIMENSION_PARAMETERS[$dimension].gap}px;
  color: ${({ $appearance }) => ($appearance === 'colored' ? coloredRest : neutralRest)};
  text-decoration: none;
  transition: color ${transitionDuration} ${transitionEasing};
  cursor: pointer;
  ${({ $dimension }) => LINK_DIMENSION_PARAMETERS[$dimension].typography}

  > svg {
    flex: 0 0 auto;
    width: ${({ $dimension }) => LINK_DIMENSION_PARAMETERS[$dimension].iconSize}px;
    height: ${({ $dimension }) => LINK_DIMENSION_PARAMETERS[$dimension].iconSize}px;
  }

  &:hover {
    color: ${coloredHover};
  }

  &:active {
    color: ${coloredPress};
  }

  &:focus-visible {
    outline: 2px solid ${focusColor};
    outline-offset: 2px;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;

      &,
      &:hover,
      &:active {
        color: ${disabledColor};
      }
    `}
`;

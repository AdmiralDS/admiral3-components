import styled, { css } from 'styled-components';

import type { StyledButtonGroupProps } from './types';
import { cssToken } from '../../theme/cssToken';

const buttonGroupBorderRadius = cssToken('--admiral-radius-medium', (theme) => theme.radius.medium);
const solidColoredFocus = cssToken(
  '--admiral-color-neutral-stroke-static-white-1',
  (theme) => theme.color.neutral.stroke.staticWhite._1,
);
const solidNeutralFocus = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const coloredFocus = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const neutralFocus = cssToken('--admiral-color-neutral-stroke-2-focus', (theme) => theme.color.neutral.stroke._2.focus);

export const StyledButtonGroup = styled.div<StyledButtonGroupProps>`
  box-sizing: border-box;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: ${({ $appearance }) => ($appearance === 'outline' ? 0 : 2)}px;
  white-space: nowrap;

  ${({ $appearance }) =>
    $appearance === 'outline' &&
    css`
      & > button:not(:first-child) {
        margin-left: -1px;
      }
    `}

  & > button {
    border-radius: 0;
  }

  & > button:first-child {
    border-radius: ${buttonGroupBorderRadius} 0 0 ${buttonGroupBorderRadius};
  }

  & > button:last-child {
    border-radius: 0 ${buttonGroupBorderRadius} ${buttonGroupBorderRadius} 0;
  }

  & > button:only-child {
    border-radius: ${buttonGroupBorderRadius};
  }

  & > button:focus-visible {
    z-index: 1;
    outline-width: 2px;
    outline-offset: -4px;
  }

  &[data-appearance='solid'][data-color-mode='colored'] > button:focus-visible {
    outline-color: ${solidColoredFocus};
  }

  &[data-appearance='solid'][data-color-mode='neutral'] > button:focus-visible {
    outline-color: ${solidNeutralFocus};
  }

  &[data-appearance='outline'][data-color-mode='colored'] > button:focus-visible,
  &[data-appearance='flat'][data-color-mode='colored'] > button:focus-visible {
    outline-color: ${coloredFocus};
  }

  &[data-appearance='outline'][data-color-mode='neutral'] > button:focus-visible,
  &[data-appearance='flat'][data-color-mode='neutral'] > button:focus-visible {
    outline-color: ${neutralFocus};
  }
`;

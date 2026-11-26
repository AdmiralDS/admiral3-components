import { ServiceCloseOutline } from '@admiral-ds/admiral3-icons';
import styled, { css } from 'styled-components';

import { hoverPressLeaveTransition } from '#src/theme/animation';
import { cssToken } from '#src/theme/cssToken';

import type { ChipColorMode } from '../types';

const textNeutral2Hover = cssToken(
  '--admiral-color-neutral-text-2-hover',
  (theme) => theme.color.neutral.text._2.hover,
);
const textNeutral2Press = cssToken(
  '--admiral-color-neutral-text-2-press',
  (theme) => theme.color.neutral.text._2.press,
);
const textNeutral2Rest = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const textPrimary1Rest = cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest);
const textNeutralDisabledRest = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);

const colorIcon = css<{ $colorMode: ChipColorMode }>`
  color: ${(p) => (p.$colorMode === 'neutral' ? textNeutral2Rest : textPrimary1Rest)(p)};

  &:hover {
    color: ${(p) => textNeutral2Hover(p)};
  }
  &:active {
    color: ${(p) => textNeutral2Press(p)};
  }
`;

export const CloseIcon = styled(ServiceCloseOutline)<{
  $colorMode: ChipColorMode;
  $disabled?: boolean;
}>`
  flex-shrink: 0;
  cursor: pointer;
  transition: color ${hoverPressLeaveTransition};
  ${(p) => (p.$disabled ? `cursor: not-allowed; color: ${textNeutralDisabledRest(p)}` : colorIcon)}
`;

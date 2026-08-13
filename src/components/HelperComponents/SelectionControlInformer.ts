import { animation } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { SELECTION_CONTROL_INFORMER_SIZES } from './constants';
import { cssToken } from '../../theme/cssToken';

const informerColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const informerHoverColor = cssToken(
  '--admiral-color-neutral-text-2-hover',
  (theme) => theme.color.neutral.text._2.hover,
);
const transitionDuration = `var(--admiral-animation-motion-duration-short-2, ${animation.motion.duration.short_2}ms)`;
const transitionEasing = `var(--admiral-animation-motion-easing-linear, ${animation.motion.easing.linear})`;

export const SelectionControlInformer = styled.span<{ $dimension: keyof typeof SELECTION_CONTROL_INFORMER_SIZES }>`
  width: ${({ $dimension }) => SELECTION_CONTROL_INFORMER_SIZES[$dimension]}px;

  color: ${informerColor};
  transition: color ${transitionDuration} ${transitionEasing};

  &:hover {
    color: ${informerHoverColor};
  }
`;

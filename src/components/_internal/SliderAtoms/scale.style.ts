import styled from 'styled-components';

import { SLIDER_DIMENSION_PARAMETERS } from './constants';
import { SliderMarkButton } from './style';
import type { SliderAtomDimension } from './types';
import { hoverPressLeaveTransition } from '../../../theme/animation';
import { cssToken } from '../../../theme/cssToken';

const text = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const textHover = cssToken('--admiral-color-neutral-text-1-hover', (theme) => theme.color.neutral.text._1.hover);
const textPress = cssToken('--admiral-color-neutral-text-1-press', (theme) => theme.color.neutral.text._1.press);
const futureText = cssToken('--admiral-color-neutral-text-3-rest', (theme) => theme.color.neutral.text._3.rest);
const disabledText = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);

export const SliderScaleRow = styled.div<{ $dimension: SliderAtomDimension }>`
  display: flex;
  --slider-thumb-radius: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].thumbSize / 2}px;
  width: calc(100% - 2 * var(--slider-thumb-radius));
  margin-inline: var(--slider-thumb-radius);
  position: relative;
  ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].typography}
  height: ${({ $dimension }) => SLIDER_DIMENSION_PARAMETERS[$dimension].typography.lineHeight};
`;
export const SliderScaleLabel = styled(SliderMarkButton)<{ $position: number }>`
  position: absolute;
  left: ${({ $position }) => $position}%;
  transform: translateX(-50%);
  &[data-min] {
    transform: translateX(calc(-1 * var(--slider-thumb-radius)));
  }
  &[data-max]:not([data-min]) {
    transform: translateX(calc(-100% + var(--slider-thumb-radius)));
  }
  white-space: nowrap;
  &[data-future] {
    color: ${futureText};
  }
  transition: color ${hoverPressLeaveTransition};
  &[data-passed] {
    color: ${text};
  }
  &:is([data-passed], [data-future]):enabled:hover {
    color: ${textHover};
  }
  &:is([data-passed], [data-future]):enabled:active {
    color: ${textPress};
  }
  [data-disabled] & {
    color: ${disabledText};
  }
`;

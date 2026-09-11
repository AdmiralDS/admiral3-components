import styled, { css, keyframes } from 'styled-components';

import {
  PROGRESS_HEADER_HEIGHT,
  PROGRESS_HEADER_INDETERMINATE_ANIMATION_DURATION,
  PROGRESS_HEADER_INDETERMINATE_INDICATOR_WIDTH,
  PROGRESS_HEADER_INDETERMINATE_TRANSLATE_CENTER,
  PROGRESS_HEADER_INDETERMINATE_TRANSLATE_END,
  PROGRESS_HEADER_VALUE_PROPERTY,
} from './constants';
import type { StyledProgressHeaderProps } from './types';
import { durationMedium2, easingLinear } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';

const trackColor = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const progressColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const errorColor = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);

// translateX рассчитывается от ширины индикатора: -100% скрывает его за начальным краем,
// конечное значение сдвигает начало индикатора на полную ширину трека.
const progressIndeterminateAnimation = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(${PROGRESS_HEADER_INDETERMINATE_TRANSLATE_END}%); }
`;

export const StyledProgressHeader = styled.div<Pick<StyledProgressHeaderProps, '$colorConfig'>>`
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  box-sizing: border-box;
  overflow: hidden;
  height: ${PROGRESS_HEADER_HEIGHT}px;
  background-color: ${(props) => props.$colorConfig?.backgroundColor ?? trackColor(props)};
  pointer-events: none;
`;

const determinateIndicator = css`
  inline-size: 100%;
  transform: scaleX(var(${PROGRESS_HEADER_VALUE_PROPERTY}));
  transform-origin: left center;
  transition: transform ${durationMedium2} ${easingLinear};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const indeterminateIndicator = css`
  inline-size: ${PROGRESS_HEADER_INDETERMINATE_INDICATOR_WIDTH}%;
  animation: ${progressIndeterminateAnimation} ${PROGRESS_HEADER_INDETERMINATE_ANIMATION_DURATION} ${easingLinear}
    infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: translateX(${PROGRESS_HEADER_INDETERMINATE_TRANSLATE_CENTER}%);
  }
`;

export const ProgressHeaderIndicator = styled.div<StyledProgressHeaderProps>`
  height: 100%;
  background-color: ${(props) =>
    props.$error
      ? (props.$colorConfig?.progressColorError ?? errorColor(props))
      : (props.$colorConfig?.progressColor ?? progressColor(props))};
  ${({ $indeterminate }) => ($indeterminate ? indeterminateIndicator : determinateIndicator)}
`;

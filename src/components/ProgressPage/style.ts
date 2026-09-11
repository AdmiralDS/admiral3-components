import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { css, keyframes } from 'styled-components';

import {
  PROGRESS_PAGE_BORDER_RADIUS,
  PROGRESS_PAGE_HEIGHT,
  PROGRESS_PAGE_INDETERMINATE_ANIMATION_DURATION,
  PROGRESS_PAGE_INDETERMINATE_INDICATOR_WIDTH,
  PROGRESS_PAGE_INDETERMINATE_TRANSLATE_CENTER,
  PROGRESS_PAGE_INDETERMINATE_TRANSLATE_END,
  PROGRESS_PAGE_MIN_WIDTH,
  PROGRESS_PAGE_VALUE_PROPERTY,
} from './constants';
import type { StyledProgressPageProps } from './types';
import { durationMedium2, easingLinear } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';

const trackColor = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const progressColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const errorColor = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);
export const textColor = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);

export const StyledProgressPage = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: ${PROGRESS_PAGE_MIN_WIDTH}px;
`;

export const Labels = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 8px;
  color: ${textColor};
  ${textStyles.body.body2Short}
`;

export const Label = styled.div`
  flex: 1 1 auto;
`;

export const ValueLabel = styled.div`
  flex: 0 0 auto;
  margin-left: auto;
  white-space: nowrap;
`;

export const ProgressPageTrack = styled.div<Pick<StyledProgressPageProps, '$colorConfig'>>`
  box-sizing: border-box;
  overflow: hidden;
  height: ${PROGRESS_PAGE_HEIGHT}px;
  border-radius: ${PROGRESS_PAGE_BORDER_RADIUS}px;
  background-color: ${(props) => props.$colorConfig?.backgroundColor ?? trackColor(props)};
`;

/**
 * translateX рассчитывается от ширины индикатора: -100% скрывает его за начальным краем,
 * конечное значение сдвигает начало индикатора на полную ширину трека.
 **/
const progressIndeterminateAnimation = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(${PROGRESS_PAGE_INDETERMINATE_TRANSLATE_END}%); }
`;

const determinateIndicator = css`
  width: var(${PROGRESS_PAGE_VALUE_PROPERTY});
  transition: width ${durationMedium2} ${easingLinear};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const indeterminateIndicator = css`
  width: ${PROGRESS_PAGE_INDETERMINATE_INDICATOR_WIDTH}%;
  animation: ${progressIndeterminateAnimation} ${PROGRESS_PAGE_INDETERMINATE_ANIMATION_DURATION} ${easingLinear}
    infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: translateX(${PROGRESS_PAGE_INDETERMINATE_TRANSLATE_CENTER}%);
  }
`;

export const ProgressPageIndicator = styled.div<StyledProgressPageProps>`
  height: 100%;
  border-radius: inherit;
  background-color: ${(props) =>
    props.$error
      ? (props.$colorConfig?.progressColorError ?? errorColor(props))
      : (props.$colorConfig?.progressColor ?? progressColor(props))};
  ${({ $indeterminate }) => ($indeterminate ? indeterminateIndicator : determinateIndicator)}
`;

import styled, { css, keyframes } from 'styled-components';

import { PROGRESS_HEADER_HEIGHT, PROGRESS_HEADER_Z_INDEX } from './constants';
import { durationShort4, easingDecelerateStandard, easingLinear } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';

const trackColor = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const progressColor = cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest);
const errorColor = cssToken('--admiral-color-error-stroke-1-rest', (theme) => theme.color.error.stroke._1.rest);

const moveFromLeft = keyframes`
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(250%, 0, 0); }
`;

const moveFromRight = keyframes`
  from { transform: translate3d(250%, 0, 0); }
  to { transform: translate3d(-100%, 0, 0); }
`;

// TODO: Уточнить параметры анимации у Эльдара.

export const StyledProgressHeader = styled.div`
  position: fixed;
  z-index: ${PROGRESS_HEADER_Z_INDEX};
  inset-block-start: 0;
  inset-inline: 0;
  box-sizing: border-box;
  overflow: hidden;
  block-size: ${PROGRESS_HEADER_HEIGHT}px;
  background-color: ${trackColor};
  pointer-events: none;
`;

export const ProgressHeaderIndicator = styled.div<{ $error: boolean; $indeterminate: boolean }>`
  block-size: 100%;
  background-color: ${({ $error }) => ($error ? errorColor : progressColor)};
  will-change: transform;

  ${({ $indeterminate }) =>
    $indeterminate
      ? css`
          inline-size: 40%;
          animation: ${moveFromLeft} 1400ms ${easingLinear} infinite;

          ${StyledProgressHeader}:dir(rtl) & {
            animation-name: ${moveFromRight};
          }

          @media (prefers-reduced-motion: reduce) {
            animation: none;
            transform: translate3d(75%, 0, 0);
          }
        `
      : css`
          inline-size: 100%;
          transform: scaleX(var(--admiral-progress-header-value));
          transform-origin: left center;
          transition: transform ${durationShort4} ${easingDecelerateStandard};

          ${StyledProgressHeader}:dir(rtl) & {
            transform-origin: right center;
          }

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        `}
`;

import { css, keyframes, type ExecutionContext } from 'styled-components';

import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

const skeletonColors: Record<'rest' | 'hover', CssToken> = {
  rest: cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest),
  hover: cssToken('--admiral-color-neutral-base-opacity-hover', (theme) => theme.color.neutral.base.opacity.hover),
};

const skeletonAnimation = (p: ExecutionContext & object) => keyframes`
  0% {
    background-color: ${skeletonColors.rest(p)};
    border-color: ${skeletonColors.rest(p)};
  }
  50% {
    background-color: ${skeletonColors.hover(p)};
    border-color: ${skeletonColors.hover(p)};
  }
  100% {
    background-color: ${skeletonColors.rest(p)};
    border-color: ${skeletonColors.rest(p)};
  }
`;
/** Skeleton-анимация для встраивания в стили отдельных компонентов */
export const skeletonAnimationMixin = css`
  animation: ${(p) => skeletonAnimation(p)} 4s ease infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &&& {
      background-color: ${(p) => skeletonColors.rest(p)};
      border-color: ${(p) => skeletonColors.rest(p)};
    }
  }
`;

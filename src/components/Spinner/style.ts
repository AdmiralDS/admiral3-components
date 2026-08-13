import styled, { css, keyframes } from 'styled-components';

import { SPINNER_DIMENSION_PARAMETERS } from './constants';
import SpinnerIcon from './SpinnerIcon.svg?react';
import type { SpinnerAppearance, StyledSpinnerProps } from './types';
import { easingLinear } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const spinnerColors: Record<SpinnerAppearance, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  colored: cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest),
  staticWhite: cssToken(
    '--admiral-color-neutral-text-static-white-1',
    (theme) => theme.color.neutral.text.staticWhite._1,
  ),
  inverted: cssToken('--admiral-color-neutral-text-inverted-rest', (theme) => theme.color.neutral.text.inverted.rest),
};

export const StyledSpinnerIcon = styled(SpinnerIcon)<StyledSpinnerProps>`
  display: block;
  flex: 0 0 auto;
  height: ${({ $dimension }) => SPINNER_DIMENSION_PARAMETERS[$dimension]}px;
  width: ${({ $dimension }) => SPINNER_DIMENSION_PARAMETERS[$dimension]}px;
  color: ${(props) => props.$colorConfig?.color ?? spinnerColors[props.$appearance](props)};
  animation: ${spin} 1s ${easingLinear} infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${({ $dimension }) =>
    $dimension &&
    css`
      path:not([data-dimension='${$dimension}']) {
        display: none;
      }
    `}
`;

export const StyledSpinner = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  line-height: 0;
  vertical-align: middle;
`;

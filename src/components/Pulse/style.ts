import styled, { keyframes } from 'styled-components';

import { cssToken } from '#src/theme/cssToken';
import type { CssToken } from '#src/theme/cssToken';

import { PULSE_DIMENSION_PARAMETERS } from './constants';
import type { PulseStatus, StyledPulseProps } from './types';

export const pulseBackgroundColors: Record<PulseStatus, CssToken> = {
  info: cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest),
  danger: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
  success: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
  warning: cssToken('--admiral-color-warning-base-1-rest', (theme) => theme.color.warning.base._1.rest),
};

const createPulseAnimation = (scale: number, blur: number, waveBorderWidth: number) => keyframes`
  0% {
    opacity: 100%;
    filter: blur(${blur}px);
    box-shadow: inset 0 0 0 1px var(--admiral-pulse-color);
  }

  80% {
    transform: scale(${scale});
    opacity: 0%;
    filter: blur(${blur}px);
    box-shadow: inset 0 0 0 ${waveBorderWidth}px var(--admiral-pulse-color);
  }

  100% {
    opacity: 0%;
  }
`;

const pulseAnimations = {
  s: createPulseAnimation(3.3, 0.2, 0.4),
  m: createPulseAnimation(2.8, 0.33, 0.7),
  l: createPulseAnimation(2.5, 0.33, 1.2),
};

export const PulseElement = styled.div.attrs<
  StyledPulseProps & {
    'data-dimension': string;
    'data-status': string;
  }
>((props) => ({
  'data-dimension': props.$dimension,
  'data-status': props.$colorConfig ? 'custom' : props.$status,
}))<StyledPulseProps>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: ${({ $dimension }) => PULSE_DIMENSION_PARAMETERS[$dimension].size}px;
  inline-size: ${({ $dimension }) => PULSE_DIMENSION_PARAMETERS[$dimension].size}px;
  border-radius: 50%;
  --admiral-pulse-color: ${({ $colorConfig, $status, theme }) =>
    $colorConfig?.backgroundColor ?? pulseBackgroundColors[$status]({ theme })};
  background-color: var(--admiral-pulse-color);

  &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    inline-size: ${({ $dimension }) => PULSE_DIMENSION_PARAMETERS[$dimension].waveSize}px;
    block-size: ${({ $dimension }) => PULSE_DIMENSION_PARAMETERS[$dimension].waveSize}px;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    animation: ${({ $dimension }) => pulseAnimations[$dimension]} 2500ms cubic-bezier(0, 0, 0.58, 1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

import styled from 'styled-components';

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
    animation-name: ${({ $dimension }) => PULSE_DIMENSION_PARAMETERS[$dimension].animationName};
    animation-duration: 2500ms;
    animation-timing-function: cubic-bezier(0, 0, 0.58, 1);
    animation-iteration-count: infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation-name: none;
    }
  }

  @keyframes pulse-animation-s {
    0% {
      opacity: 100%;
      filter: blur(0.2px);
      box-shadow: inset 0 0 0 1px var(--admiral-pulse-color);
    }

    80% {
      transform: scale(3.3);
      opacity: 0%;
      box-shadow: inset 0 0 0 0.4px var(--admiral-pulse-color);
      filter: blur(0.2px);
    }

    100% {
      opacity: 0%;
    }
  }

  @keyframes pulse-animation-m {
    0% {
      opacity: 100%;
      box-shadow: inset 0 0 0 1px var(--admiral-pulse-color);
      filter: blur(0.33px);
    }

    80% {
      transform: scale(2.8);
      opacity: 0%;
      box-shadow: inset 0 0 0 0.7px var(--admiral-pulse-color);
      filter: blur(0.33px);
    }

    100% {
      opacity: 0%;
    }
  }

  @keyframes pulse-animation-l {
    0% {
      opacity: 100%;
      filter: blur(0.33px);
      box-shadow: inset 0 0 0 1px var(--admiral-pulse-color);
    }

    80% {
      transform: scale(2.5);
      opacity: 0%;
      filter: blur(0.33px);
      box-shadow: inset 0 0 0 1.2px var(--admiral-pulse-color);
    }

    100% {
      opacity: 0%;
    }
  }
`;

import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { STEPPER_PROGRESS_MIN_WIDTH } from './constants';
import type { StepperProgressColorMode, StyledStepperProgressBarProps, StyledStepperProgressProps } from './types';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';
import { ProgressPage } from '../ProgressPage';

const textColor = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const secondaryTextColor = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const neutralProgressColor = cssToken(
  '--admiral-color-neutral-stroke-hardest-rest',
  (theme) => theme.color.neutral.stroke.hardest.rest,
);
const primaryProgressColor = cssToken(
  '--admiral-color-primary-stroke-1-rest',
  (theme) => theme.color.primary.stroke._1.rest,
);

const progressColors: Record<StepperProgressColorMode, CssToken> = {
  colored: primaryProgressColor,
  neutral: neutralProgressColor,
};

export const StyledStepperProgress = styled.div<StyledStepperProgressProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: ${({ $mobile }) => ($mobile ? 0 : STEPPER_PROGRESS_MIN_WIDTH)}px;
  color: ${textColor};
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
`;

export const ProgressHeading = styled.div<StyledStepperProgressProps>`
  display: flex;
  flex-direction: ${({ $mobile }) => ($mobile ? 'column' : 'row')};
  align-items: flex-start;
  gap: ${({ $mobile }) => ($mobile ? 0 : 8)}px;
  ${textStyles.body.body2Long}
`;

export const CurrentStep = styled.span`
  min-width: 0;
  flex: 1 1 auto;
`;

export const ProgressValueLabel = styled.span<StyledStepperProgressProps>`
  flex: 0 0 auto;
  max-width: ${({ $mobile }) => ($mobile ? '100%' : '50%')};
  color: ${secondaryTextColor};
`;

export const NextStep = styled.div`
  ${textStyles.caption.caption1}
  color: ${secondaryTextColor};
`;

export const ProgressBar = styled(ProgressPage)<StyledStepperProgressBarProps>`
  min-width: 0;
  --admiral-stepper-progress-fill: ${({ $colorMode }) => progressColors[$colorMode]};

  @media (forced-colors: active) {
    --admiral-stepper-progress-fill: Highlight;
    --admiral-color-neutral-stroke-subtle-rest: Canvas;

    [role='progressbar'] {
      forced-color-adjust: none;
      outline: 1px solid CanvasText;
      outline-offset: -1px;
    }
  }
`;

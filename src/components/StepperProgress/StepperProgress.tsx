import { forwardRef, useId } from 'react';

import { STEPPER_PROGRESS_LOCALE } from './constants';
import {
  CurrentStep,
  NextStep,
  ProgressBar,
  ProgressHeading,
  ProgressValueLabel,
  StyledStepperProgress,
} from './style';
import type { StepperProgressProps } from './types';

const progressAppearance = { progressColor: 'var(--admiral-stepper-progress-fill)' };

/** Показывает текущий шаг и прогресс без интерактивных элементов. */
export const StepperProgress = forwardRef<HTMLDivElement, StepperProgressProps>(
  (
    {
      steps,
      activeStep,
      mobile = false,
      colorMode = 'colored',
      progressFormat = 'steps',
      displayNextStepName = true,
      progressLocale,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-valuetext': ariaValueText,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const currentId = `${id}-current`;
    const nextId = `${id}-next`;
    if (steps.length === 0) return null;

    const {
      stepLabel = STEPPER_PROGRESS_LOCALE.stepLabel,
      progressText = STEPPER_PROGRESS_LOCALE.progressText,
      percentageText = STEPPER_PROGRESS_LOCALE.percentageText,
      renderNextStepName = STEPPER_PROGRESS_LOCALE.renderNextStepName,
      valueText = STEPPER_PROGRESS_LOCALE.valueText,
    } = progressLocale ?? {};
    const activeStepIndex = Math.max(
      0,
      Math.min(steps.length - 1, Number.isFinite(activeStep) ? Math.trunc(activeStep) : 0),
    );
    const currentStepNumber = activeStepIndex + 1;
    const percentage = (currentStepNumber / steps.length) * 100;
    const progressValueText =
      progressFormat === 'percentage' ? percentageText(percentage) : progressText(currentStepNumber, steps.length);
    const accessibleValueText =
      ariaValueText ??
      (progressFormat === 'percentage'
        ? `${valueText(currentStepNumber, steps.length)}, ${progressValueText}`
        : valueText(currentStepNumber, steps.length));
    const getStepName = (index: number) => (steps[index].trim() ? steps[index] : stepLabel(index + 1));
    const showNextStep = displayNextStepName && currentStepNumber < steps.length;
    const describedBy = [ariaDescribedBy, showNextStep ? nextId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <StyledStepperProgress
        ref={ref}
        {...props}
        $mobile={mobile}
        data-mobile={mobile ? '' : undefined}
        data-color-mode={colorMode}
        data-progress-format={progressFormat}
      >
        <ProgressHeading $mobile={mobile}>
          <CurrentStep id={currentId}>{getStepName(activeStepIndex)}</CurrentStep>
          <ProgressValueLabel $mobile={mobile}>{progressValueText}</ProgressValueLabel>
        </ProgressHeading>
        <ProgressBar
          $colorMode={colorMode}
          value={percentage}
          appearance={progressAppearance}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel === undefined ? currentId : undefined)}
          aria-describedby={describedBy}
          aria-valuetext={accessibleValueText}
        />
        {showNextStep && <NextStep id={nextId}>{renderNextStepName(getStepName(currentStepNumber))}</NextStep>}
      </StyledStepperProgress>
    );
  },
);

StepperProgress.displayName = 'StepperProgress';

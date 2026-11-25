import { useState } from 'react';

import { Button, StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { STEPPER_PROGRESS_LONG_STEPS, STEPPER_PROGRESS_STORY_STEPS } from './constants';
import { DemoContainer, DemoControls, DemoFrame } from './style';

/** Внутренняя fixture для браузерных проверок; в Storybook не экспортируется. */
export const StepperProgressDirtyTemplate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<readonly string[]>(STEPPER_PROGRESS_STORY_STEPS);
  const [mobile, setMobile] = useState(false);
  const [width, setWidth] = useState(640);
  const [colorMode, setColorMode] = useState<StepperProgressProps['colorMode']>('colored');
  const [progressFormat, setProgressFormat] = useState<StepperProgressProps['progressFormat']>('steps');
  const [displayNextStepName, setDisplayNextStepName] = useState(true);

  return (
    <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <DemoFrame $width={width} $unconstrained data-testid="stepper-progress-frame">
        <Button data-testid="before-progress">До индикатора</Button>
        <StepperProgress
          data-testid="stepper-progress"
          steps={steps}
          activeStep={activeStep}
          mobile={mobile}
          colorMode={colorMode}
          progressFormat={progressFormat}
          displayNextStepName={displayNextStepName}
          aria-describedby="stepper-progress-explanation"
        />
        <Button data-testid="after-progress">После индикатора</Button>
      </DemoFrame>
      <p id="stepper-progress-explanation">Этапы обработки заявки</p>
      <DemoControls>
        <Button onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>Назад</Button>
        <Button onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}>Далее</Button>
        <Button onClick={() => setActiveStep(steps.length - 1)}>Последний шаг</Button>
        <Button onClick={() => setMobile((value) => !value)}>Сменить компоновку</Button>
        <Button onClick={() => setWidth((value) => (value === 640 ? 288 : 640))}>Сменить ширину</Button>
        <Button onClick={() => setColorMode((value) => (value === 'colored' ? 'neutral' : 'colored'))}>
          Сменить цвет
        </Button>
        <Button onClick={() => setProgressFormat((value) => (value === 'steps' ? 'percentage' : 'steps'))}>
          Сменить формат
        </Button>
        <Button onClick={() => setDisplayNextStepName((value) => !value)}>Следующая подпись</Button>
        <Button onClick={() => setSteps(STEPPER_PROGRESS_LONG_STEPS)}>Длинные названия</Button>
        <Button onClick={() => setSteps([])}>Очистить шаги</Button>
        <Button onClick={() => setSteps(['Единственный шаг'])}>Один шаг</Button>
        <Button onClick={() => setSteps(STEPPER_PROGRESS_STORY_STEPS)}>Восстановить шаги</Button>
      </DemoControls>
      <StepperProgress
        data-testid="second-stepper-progress"
        steps={STEPPER_PROGRESS_STORY_STEPS}
        activeStep={1}
        mobile
      />
    </DemoContainer>
  );
};

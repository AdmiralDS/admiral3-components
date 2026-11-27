import { useState } from 'react';

import { Button, StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoControls, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressPlaygroundTemplate = (args: StepperProgressProps) => {
  const [activeStep, setActiveStep] = useState(args.activeStep);
  const current = Math.max(
    0,
    Math.min(args.steps.length - 1, Number.isFinite(activeStep) ? Math.trunc(activeStep) : 0),
  );

  return (
    <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>Текущий шаг входит в прогресс StepperProgress</StoryDemoDescription>
      <DemoFrame>
        <StepperProgress {...args} activeStep={activeStep} />
        <DemoControls>
          <Button disabled={current === 0 || args.steps.length === 0} onClick={() => setActiveStep(current - 1)}>
            Предыдущий шаг
          </Button>
          <Button disabled={current >= args.steps.length - 1} onClick={() => setActiveStep(current + 1)}>
            Следующий шаг
          </Button>
        </DemoControls>
      </DemoFrame>
    </DemoContainer>
  );
};

import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoExamples,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';
import { STEPPER_DIMENSIONS } from '../constants';

export const StepperDimensionsTemplate = (args: StepperProps) => {
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveSteps({});
  }
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StepperDemoExamples>
        {STEPPER_DIMENSIONS.map((dimension) => (
          <StepperDemoExamples key={dimension}>
            <StoryDemoDescription>Dimension {dimension.toUpperCase()}</StoryDemoDescription>
            <Stepper
              {...args}
              activeStep={activeSteps[dimension] ?? args.activeStep}
              onStepChange={(index, event) => {
                setActiveSteps((steps) => ({ ...steps, [dimension]: index }));
                args.onStepChange?.(index, event);
              }}
              dimension={dimension}
              aria-label={`Размер ${dimension}`}
            >
              <Step
                label="Данные"
                description="Контактная информация"
                completed
                visited={0 === args.activeStep}
                redo={(activeSteps[dimension] ?? args.activeStep) === 0}
              />
              <Step label="Доставка" description="Адрес доставки" visited={1 === args.activeStep} />
              <Step label="Оплата" description="Способ оплаты" visited={2 === args.activeStep} />
            </Stepper>
          </StepperDemoExamples>
        ))}
      </StepperDemoExamples>
    </StoryDemoContainer>
  );
};

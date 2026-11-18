import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoExamples,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

export const StepperLastConnectorTemplate = (args: StepperProps) => {
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveSteps({});
  }
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Линия последнего шага скрыта по умолчанию. <code>showLastStepLine</code> включает её явно. В обоих вариантах
        сохраняются ширина шагов и положение текста.
      </StoryDemoDescription>
      <StepperDemoExamples>
        {[false, true].map((showLastStepLine) => (
          <StepperDemoExamples key={String(showLastStepLine)}>
            <StoryDemoDescription>showLastStepLine = {String(showLastStepLine)}</StoryDemoDescription>
            <Stepper
              {...args}
              activeStep={activeSteps[String(showLastStepLine)] ?? args.activeStep}
              onStepChange={(index, event) => {
                setActiveSteps((steps) => ({ ...steps, [String(showLastStepLine)]: index }));
                args.onStepChange?.(index, event);
              }}
              showLastStepLine={showLastStepLine}
            >
              <Step
                label="Данные"
                description="Контактная информация"
                completed
                visited={0 === args.activeStep}
                redo={(activeSteps[String(showLastStepLine)] ?? args.activeStep) === 0}
              />
              <Step label="Доставка" description="Адрес доставки" visited={1 === args.activeStep} />
              <Step label="Оплата" description="Выбор способа оплаты" visited={2 === args.activeStep} />
            </Stepper>
          </StepperDemoExamples>
        ))}
      </StepperDemoExamples>
    </StoryDemoContainer>
  );
};

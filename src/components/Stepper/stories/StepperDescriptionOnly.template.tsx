import { useState } from 'react';

import styled from 'styled-components';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoFrame,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

const DescriptionFrame = styled(StepperDemoFrame)`
  max-width: 768px;
`;

export const StepperDescriptionOnlyTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(args.activeStep);
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveStep(args.activeStep);
  }
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Пояснение <code>description</code> обязательно, заголовок <code>label</code> можно опустить. Без заголовка
        пояснение становится доступным именем шага. При переполнении Tooltip содержит только пояснение.
      </StoryDemoDescription>
      <DescriptionFrame>
        <Stepper
          {...args}
          activeStep={activeStep}
          onStepChange={(index, event) => {
            setActiveStep(index);
            args.onStepChange?.(index, event);
          }}
        >
          <Step
            description="Завершенный шаг. Вторая строка."
            completed
            visited={0 === args.activeStep}
            redo={activeStep === 0}
          />
          <Step description="Текущий шаг. Вторая строка." visited={1 === args.activeStep} />
          <Step description="Следующий шаг." visited={2 === args.activeStep} />
          <Step description="Следующий четвертый шаг." visited={3 === args.activeStep} />
        </Stepper>
      </DescriptionFrame>
    </StoryDemoContainer>
  );
};

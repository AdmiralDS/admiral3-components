import { useState } from 'react';

import styled from 'styled-components';

import { Button, Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoControls,
  StepperDemoFrame,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

const MobileFrame = styled(StepperDemoFrame)`
  max-width: 320px;
`;

export const StepperMobileTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [furthestStep, setFurthestStep] = useState(0);
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        <code>mobile</code> включает горизонтальную прокрутку и фиксированную равную ширину шагов. Новый текущий шаг
        выравнивается с отступом 16px слева, пока это позволяет граница прокрутки. Завершённые и будущие шаги можно
        просматривать прокруткой пальцем.
      </StoryDemoDescription>
      <MobileFrame>
        <Stepper
          {...args}
          mobile
          activeStep={activeStep}
          onStepChange={setActiveStep}
          aria-label="Мобильные шаги"
          data-testid="mobile-stepper"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <Step
              key={index}
              label={`Этап ${index + 1}`}
              description="Описание этапа"
              completed={completed.includes(index)}
              visited={index <= furthestStep}
              redo={completed.includes(index)}
            />
          ))}
        </Stepper>
        <StepperDemoControls>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)}>
            Назад
          </Button>
          <Button
            disabled={activeStep === 7}
            onClick={() => {
              setCompleted((steps) => [...new Set([...steps, activeStep])]);
              setFurthestStep((step) => Math.max(step, activeStep + 1));
              setActiveStep((step) => step + 1);
            }}
          >
            Далее
          </Button>
        </StepperDemoControls>
      </MobileFrame>
    </StoryDemoContainer>
  );
};

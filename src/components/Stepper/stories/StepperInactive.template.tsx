import { useState } from 'react';

import { Button, Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import { StepperDemoControls, StepperDemoFrame, StepperStoryContainer, StepperStoryDescription } from './style';

const STEPS = [
  { label: 'Данные', description: 'Контактная информация' },
  { label: 'Адрес', description: 'Адрес доставки' },
  { label: 'Оплата', description: 'Выбор способа оплаты' },
  { label: 'Подтверждение', description: 'Проверка заказа' },
];

export const StepperInactiveTemplate = ({ activeStep: initialStep, ...args }: StepperProps) => {
  const [previousInitialStep, setPreviousInitialStep] = useState(initialStep);
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completed, setCompleted] = useState<number[]>(() =>
    STEPS.map((_, index) => index).filter((index) => index < initialStep),
  );
  if (!Object.is(previousInitialStep, initialStep)) {
    setPreviousInitialStep(initialStep);
    setActiveStep(initialStep);
    setCompleted(STEPS.map((_, index) => index).filter((index) => index < initialStep));
  }
  return (
    <StepperStoryContainer $direction="column" $gap="24px" $withBackground={false}>
      <StepperStoryDescription>
        Неактивный Stepper. Шаги нельзя нажимать, Tab пропускает всю последовательность. Переходами управляют кнопки
        «Далее» и «Назад» во внешней форме.
      </StepperStoryDescription>
      <StepperDemoFrame>
        <Stepper {...args} activeStep={activeStep} onStepChange={undefined}>
          {STEPS.map((step, index) => (
            <Step key={step.label} {...step} completed={completed.includes(index)} />
          ))}
        </Stepper>
        <StepperDemoControls>
          <Button disabled={activeStep <= 0} onClick={() => setActiveStep((step) => step - 1)}>
            Назад
          </Button>
          <Button
            disabled={activeStep >= STEPS.length - 1}
            onClick={() => {
              if (activeStep >= 0) setCompleted((steps) => [...new Set([...steps, activeStep])]);
              setActiveStep((step) => step + 1);
            }}
          >
            Далее
          </Button>
        </StepperDemoControls>
      </StepperDemoFrame>
    </StepperStoryContainer>
  );
};

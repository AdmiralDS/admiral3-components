import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoExamples,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

const REACHED_STEP = 2;
const STEPS = [
  { label: 'Данные', description: 'Контактная информация' },
  { label: 'Адрес', description: 'Адрес доставки' },
  { label: 'Оплата', description: 'Выбор способа оплаты' },
  { label: 'Проверка', description: 'Проверка заказа' },
  { label: 'Отправка', description: 'Ожидает подтверждения' },
];

export const StepperNavigationTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(REACHED_STEP);
  const redoing = activeStep < REACHED_STEP;
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription role="status" data-testid="navigation-state">
        Сейчас открыт шаг {activeStep + 1} из {STEPS.length}: <strong>{STEPS[activeStep].label}</strong>.{' '}
        {redoing ? 'Повторное редактирование завершённого шага (redo).' : 'Продолжение оформления, без redo.'}
      </StoryDemoDescription>
      <StepperDemoExamples>
        <Stepper {...args} activeStep={activeStep} onStepChange={setActiveStep} aria-label="Редактирование заказа">
          {STEPS.map((step, index) => (
            <Step
              key={step.label}
              {...step}
              completed={index < REACHED_STEP}
              visited={index <= REACHED_STEP}
              redo={redoing && index === activeStep}
            />
          ))}
        </Stepper>
      </StepperDemoExamples>
    </StoryDemoContainer>
  );
};

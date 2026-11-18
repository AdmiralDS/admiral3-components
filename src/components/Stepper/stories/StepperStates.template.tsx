import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoFrame,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

export const StepperStatesTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(3);
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        <code>status</code> обозначает ошибку или предупреждение, <code>disabled</code> блокирует действие.{' '}
        <code>redo</code> добавляет пунктирную линию текущему повторно редактируемому шагу. Состояния доступны
        скринридеру текстом и не зависят только от цвета.
      </StoryDemoDescription>
      <StepperDemoFrame>
        <Stepper
          {...args}
          activeStep={activeStep}
          onStepChange={(index, event) => {
            setActiveStep(index);
            args.onStepChange?.(index, event);
          }}
          aria-label="Состояния шагов"
        >
          <Step label="Готово" description="Шаг завершён" completed redo={activeStep === 0} />
          <Step label="Ошибка" status="error" completed description="Проверьте данные" redo={activeStep === 1} />
          <Step label="Недоступно" description="Изменение запрещено" disabled completed redo={activeStep === 2} />
          <Step label="Редактирование" redo description="Повторное заполнение" visited />
          <Step label="Предупреждение" description="Проверьте введённые данные" status="warning" />
          <Step label="Далее" description="Будущий шаг" />
        </Stepper>
      </StepperDemoFrame>
    </StoryDemoContainer>
  );
};

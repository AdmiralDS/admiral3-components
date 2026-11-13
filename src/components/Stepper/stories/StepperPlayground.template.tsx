import { Children, cloneElement, isValidElement, useState } from 'react';

import { Step, Stepper, type StepperProps, type StepProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoFrame,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

export const StepperPlaygroundTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(args.activeStep);
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveStep(args.activeStep);
  }
  const steps = Children.toArray(
    args.children ?? [
      <Step key="details" label="Данные" description="Контактная информация" completed />,
      <Step key="address" label="Адрес" description="Адрес доставки" />,
      <Step key="payment" label="Оплата" description="Выбор способа оплаты" />,
      <Step key="confirmation" label="Подтверждение" description="Проверка заказа" />,
    ],
  ).filter(isValidElement<StepProps>);
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Активный Stepper. <code>Tab</code> входит в текущий шаг, стрелки перемещают фокус, <code>Enter</code> или{' '}
        <code>Space</code> выбирает завершённый шаг. <code>activeStep</code> задаёт начальный индекс с нуля,{' '}
        <code>completed</code> независимо отмечает завершение.
      </StoryDemoDescription>
      <StepperDemoFrame>
        <Stepper
          {...args}
          activeStep={activeStep}
          onStepChange={(index, event) => {
            setActiveStep(index);
            args.onStepChange?.(index, event);
          }}
        >
          {steps.map((step, index) =>
            cloneElement(step, {
              visited: step.props.visited || index === args.activeStep,
              redo: step.props.redo || (step.props.completed && index === activeStep),
            }),
          )}
        </Stepper>
      </StepperDemoFrame>
    </StoryDemoContainer>
  );
};

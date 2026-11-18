import { useId, useRef, useState } from 'react';

import { Button, Input, Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoControls,
  StepperDemoField,
  StepperDemoFrame,
  StepperDemoHeading,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';

const FORM_LABELS = ['Данные', 'Доставка', 'Подтверждение'];
const FORM_DESCRIPTIONS = ['Контактная информация', 'Адрес доставки', 'Проверка заказа'];

export const StepperFormTemplate = (args: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [furthestStep, setFurthestStep] = useState(0);
  const pendingFocus = useRef(false);
  const contentId = useId();
  const headingId = useId();
  const inputId = useId();
  const moveTo = (index: number) => {
    pendingFocus.current = true;
    setActiveStep(index);
    setFurthestStep((step) => Math.max(step, index));
  };
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Stepper управляет только шагами. Приложение связывает кнопки с содержимым через <code>aria-controls</code> и
        после «Далее» или «Назад» переводит фокус на новый заголовок. При навигации стрелками фокус остаётся на шаге.
      </StoryDemoDescription>
      <StepperDemoFrame>
        <Stepper {...args} activeStep={activeStep} onStepChange={setActiveStep} aria-label="Оформление заказа">
          {FORM_LABELS.map((label, index) => (
            <Step
              key={label}
              label={label}
              description={FORM_DESCRIPTIONS[index]}
              completed={completed.includes(index)}
              visited={index <= furthestStep}
              redo={completed.includes(index)}
              buttonProps={{ 'aria-controls': contentId }}
            />
          ))}
        </Stepper>
        <section id={contentId} aria-labelledby={headingId}>
          <StepperDemoHeading
            key={activeStep}
            id={headingId}
            tabIndex={-1}
            ref={(element) => {
              if (element && pendingFocus.current) {
                pendingFocus.current = false;
                element.focus();
              }
            }}
          >
            {FORM_LABELS[activeStep]}
          </StepperDemoHeading>
          <StepperDemoField>
            <label htmlFor={inputId}>Комментарий</label>
            <Input id={inputId} />
          </StepperDemoField>
          <StepperDemoControls>
            <Button disabled={activeStep === 0} onClick={() => moveTo(activeStep - 1)}>
              Назад
            </Button>
            <Button
              disabled={activeStep === 2}
              onClick={() => {
                setCompleted((steps) => [...new Set([...steps, activeStep])]);
                moveTo(activeStep + 1);
              }}
            >
              Далее
            </Button>
          </StepperDemoControls>
        </section>
      </StepperDemoFrame>
    </StoryDemoContainer>
  );
};

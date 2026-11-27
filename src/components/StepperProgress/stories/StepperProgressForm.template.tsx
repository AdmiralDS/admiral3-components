import { useId, useRef, useState } from 'react';

import { Button, Input, StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoControls, DemoField, DemoFrame, DemoHeading } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressFormTemplate = (args: StepperProgressProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const pendingFocus = useRef(false);
  const headingId = useId();
  const inputId = useId();
  const steps = args.steps.length ? args.steps : ['Заполнение данных'];
  const current = Math.min(activeStep, steps.length - 1);
  const moveTo = (index: number) => {
    pendingFocus.current = true;
    setActiveStep(index);
  };

  return (
    <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Приложение обновляет контент и после «Далее» или «Назад» переводит фокус на заголовок нового шага. Сам индикатор
        не перемещает фокус и пропускается при Tab.
      </StoryDemoDescription>
      <DemoFrame>
        <StepperProgress {...args} steps={steps} activeStep={current} />
        <section aria-labelledby={headingId}>
          <DemoHeading
            key={current}
            id={headingId}
            tabIndex={-1}
            ref={(element) => {
              if (element && pendingFocus.current) {
                pendingFocus.current = false;
                element.focus();
              }
            }}
          >
            {steps[current]}
          </DemoHeading>
          <DemoField>
            <label htmlFor={inputId}>Комментарий к шагу</label>
            <Input key={current} id={inputId} />
          </DemoField>
          <DemoControls>
            <Button disabled={current === 0} onClick={() => moveTo(current - 1)}>
              Назад
            </Button>
            <Button disabled={current === steps.length - 1} onClick={() => moveTo(current + 1)}>
              Далее
            </Button>
          </DemoControls>
        </section>
      </DemoFrame>
    </DemoContainer>
  );
};

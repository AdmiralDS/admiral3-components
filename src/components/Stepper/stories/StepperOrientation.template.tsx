import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoExamples,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';
import { STEPPER_ORIENTATIONS } from '../constants';

export const StepperOrientationTemplate = (args: StepperProps) => {
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveSteps({});
  }
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Horizontal располагает равные сегменты в строку. Vertical занимает ширину контейнера и увеличивает высоту по
        содержимому. Без <code>stepWidth</code> горизонтальные шаги поровну делят доступную ширину, а вертикальные
        занимают всю ширину контейнера. Числовой <code>stepWidth</code> задаёт фиксированную ширину каждого шага в
        пикселях в обеих ориентациях; попробуйте изменить его в Controls. На мобильных устройствах используйте
        горизонтальный вариант с <code>mobile</code>: ширина шага по умолчанию 133px.
      </StoryDemoDescription>
      <StepperDemoExamples>
        {STEPPER_ORIENTATIONS.map((orientation) => (
          <StepperDemoExamples key={orientation}>
            <StoryDemoDescription>Orientation {orientation}</StoryDemoDescription>
            <Stepper
              {...args}
              activeStep={activeSteps[orientation] ?? args.activeStep}
              onStepChange={(index, event) => {
                setActiveSteps((steps) => ({ ...steps, [orientation]: index }));
                args.onStepChange?.(index, event);
              }}
              orientation={orientation}
              mobile={false}
              aria-label={`Ориентация ${orientation}`}
            >
              <Step
                label="Данные"
                description="Контактная информация"
                completed
                visited={0 === args.activeStep}
                redo={(activeSteps[orientation] ?? args.activeStep) === 0}
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

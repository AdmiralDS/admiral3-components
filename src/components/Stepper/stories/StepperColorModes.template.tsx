import { useState } from 'react';

import { Step, Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import {
  StepperDemoExamples,
  StepperStoryContainer as StoryDemoContainer,
  StepperStoryDescription as StoryDemoDescription,
} from './style';
import { STEPPER_COLOR_MODES } from '../constants';

export const StepperColorModesTemplate = (args: StepperProps) => {
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [previousInitialStep, setPreviousInitialStep] = useState(args.activeStep);
  if (!Object.is(previousInitialStep, args.activeStep)) {
    setPreviousInitialStep(args.activeStep);
    setActiveSteps({});
  }
  return (
    <StoryDemoContainer $direction="column" $gap="24px" $withBackground={false}>
      <StoryDemoDescription>
        Colored использует основной акцент, Neutral — нейтральный. Ошибки и предупреждения сохраняют семантические
        цвета.
      </StoryDemoDescription>
      <StepperDemoExamples>
        {STEPPER_COLOR_MODES.map((colorMode) => (
          <StepperDemoExamples key={colorMode}>
            <StoryDemoDescription>Color mode {colorMode}</StoryDemoDescription>
            <Stepper
              {...args}
              activeStep={activeSteps[colorMode] ?? args.activeStep}
              onStepChange={(index, event) => {
                setActiveSteps((steps) => ({ ...steps, [colorMode]: index }));
                args.onStepChange?.(index, event);
              }}
              colorMode={colorMode}
              aria-label={`Цветовой режим ${colorMode}`}
            >
              <Step
                label="Данные"
                description="Шаг завершён"
                completed
                visited={0 === args.activeStep}
                redo={(activeSteps[colorMode] ?? args.activeStep) === 0}
              />
              <Step label="Доставка" description="Текущий этап" visited={1 === args.activeStep} />
              <Step label="Оплата" description="Следующий этап" visited={2 === args.activeStep} />
            </Stepper>
          </StepperDemoExamples>
        ))}
      </StepperDemoExamples>
    </StoryDemoContainer>
  );
};

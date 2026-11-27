import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

const STEPPER_PROGRESS_LONG_STEPS = [
  'Название текущего шага, которое не помещается в одну строку и переносится на следующую',
  'Название следующего шага, которое полностью переносится на несколько строк и остаётся доступным без подсказки',
  'Подписание договора после проверки документов и согласования условий',
];

export const StepperProgressLongLabelsTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>
      Длинные названия переносятся между словами. Высота растёт по содержимому, Tooltip не требуется.
    </StoryDemoDescription>
    <DemoExamples>
      <DemoFrame>
        <StepperProgress {...args} steps={STEPPER_PROGRESS_LONG_STEPS} activeStep={0} />
      </DemoFrame>
      <DemoFrame $width={288}>
        <StepperProgress {...args} steps={STEPPER_PROGRESS_LONG_STEPS} activeStep={1} mobile />
      </DemoFrame>
    </DemoExamples>
  </DemoContainer>
);

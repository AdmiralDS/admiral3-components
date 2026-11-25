import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressFormatsTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>В шагах и процентах отображается одно и то же положение в процессе.</StoryDemoDescription>
    <DemoFrame>
      <DemoExamples>
        <StepperProgress {...args} progressFormat="steps" />
        <StepperProgress {...args} progressFormat="percentage" />
      </DemoExamples>
    </DemoFrame>
  </DemoContainer>
);

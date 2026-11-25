import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressNextStepTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>Следующую подпись можно отключить вместе с занимаемым ею пространством.</StoryDemoDescription>
    <DemoFrame>
      <DemoExamples>
        <StepperProgress {...args} displayNextStepName />
        <StepperProgress {...args} displayNextStepName={false} />
      </DemoExamples>
    </DemoFrame>
  </DemoContainer>
);

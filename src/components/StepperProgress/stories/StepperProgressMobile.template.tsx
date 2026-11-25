import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressMobileTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>
      Mobile занимает ширину контейнера; название и показатель расположены друг под другом. Desktop имеет минимум 388px.
    </StoryDemoDescription>
    <DemoExamples>
      {[288, 320].map((width) => (
        <DemoFrame key={width} $width={width}>
          <StepperProgress {...args} mobile />
        </DemoFrame>
      ))}
      {[388, 640].map((width) => (
        <DemoFrame key={width} $width={width}>
          <StepperProgress {...args} mobile={false} />
        </DemoFrame>
      ))}
    </DemoExamples>
  </DemoContainer>
);

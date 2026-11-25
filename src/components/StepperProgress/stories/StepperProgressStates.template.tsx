import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';
import { StoryDemoDescription } from '../../stories/StoryContainers';

export const StepperProgressStatesTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <StoryDemoDescription>
      Первый, средний, последний и единственный шаг. У последнего шага нет следующей подписи.
    </StoryDemoDescription>
    <DemoFrame>
      <DemoExamples>
        <StepperProgress {...args} activeStep={0} />
        <StepperProgress {...args} activeStep={Math.floor(args.steps.length / 2)} />
        <StepperProgress {...args} activeStep={args.steps.length - 1} />
        <StepperProgress {...args} steps={['Единственный шаг']} activeStep={0} />
      </DemoExamples>
    </DemoFrame>
  </DemoContainer>
);

import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { DemoContainer, DemoExamples, DemoFrame } from './style';

export const StepperProgressColorModesTemplate = (args: StepperProgressProps) => (
  <DemoContainer $direction="column" $gap="24px" $withBackground={false}>
    <DemoFrame>
      <DemoExamples>
        <StepperProgress {...args} colorMode="colored" />
        <StepperProgress {...args} colorMode="neutral" />
      </DemoExamples>
    </DemoFrame>
  </DemoContainer>
);

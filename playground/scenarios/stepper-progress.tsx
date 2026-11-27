import type { PlaygroundScenario } from './index';
import type { StepperProgressProps } from '../../src/components/StepperProgress';
import { STEPPER_PROGRESS_STORY_STEPS } from '../../src/components/StepperProgress/stories/constants';
import { StepperProgressDirtyTemplate } from '../../src/components/StepperProgress/stories/StepperProgressDirty.template';
import { StepperProgressFormTemplate } from '../../src/components/StepperProgress/stories/StepperProgressForm.template';
import { StepperProgressPlaygroundTemplate } from '../../src/components/StepperProgress/stories/StepperProgressPlayground.template';

const defaultArgs: StepperProgressProps = {
  steps: STEPPER_PROGRESS_STORY_STEPS,
  activeStep: 2,
};

export const stepperProgressScenarios: PlaygroundScenario[] = [
  {
    id: 'stepper-progress/default',
    title: 'StepperProgress Default',
    render: () => <StepperProgressPlaygroundTemplate {...defaultArgs} data-testid="stepper-progress" />,
  },
  {
    id: 'stepper-progress/dirty',
    title: 'StepperProgress / Internal checks',
    render: () => <StepperProgressDirtyTemplate />,
  },
  {
    id: 'stepper-progress/form',
    title: 'StepperProgress / Form',
    render: () => <StepperProgressFormTemplate {...defaultArgs} data-testid="stepper-progress" />,
  },
];

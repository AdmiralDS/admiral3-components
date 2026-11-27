import type { Meta, StoryObj } from '@storybook/react-vite';

import { StepperProgress, type StepperProgressProps } from '@admiral-ds/admiral3-components';

import { STEPPER_PROGRESS_STORY_STEPS } from './constants';
import { StepperProgressColorModesTemplate } from './StepperProgressColorModes.template';
import colorModesRaw from './StepperProgressColorModes.template?raw';
import { StepperProgressFormTemplate } from './StepperProgressForm.template';
import formRaw from './StepperProgressForm.template?raw';
import { StepperProgressFormatsTemplate } from './StepperProgressFormats.template';
import formatsRaw from './StepperProgressFormats.template?raw';
import { StepperProgressLocalizationTemplate } from './StepperProgressLocalization.template';
import localizationRaw from './StepperProgressLocalization.template?raw';
import { StepperProgressLongLabelsTemplate } from './StepperProgressLongLabels.template';
import longLabelsRaw from './StepperProgressLongLabels.template?raw';
import { StepperProgressMobileTemplate } from './StepperProgressMobile.template';
import mobileRaw from './StepperProgressMobile.template?raw';
import { StepperProgressNextStepTemplate } from './StepperProgressNextStep.template';
import nextStepRaw from './StepperProgressNextStep.template?raw';
import { StepperProgressPlaygroundTemplate } from './StepperProgressPlayground.template';
import stepperProgressPlaygroundTemplateRaw from './StepperProgressPlayground.template?raw';
import { StepperProgressStatesTemplate } from './StepperProgressStates.template';
import statesRaw from './StepperProgressStates.template?raw';
import { STEPPER_PROGRESS_COLOR_MODES, STEPPER_PROGRESS_FORMATS, STEPPER_PROGRESS_MIN_WIDTH } from '../constants';

const componentDescription = `
StepperProgress отображает пользовательский прогресс в виде заполняющеся линии. Текущий шаг входит в заполнение.

Компонент неинтерактивен: Tab пропускает индикатор, Enter и Space его не активируют.

Desktop имеет минимальную ширину ${STEPPER_PROGRESS_MIN_WIDTH}px. Mobile занимает доступную ширину.
`;

const meta = {
  title: 'Components/StepperProgress',
  component: StepperProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
  argTypes: {
    steps: { control: 'object' },
    activeStep: { control: { type: 'number', min: 0, step: 1 } },
    colorMode: { control: { type: 'inline-radio' }, options: STEPPER_PROGRESS_COLOR_MODES },
    progressFormat: { control: { type: 'inline-radio' }, options: STEPPER_PROGRESS_FORMATS },
    mobile: { control: 'boolean' },
    displayNextStepName: { control: 'boolean' },
    progressLocale: { control: false },
  },
} satisfies Meta<typeof StepperProgress>;

export default meta;

const defaultArgs: StepperProgressProps = {
  steps: STEPPER_PROGRESS_STORY_STEPS,
  activeStep: 2,
  colorMode: 'colored',
  progressFormat: 'steps',
  mobile: false,
  displayNextStepName: true,
};

export const Playground: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: (args) => <StepperProgressPlaygroundTemplate key={args.activeStep} {...args} />,
  parameters: { docs: { source: { code: stepperProgressPlaygroundTemplateRaw } } },
};

export const ProgressFormats: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressFormatsTemplate,
  parameters: { docs: { source: { code: formatsRaw } } },
};

export const ColorModes: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressColorModesTemplate,
  parameters: { docs: { source: { code: colorModesRaw } } },
};

export const ProgressStates: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressStatesTemplate,
  parameters: { docs: { source: { code: statesRaw } } },
};

export const NextStep: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressNextStepTemplate,
  parameters: { docs: { source: { code: nextStepRaw } } },
};

export const Mobile: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressMobileTemplate,
  parameters: { docs: { source: { code: mobileRaw } } },
};

export const LongLabels: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressLongLabelsTemplate,
  parameters: { docs: { source: { code: longLabelsRaw } } },
};

export const Localization: StoryObj<StepperProgressProps> = {
  args: defaultArgs,
  render: StepperProgressLocalizationTemplate,
  parameters: { docs: { source: { code: localizationRaw } } },
};

export const Form: StoryObj<StepperProgressProps> = {
  args: { ...defaultArgs, activeStep: 0 },
  render: StepperProgressFormTemplate,
  parameters: { docs: { source: { code: formRaw } } },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pulse, type PulseProps } from '@admiral-ds/admiral3-primitives';

import { PulseDimensionTemplate } from './PulseDimension.template';
import pulseDimensionTemplateRaw from './PulseDimension.template?raw';
import { PulsePlaygroundTemplate } from './PulsePlayground.template';
import pulsePlaygroundTemplateRaw from './PulsePlayground.template?raw';
import { PulseStatusTemplate } from './PulseStatus.template';
import pulseStatusTemplateRaw from './PulseStatus.template?raw';
import { PULSE_DIMENSIONS, PULSE_STATUSES } from '../constants';

const meta = {
  title: 'Components/Pulse',
  component: Pulse,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      options: PULSE_DIMENSIONS,
      control: { type: 'inline-radio' },
    },
    status: {
      options: PULSE_STATUSES,
      control: { type: 'inline-radio' },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Анимированный индикатор для привлечения внимания. Не рекомендуется использовать больше одного Pulse на странице.',
      },
    },
  },
} satisfies Meta<typeof Pulse>;

export default meta;

const defaultArgs: PulseProps = {
  dimension: 'm',
  status: 'info',
};

export const Playground: StoryObj<PulseProps> = {
  args: defaultArgs,
  render: PulsePlaygroundTemplate,
  parameters: {
    docs: { source: { code: pulsePlaygroundTemplateRaw } },
  },
};

export const Sizes: StoryObj<PulseProps> = {
  args: defaultArgs,
  render: PulseDimensionTemplate,
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: pulseDimensionTemplateRaw } },
  },
};

export const Statuses: StoryObj<PulseProps> = {
  args: defaultArgs,
  render: PulseStatusTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: { source: { code: pulseStatusTemplateRaw } },
  },
};

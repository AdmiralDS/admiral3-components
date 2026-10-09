import type { Meta, StoryObj } from '@storybook/react-vite';

import { Hint, type HintProps } from '@admiral-ds/admiral3-components';

import { HintInputTargetTemplate } from './HintInputTarget.template';
import hintInputTargetTemplateRaw from './HintInputTarget.template?raw';
import { HintPlaygroundTemplate } from './HintPlayground.template';
import hintPlaygroundTemplateRaw from './HintPlayground.template?raw';
import { HINT_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Hint',
  component: Hint,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: HINT_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Hint>;

export default meta;

const defaultArgs: Omit<HintProps, 'targetElement'> = {
  children: 'Hint',
  dimension: 'm',
};

export const Playground: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: hintPlaygroundTemplateRaw,
      },
    },
  },
};

export const InputTarget: StoryObj<HintProps> = {
  args: {
    ...defaultArgs,
    children: 'Логин должен содержать от 6 до 32 символов.',
  },
  render: HintInputTargetTemplate,
  parameters: {
    docs: {
      source: {
        code: hintInputTargetTemplateRaw,
      },
    },
  },
  name: 'Позиционирование относительно отдельного элемента',
};

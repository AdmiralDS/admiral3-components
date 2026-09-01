import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldSet, type FieldSetProps } from '@admiral-ds/admiral3-components';

import { FieldSetPlaygroundTemplate } from './FieldSetPlayground.template';
import fieldSetPlaygroundTemplateRaw from './FieldSetPlayground.template?raw';
import { FieldSetSizesTemplate } from './FieldSetSizes.template';
import fieldSetSizesTemplateRaw from './FieldSetSizes.template?raw';
import { FieldSetStatesTemplate } from './FieldSetStates.template';
import fieldSetStatesTemplateRaw from './FieldSetStates.template?raw';
import { FIELDSET_DIMENSIONS, FIELDSET_ORIENTATIONS } from '../constants';

const meta = {
  title: 'Components/FieldSet',
  component: FieldSet,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: FIELDSET_DIMENSIONS,
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: FIELDSET_ORIENTATIONS,
    },
    disabled: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    gap: {
      control: { type: 'number' },
    },
    legend: {
      control: { type: 'text' },
    },
  },
  parameters: {
    controls: {
      exclude: ['children'],
    },
  },
} satisfies Meta<typeof FieldSet>;

export default meta;

const defaultArgs: FieldSetProps = {
  dimension: 'm',
  orientation: 'vertical',
  legend: 'Введите данные пользователя',
};

export const Playground: StoryObj<FieldSetProps> = {
  args: defaultArgs,
  render: FieldSetPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: fieldSetPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<FieldSetProps> = {
  args: defaultArgs,
  render: FieldSetSizesTemplate,
  parameters: {
    controls: {
      exclude: ['dimension', 'children'],
    },
    docs: {
      source: {
        code: fieldSetSizesTemplateRaw,
      },
    },
  },
};

export const States: StoryObj<FieldSetProps> = {
  args: defaultArgs,
  render: FieldSetStatesTemplate,
  parameters: {
    controls: {
      exclude: ['disabled', 'required', 'error', 'children'],
    },
    docs: {
      source: {
        code: fieldSetStatesTemplateRaw,
      },
    },
  },
};

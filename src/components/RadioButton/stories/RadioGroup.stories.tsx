import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup, type RadioGroupProps } from '@admiral-ds/admiral3-components';

import { RadioGroupControlledUncontrolledTemplate } from './RadioGroupControlledUncontrolled.template';
import radioGroupControlledUncontrolledTemplateRaw from './RadioGroupControlledUncontrolled.template?raw';
import { RadioGroupPlaygroundTemplate } from './RadioGroupPlayground.template';
import radioGroupPlaygroundTemplateRaw from './RadioGroupPlayground.template?raw';
import { RadioGroupReadOnlyTemplate } from './RadioGroupReadOnly.template';
import radioGroupReadOnlyTemplateRaw from './RadioGroupReadOnly.template?raw';
import { RadioGroupSizesTemplate } from './RadioGroupSizes.template';
import radioGroupSizesTemplateRaw from './RadioGroupSizes.template?raw';
import { RADIO_BUTTON_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/RadioButton/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: RADIO_BUTTON_DIMENSIONS,
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
    legend: {
      control: { type: 'text' },
    },
    gap: {
      control: { type: 'number' },
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'name', 'onChange', 'value'],
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

const defaultArgs: RadioGroupProps = {
  legend: 'Выберите способ доставки',
  dimension: 'm',
  orientation: 'vertical',
  defaultValue: 'courier',
};

export const Playground: StoryObj<RadioGroupProps> = {
  args: defaultArgs,
  render: RadioGroupPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: radioGroupPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<RadioGroupProps> = {
  args: defaultArgs,
  render: RadioGroupSizesTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'defaultValue', 'dimension', 'disabled', 'legend', 'name', 'onChange', 'value'],
    },
    docs: {
      source: {
        code: radioGroupSizesTemplateRaw,
      },
    },
  },
};

export const ControlledUncontrolled: StoryObj<RadioGroupProps> = {
  args: defaultArgs,
  render: RadioGroupControlledUncontrolledTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'defaultValue', 'legend', 'name', 'onChange', 'value'],
    },
    docs: {
      source: {
        code: radioGroupControlledUncontrolledTemplateRaw,
      },
    },
  },
  name: 'Controlled и uncontrolled',
};

export const ReadOnly: StoryObj<RadioGroupProps> = {
  args: defaultArgs,
  render: RadioGroupReadOnlyTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'defaultValue', 'legend', 'name', 'onChange', 'readOnly', 'value'],
    },
    docs: {
      source: {
        code: radioGroupReadOnlyTemplateRaw,
      },
    },
  },
};

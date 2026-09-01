import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioButton, type RadioButtonProps } from '@admiral-ds/admiral3-components';

import { RadioButtonExtraTextTemplate } from './RadioButtonExtraText.template';
import radioButtonExtraTextTemplateRaw from './RadioButtonExtraText.template?raw';
import { RadioButtonInformerTemplate } from './RadioButtonInformer.template';
import radioButtonInformerTemplateRaw from './RadioButtonInformer.template?raw';
import { RadioButtonPlaygroundTemplate } from './RadioButtonPlayground.template';
import radioButtonPlaygroundTemplateRaw from './RadioButtonPlayground.template?raw';
import { RadioButtonSizesTemplate } from './RadioButtonSizes.template';
import radioButtonSizesTemplateRaw from './RadioButtonSizes.template?raw';
import { RadioButtonStatesTemplate } from './RadioButtonStates.template';
import radioButtonStatesTemplateRaw from './RadioButtonStates.template?raw';
import { RADIO_BUTTON_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/RadioButton/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: RADIO_BUTTON_DIMENSIONS,
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    extraText: {
      control: { type: 'text' },
    },
  },
  parameters: {
    controls: {
      exclude: ['name', 'children'],
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;

const defaultArgs: RadioButtonProps = {
  children: 'RadioButton',
  dimension: 'm',
};

export const Playground: StoryObj<RadioButtonProps> = {
  args: {
    ...defaultArgs,
    extraText: 'Additional text',
    name: 'radio-playground',
  },
  render: RadioButtonPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: radioButtonPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonSizesTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'dimension', 'name'],
    },
    docs: {
      source: {
        code: radioButtonSizesTemplateRaw,
      },
    },
  },
};

export const States: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonStatesTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'checked', 'defaultChecked', 'disabled', 'error', 'name'],
    },
    docs: {
      source: {
        code: radioButtonStatesTemplateRaw,
      },
    },
  },
};

export const ExtraText: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonExtraTextTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'dimension', 'extraText', 'name'],
    },
    docs: {
      source: {
        code: radioButtonExtraTextTemplateRaw,
      },
    },
  },
};

export const WithInformer: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonInformerTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'dimension', 'extraText', 'name'],
    },
    docs: {
      source: {
        code: radioButtonInformerTemplateRaw,
      },
    },
  },
};

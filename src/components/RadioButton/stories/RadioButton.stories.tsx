import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioButton, type RadioButtonProps } from '@admiral-ds/admiral3-primitives';

import { RadioButtonExtraTextTemplate } from './RadioButtonExtraText.template';
import radioButtonExtraTextTemplateRaw from './RadioButtonExtraText.template?raw';
import { RadioButtonFieldsetTemplate } from './RadioButtonFieldset.template';
import radioButtonFieldsetTemplateRaw from './RadioButtonFieldset.template?raw';
import { RadioButtonFieldsetReadOnlyTemplate } from './RadioButtonFieldsetReadOnly.template';
import radioButtonFieldsetReadOnlyTemplateRaw from './RadioButtonFieldsetReadOnly.template?raw';
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
  title: 'Components/RadioButton',
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
    readOnly: {
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
      exclude: ['children', 'checked', 'defaultChecked', 'disabled', 'error', 'name', 'readOnly'],
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

export const Fieldset: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonFieldsetTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'checked', 'defaultChecked', 'name', 'readOnly'],
    },
    docs: {
      source: {
        code: radioButtonFieldsetTemplateRaw,
      },
    },
  },
};

export const FieldsetReadOnly: StoryObj<RadioButtonProps> = {
  args: defaultArgs,
  render: RadioButtonFieldsetReadOnlyTemplate,
  parameters: {
    controls: {
      exclude: ['children', 'checked', 'defaultChecked', 'name', 'readOnly'],
    },
    docs: {
      source: {
        code: radioButtonFieldsetReadOnlyTemplateRaw,
      },
    },
  },
};

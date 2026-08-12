import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckBox, type CheckBoxProps } from '@admiral-ds/admiral3-primitives';

import { CheckBoxAdditionalTextTemplate } from './CheckBoxAdditionalText.template';
import checkBoxAdditionalTextTemplateRaw from './CheckBoxAdditionalText.template?raw';
import { CheckBoxInformerTemplate } from './CheckBoxInformer.template';
import checkBoxInformerTemplateRaw from './CheckBoxInformer.template?raw';
import { CheckBoxPlaygroundTemplate } from './CheckBoxPlayground.template';
import checkBoxPlaygroundTemplateRaw from './CheckBoxPlayground.template?raw';
import { CheckBoxSizesTemplate } from './CheckBoxSizes.template';
import checkBoxSizesTemplateRaw from './CheckBoxSizes.template?raw';
import { CheckBoxStatesTemplate } from './CheckBoxStates.template';
import checkBoxStatesTemplateRaw from './CheckBoxStates.template?raw';
import { CheckBoxTableSelectionTemplate } from './CheckBoxTableSelection.template';
import checkBoxTableSelectionTemplateRaw from './CheckBoxTableSelection.template?raw';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHECK_BOX_DIMENSIONS,
    },
    indeterminate: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    extraText: { control: { type: 'text' } },
  },
} satisfies Meta<typeof CheckBox>;

export default meta;

const defaultArgs: CheckBoxProps = {
  dimension: 'm',
  children: 'Подпись CheckBox',
};

export const Playground: StoryObj<CheckBoxProps> = {
  args: defaultArgs,
  render: CheckBoxPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: checkBoxPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<CheckBoxProps> = {
  args: defaultArgs,
  render: CheckBoxSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: checkBoxSizesTemplateRaw } },
  },
};

export const States: StoryObj<CheckBoxProps> = {
  args: defaultArgs,
  render: CheckBoxStatesTemplate,
  parameters: {
    controls: { exclude: ['children', 'indeterminate', 'error', 'disabled', 'readOnly'] },
    docs: { source: { code: checkBoxStatesTemplateRaw } },
  },
};

export const WithAdditionalText: StoryObj<CheckBoxProps> = {
  args: defaultArgs,
  render: CheckBoxAdditionalTextTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'extraText'] },
    docs: { source: { code: checkBoxAdditionalTextTemplateRaw } },
  },
};

export const WithInformer: StoryObj<CheckBoxProps> = {
  args: defaultArgs,
  render: CheckBoxInformerTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'extraText'] },
    docs: { source: { code: checkBoxInformerTemplateRaw } },
  },
};

export const TableSelection: StoryObj<CheckBoxProps> = {
  render: CheckBoxTableSelectionTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: checkBoxTableSelectionTemplateRaw } },
  },
};

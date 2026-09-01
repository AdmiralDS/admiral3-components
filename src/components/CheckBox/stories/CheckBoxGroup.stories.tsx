import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckBoxGroup, type CheckBoxGroupProps } from '@admiral-ds/admiral3-components';

import { CheckBoxGroupControlledUncontrolledTemplate } from './CheckBoxGroupControlledUncontrolled.template';
import checkBoxGroupControlledUncontrolledTemplateRaw from './CheckBoxGroupControlledUncontrolled.template?raw';
import { CheckBoxGroupPlaygroundTemplate } from './CheckBoxGroupPlayground.template';
import checkBoxGroupPlaygroundTemplateRaw from './CheckBoxGroupPlayground.template?raw';
import { CheckBoxGroupReadOnlyTemplate } from './CheckBoxGroupReadOnly.template';
import checkBoxGroupReadOnlyTemplateRaw from './CheckBoxGroupReadOnly.template?raw';
import { CheckBoxGroupSizesTemplate } from './CheckBoxGroupSizes.template';
import checkBoxGroupSizesTemplateRaw from './CheckBoxGroupSizes.template?raw';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/CheckBox/CheckBoxGroup',
  component: CheckBoxGroup,
  tags: ['autodocs'],
  argTypes: {
    dimension: { control: { type: 'inline-radio' }, options: CHECK_BOX_DIMENSIONS },
    orientation: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    disabled: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    required: { control: { type: 'boolean' } },
    legend: { control: { type: 'text' } },
    gap: { control: { type: 'number' } },
  },
  parameters: { controls: { exclude: ['children', 'name', 'onChange', 'value'] } },
} satisfies Meta<typeof CheckBoxGroup>;

export default meta;

const defaultArgs: CheckBoxGroupProps = {
  legend: 'Выберите подписки',
  dimension: 'm',
  orientation: 'vertical',
  defaultValue: ['notifications'],
};

export const Playground: StoryObj<CheckBoxGroupProps> = {
  args: defaultArgs,
  render: CheckBoxGroupPlaygroundTemplate,
  parameters: { docs: { source: { code: checkBoxGroupPlaygroundTemplateRaw } } },
};

export const Sizes: StoryObj<CheckBoxGroupProps> = {
  args: defaultArgs,
  render: CheckBoxGroupSizesTemplate,
  parameters: {
    controls: { exclude: ['children', 'defaultValue', 'dimension', 'disabled', 'legend', 'name', 'onChange', 'value'] },
    docs: { source: { code: checkBoxGroupSizesTemplateRaw } },
  },
};

export const ControlledUncontrolled: StoryObj<CheckBoxGroupProps> = {
  args: defaultArgs,
  render: CheckBoxGroupControlledUncontrolledTemplate,
  parameters: {
    controls: { exclude: ['children', 'defaultValue', 'legend', 'name', 'onChange', 'value'] },
    docs: { source: { code: checkBoxGroupControlledUncontrolledTemplateRaw } },
  },
  name: 'Controlled и uncontrolled',
};

export const ReadOnly: StoryObj<CheckBoxGroupProps> = {
  args: defaultArgs,
  render: CheckBoxGroupReadOnlyTemplate,
  parameters: {
    controls: { exclude: ['children', 'defaultValue', 'legend', 'name', 'onChange', 'readOnly', 'value'] },
    docs: { source: { code: checkBoxGroupReadOnlyTemplateRaw } },
  },
};

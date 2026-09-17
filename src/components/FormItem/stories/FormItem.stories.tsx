import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import {
  FormItemDisabledStatesTemplate,
  FormItemLongTextTemplate,
  FormItemWithoutLabelTemplate,
} from './FormItemEdgeCases.template';
import { FormItemCounterTemplate, FormItemPlaygroundTemplate } from './FormItemPlayground.template';
import formItemPlaygroundTemplateRaw from './FormItemPlayground.template?raw';
import { FormItemSizesTemplate } from './FormItemSizes.template';
import formItemSizesTemplateRaw from './FormItemSizes.template?raw';
import { FormItemStatesTemplate } from './FormItemStates.template';
import formItemStatesTemplateRaw from './FormItemStates.template?raw';
import { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from '../constants';

const meta = {
  title: 'Components/FormItem',
  component: FormItem,
  tags: ['autodocs'],
  argTypes: {
    dimension: { control: { type: 'inline-radio' }, options: FORM_ITEM_DIMENSIONS },
    required: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    additionalLabel: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    status: { control: { type: 'inline-radio' }, options: FORM_ITEM_STATUSES },
    counter: { control: { type: 'text' } },
    children: { control: false },
  },
} satisfies Meta<typeof FormItem>;

export default meta;

const defaultArgs: FormItemProps = {
  dimension: 'm',
  label: 'Подпись',
  children: <Input />,
};

export const Playground: StoryObj<FormItemProps> = {
  args: defaultArgs,
  render: FormItemPlaygroundTemplate,
  parameters: {
    controls: {
      include: ['label', 'additionalLabel', 'description', 'status', 'counter', 'required', 'disabled', 'dimension'],
    },
    docs: { source: { code: formItemPlaygroundTemplateRaw } },
  },
};

export const Sizes: StoryObj<FormItemProps> = {
  args: defaultArgs,
  render: FormItemSizesTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: formItemSizesTemplateRaw } },
  },
};

export const States: StoryObj<FormItemProps> = {
  args: defaultArgs,
  render: FormItemStatesTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: formItemStatesTemplateRaw } },
  },
};

export const AdditionalLabel: StoryObj<FormItemProps> = {
  args: { ...defaultArgs, label: 'Название', additionalLabel: 'Необязательно', description: 'Дополнительный текст' },
  render: FormItemPlaygroundTemplate,
  parameters: { controls: { include: ['label', 'additionalLabel', 'description', 'dimension'] } },
};

export const Counter: StoryObj<FormItemProps> = {
  args: defaultArgs,
  render: FormItemCounterTemplate,
  parameters: { controls: { disable: true } },
};

export const LongText: StoryObj<FormItemProps> = {
  render: FormItemLongTextTemplate,
  parameters: { controls: { disable: true } },
};

export const WithoutLabel: StoryObj<FormItemProps> = {
  render: FormItemWithoutLabelTemplate,
  parameters: { controls: { disable: true } },
};

export const DisabledStates: StoryObj<FormItemProps> = {
  render: FormItemDisabledStatesTemplate,
  parameters: { controls: { disable: true } },
};

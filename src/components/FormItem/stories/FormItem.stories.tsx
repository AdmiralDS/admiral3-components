import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { FormItemNativeTextareaTemplate } from './FormItemComposition.template';
import formItemCompositionTemplateRaw from './FormItemComposition.template?raw';
import { FormItemCounterTemplate } from './FormItemCounter.template';
import formItemCounterTemplateRaw from './FormItemCounter.template?raw';
import { FormItemLongTextTemplate } from './FormItemLongText.template';
import formItemLongTextTemplateRaw from './FormItemLongText.template?raw';
import { FormItemAdditionalLabelTemplate, FormItemPlaygroundTemplate } from './FormItemPlayground.template';
import formItemPlaygroundTemplateRaw from './FormItemPlayground.template?raw';
import { FormItemSizesTemplate } from './FormItemSizes.template';
import formItemSizesTemplateRaw from './FormItemSizes.template?raw';
import { FormItemStatesTemplate } from './FormItemStates.template';
import formItemStatesTemplateRaw from './FormItemStates.template?raw';
import { FormItemWithoutLabelTemplate } from './FormItemWithoutLabel.template';
import formItemWithoutLabelTemplateRaw from './FormItemWithoutLabel.template?raw';
import { FORM_ITEM_DIMENSIONS, FORM_ITEM_STATUSES } from '../constants';

const meta = {
  title: 'Components/FormItem',
  component: FormItem,
  tags: ['autodocs'],
  argTypes: {
    dimension: { control: { type: 'inline-radio' }, options: FORM_ITEM_DIMENSIONS },
    required: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    additionalLabel: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    status: { control: { type: 'inline-radio' }, options: FORM_ITEM_STATUSES },
    maxLength: { control: { type: 'number', min: 0 } },
    counterThreshold: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
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
      include: [
        'label',
        'additionalLabel',
        'description',
        'status',
        'maxLength',
        'counterThreshold',
        'required',
        'disabled',
        'readOnly',
        'dimension',
      ],
    },
    docs: { source: { code: formItemPlaygroundTemplateRaw } },
  },
};

export const Sizes: StoryObj<FormItemProps> = {
  args: { ...defaultArgs, additionalLabel: 'Необязательно', description: 'Пояснение', maxLength: 20 },
  render: FormItemSizesTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: formItemSizesTemplateRaw } },
  },
};

export const States: StoryObj<FormItemProps> = {
  args: { ...defaultArgs, additionalLabel: 'Дополнение', description: 'Пояснение' },
  render: FormItemStatesTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: formItemStatesTemplateRaw } },
  },
};

export const AdditionalLabel: StoryObj<FormItemProps> = {
  args: { ...defaultArgs, label: 'Название', additionalLabel: 'Необязательно', description: 'Дополнительный текст' },
  render: FormItemAdditionalLabelTemplate,
  parameters: {
    controls: { include: ['label', 'additionalLabel', 'description', 'dimension'] },
    docs: { source: { code: formItemPlaygroundTemplateRaw } },
  },
};

export const Counter: StoryObj<FormItemProps> = {
  args: {
    ...defaultArgs,
    label: 'Название',
    description: 'Не более 20 символов',
    maxLength: 20,
    counterThreshold: 0.8,
  },
  render: FormItemCounterTemplate,
  parameters: {
    controls: {
      include: [
        'dimension',
        'label',
        'additionalLabel',
        'description',
        'maxLength',
        'counterThreshold',
        'required',
        'disabled',
        'readOnly',
        'status',
      ],
    },
    docs: { source: { code: formItemCounterTemplateRaw } },
  },
};

export const LongText: StoryObj<FormItemProps> = {
  args: {
    ...defaultArgs,
    label: 'Очень Длинное Название Поля Очень Длинное Название Поля',
    additionalLabel: 'Очень Длинная Дополнительная Подпись',
    description: 'Очень Длинная Дополнительная Подпись Внизу',
    maxLength: 77,
    counterThreshold: 0.8,
  },
  render: FormItemLongTextTemplate,
  parameters: {
    controls: {
      include: [
        'label',
        'additionalLabel',
        'description',
        'maxLength',
        'counterThreshold',
        'dimension',
        'status',
        'required',
        'disabled',
        'readOnly',
      ],
    },
    docs: { source: { code: formItemLongTextTemplateRaw } },
  },
};

export const WithoutLabel: StoryObj<FormItemProps> = {
  args: { dimension: 'm', description: 'Пояснение', required: true, children: <Input /> },
  render: FormItemWithoutLabelTemplate,
  parameters: {
    controls: { include: ['dimension', 'description', 'maxLength', 'status', 'required', 'disabled', 'readOnly'] },
    docs: { source: { code: formItemWithoutLabelTemplateRaw } },
  },
};

export const NativeTextarea: StoryObj<FormItemProps> = {
  args: {
    ...defaultArgs,
    label: 'Комментарий',
    description: 'Опишите задачу в нескольких предложениях',
    required: true,
  },
  render: FormItemNativeTextareaTemplate,
  parameters: {
    controls: {
      include: ['label', 'additionalLabel', 'description', 'dimension', 'status', 'required', 'disabled', 'readOnly'],
    },
    docs: { source: { code: formItemCompositionTemplateRaw } },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { FormItemNativeTextareaTemplate } from './FormItemComposition.template';
import formItemCompositionTemplateRaw from './FormItemComposition.template?raw';
import { FormItemLongTextTemplate, FormItemWithoutLabelTemplate } from './FormItemEdgeCases.template';
import formItemEdgeCasesTemplateRaw from './FormItemEdgeCases.template?raw';
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
  parameters: {
    docs: {
      description: {
        component: `FormItem оформляет подпись, пояснение и счётчик одного поля. Значением и валидацией управляет само поле или библиотека форм.

Свяжите htmlFor с уникальным id поля, а id элемента внутри description — с aria-describedby поля. Для повторяемых примеров используйте React.useId(). Без видимой подписи задайте полю aria-label или aria-labelledby; placeholder не заменяет подпись.

required показывает только звёздочку: передайте required самому полю для нативной проверки либо aria-required при валидации библиотекой форм. disabled, dimension и status также передаются полю отдельно. Для нативного контрола с ошибкой задайте aria-invalid; Input устанавливает его при status="error". readOnly задаётся только полю.

counter — готовое содержимое, а не автоматический подсчёт. Порог появления и ограничение maxLength показаны в истории Counter. Для группы полей используйте FieldSet.

Примеры библиотечной валидации находятся в Integration/React Hook Form и Integration/TanStack Form.`,
      },
    },
  },
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
  args: { ...defaultArgs, additionalLabel: 'Необязательно', description: 'Пояснение', counter: '16 / 20' },
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
  render: FormItemPlaygroundTemplate,
  parameters: {
    controls: { include: ['label', 'additionalLabel', 'description', 'dimension'] },
    docs: { source: { code: formItemPlaygroundTemplateRaw } },
  },
};

export const Counter: StoryObj<FormItemProps> = {
  args: { ...defaultArgs, label: 'Название', description: 'Не более 20 символов' },
  render: FormItemCounterTemplate,
  parameters: {
    controls: { include: ['dimension', 'label', 'additionalLabel', 'description', 'required', 'disabled', 'status'] },
    docs: { source: { code: formItemPlaygroundTemplateRaw } },
  },
};

export const LongText: StoryObj<FormItemProps> = {
  args: {
    ...defaultArgs,
    label: 'ОченьДлинноеНазваниеПоляБезПробеловОченьДлинноеНазваниеПоляБезПробелов',
    additionalLabel: 'ОченьДлиннаяДополнительнаяПодписьБезПробелов',
    description: 'https://example.org/very-long-address-without-spaces/very-long-address-without-spaces',
    counter: '16 / 20',
  },
  render: FormItemLongTextTemplate,
  parameters: {
    controls: {
      include: ['label', 'additionalLabel', 'description', 'counter', 'dimension', 'status', 'required', 'disabled'],
    },
    docs: { source: { code: formItemEdgeCasesTemplateRaw } },
  },
};

export const WithoutLabel: StoryObj<FormItemProps> = {
  args: { dimension: 'm', description: 'Пояснение', required: true, children: <Input /> },
  render: FormItemWithoutLabelTemplate,
  parameters: {
    controls: { include: ['dimension', 'description', 'counter', 'status', 'required', 'disabled'] },
    docs: { source: { code: formItemEdgeCasesTemplateRaw } },
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
      include: ['label', 'additionalLabel', 'description', 'counter', 'dimension', 'status', 'required', 'disabled'],
    },
    docs: { source: { code: formItemCompositionTemplateRaw } },
  },
};

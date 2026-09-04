import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input, type InputProps } from '@admiral-ds/admiral3-components';

import { InputAffixesTemplate } from './InputAffixes.template';
import inputAffixesTemplateRaw from './InputAffixes.template?raw';
import { InputAffixesAccessibilityTemplate } from './InputAffixesAccessibility.template';
import inputAffixesAccessibilityTemplateRaw from './InputAffixesAccessibility.template?raw';
import { InputClearIconTemplate } from './InputClearIcon.template';
import inputClearIconTemplateRaw from './InputClearIcon.template?raw';
import { InputCurrencyTemplate } from './InputCurrency.template';
import inputCurrencyTemplateRaw from './InputCurrency.template?raw';
import { InputEmailAndUrlTemplate } from './InputEmailAndUrl.template';
import inputEmailAndUrlTemplateRaw from './InputEmailAndUrl.template?raw';
import { InputHighPrecisionNumbersTemplate } from './InputHighPrecisionNumbers.template';
import inputHighPrecisionNumbersTemplateRaw from './InputHighPrecisionNumbers.template?raw';
import { InputIconsTemplate } from './InputIcons.template';
import inputIconsTemplateRaw from './InputIcons.template?raw';
import { InputInformerTemplate } from './InputInformer.template';
import inputInformerTemplateRaw from './InputInformer.template?raw';
import { InputMaskitoTemplate } from './InputMaskito.template';
import inputMaskitoTemplateRaw from './InputMaskito.template?raw';
import { InputPasswordTemplate } from './InputPassword.template';
import inputPasswordTemplateRaw from './InputPassword.template?raw';
import { InputPlaygroundTemplate } from './InputPlayground.template';
import inputPlaygroundTemplateRaw from './InputPlayground.template?raw';
import { InputReadOnlyDataMaskingTemplate } from './InputReadOnlyDataMasking.template';
import inputReadOnlyDataMaskingTemplateRaw from './InputReadOnlyDataMasking.template?raw';
import { InputSizesTemplate } from './InputSizes.template';
import inputSizesTemplateRaw from './InputSizes.template?raw';
import { InputStatesTemplate } from './InputStates.template';
import inputStatesTemplateRaw from './InputStates.template?raw';
import { InputTextOverflowTemplate } from './InputTextOverflow.template';
import inputTextOverflowTemplateRaw from './InputTextOverflow.template?raw';
import { INPUT_APPEARANCES, INPUT_DIMENSIONS, INPUT_STATUSES } from '../constants';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: INPUT_DIMENSIONS,
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: INPUT_APPEARANCES,
    },
    status: {
      control: { type: 'inline-radio' },
      options: INPUT_STATUSES,
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    iconsBefore: { control: false },
    iconsAfter: { control: false },
    showClearIcon: {
      control: { type: 'boolean' },
    },
    prefix: { control: { type: 'text' } },
    suffix: { control: { type: 'text' } },
    showAffixDivider: {
      control: { type: 'boolean' },
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

const defaultArgs: InputProps = {
  appearance: 'standard',
  dimension: 'm',
  placeholder: 'Input',
  readOnly: false,
};

export const Playground: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    name: 'input-playground',
  },
  render: InputPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: inputPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<InputProps> = {
  args: defaultArgs,
  render: InputSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: inputSizesTemplateRaw } },
  },
};

export const States: StoryObj<InputProps> = {
  args: defaultArgs,
  render: InputStatesTemplate,
  parameters: {
    controls: { exclude: ['disabled', 'readOnly', 'status'] },
    docs: { source: { code: inputStatesTemplateRaw } },
  },
};

export const TextOverflow: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    defaultValue: 'Привет! Хотел тебе сказать, что ты андроид',
    showTooltip: true,
  },
  render: InputTextOverflowTemplate,
  parameters: {
    controls: { exclude: ['placeholder', 'value'] },
    docs: { source: { code: inputTextOverflowTemplateRaw } },
  },
};

export const WithClearIcon: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    defaultValue: 'Input',
    showClearIcon: true,
  },
  render: InputClearIconTemplate,
  parameters: {
    docs: { source: { code: inputClearIconTemplateRaw } },
  },
};

export const WithIcons: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    defaultValue: 'Input',
  },
  render: InputIconsTemplate,
  parameters: {
    controls: {
      exclude: ['iconsBefore', 'iconsAfter', 'showClearIcon', 'prefix', 'suffix', 'showAffixDivider'],
    },
    docs: { source: { code: inputIconsTemplateRaw } },
  },
};

export const InputExtended: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    prefix: 'Prefix',
    suffix: 'Suffix',
  },
  render: InputAffixesTemplate,
  parameters: {
    controls: { exclude: ['iconsBefore', 'iconsAfter'] },
    docs: { source: { code: inputAffixesTemplateRaw } },
  },
};

export const AffixesAccessibility: StoryObj<InputProps> = {
  args: defaultArgs,
  render: InputAffixesAccessibilityTemplate,
  parameters: {
    controls: { exclude: ['prefix', 'suffix', 'placeholder'] },
    docs: { source: { code: inputAffixesAccessibilityTemplateRaw } },
  },
};

export const InformerInput: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    defaultValue: 'Input',
  },
  render: InputInformerTemplate,
  parameters: {
    controls: { exclude: ['iconsAfter'] },
    docs: { source: { code: inputInformerTemplateRaw } },
  },
};

export const InputMask: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    name: 'card-number',
    showClearIcon: true,
  },
  render: InputMaskitoTemplate,
  parameters: {
    controls: { exclude: ['defaultValue', 'value', 'onChange', 'onInput', 'placeholder'] },
    docs: { source: { code: inputMaskitoTemplateRaw } },
  },
};

export const PasswordInput: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    defaultValue: 'Password',
    placeholder: 'Введите пароль',
    autoComplete: 'current-password',
  },
  render: InputPasswordTemplate,
  parameters: {
    controls: { exclude: ['type', 'iconsAfter', 'name'] },
    docs: { source: { code: inputPasswordTemplateRaw } },
  },
};

export const EmailAndUrlInput: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    showClearIcon: true,
  },
  render: InputEmailAndUrlTemplate,
  parameters: {
    controls: { exclude: ['type', 'name', 'placeholder', 'autoComplete'] },
    docs: {
      description: {
        story: 'Нативные поля типов email и url с браузерной валидацией, автозаполнением и кнопкой очистки.',
      },
      source: { code: inputEmailAndUrlTemplateRaw },
    },
  },
};

export const CurrencyInput: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    placeholder: 'Введите сумму',
  },
  render: InputCurrencyTemplate,
  parameters: {
    controls: { exclude: ['defaultValue', 'value', 'onChange', 'onInput', 'prefix', 'suffix'] },
    docs: { source: { code: inputCurrencyTemplateRaw } },
  },
};

export const HighPrecisionNumbers: StoryObj<InputProps> = {
  args: {
    ...defaultArgs,
    showClearIcon: true,
  },
  render: InputHighPrecisionNumbersTemplate,
  parameters: {
    controls: { exclude: ['defaultValue', 'value', 'onChange', 'onInput', 'prefix', 'suffix'] },
    docs: { source: { code: inputHighPrecisionNumbersTemplateRaw } },
  },
};

export const ReadOnlyDataMasking: StoryObj<InputProps> = {
  args: defaultArgs,
  render: InputReadOnlyDataMaskingTemplate,
  parameters: {
    controls: {
      exclude: ['defaultValue', 'value', 'onChange', 'readOnly', 'iconsAfter', 'showClearIcon', 'prefix', 'suffix'],
    },
    docs: { source: { code: inputReadOnlyDataMaskingTemplateRaw } },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { TextAreaAutoHeightTemplate } from './TextAreaAutoHeight.template';
import textAreaAutoHeightTemplateRaw from './TextAreaAutoHeight.template?raw';
import { TextAreaClearTemplate } from './TextAreaClear.template';
import textAreaClearTemplateRaw from './TextAreaClear.template?raw';
import { TextAreaControlledTemplate } from './TextAreaControlled.template';
import textAreaControlledTemplateRaw from './TextAreaControlled.template?raw';
import { TextAreaCopyTemplate } from './TextAreaCopy.template';
import textAreaCopyTemplateRaw from './TextAreaCopy.template?raw';
import { TextAreaPlaygroundTemplate } from './TextAreaPlayground.template';
import textAreaPlaygroundTemplateRaw from './TextAreaPlayground.template?raw';
import { TextAreaResizeTemplate } from './TextAreaResize.template';
import textAreaResizeTemplateRaw from './TextAreaResize.template?raw';
import { TextAreaWithFormItemTemplate } from './TextAreaWithFormItem.template';
import textAreaWithFormItemTemplateRaw from './TextAreaWithFormItem.template?raw';
import { TEXT_AREA_APPEARANCES, TEXT_AREA_DIMENSIONS, TEXT_AREA_STATUSES } from '../constants';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TEXT_AREA_DIMENSIONS,
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: TEXT_AREA_APPEARANCES,
    },
    status: {
      control: { type: 'inline-radio', labels: { none: 'Без статуса' } },
      options: ['none', ...TEXT_AREA_STATUSES],
      mapping: { none: undefined },
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    autoHeight: { control: 'boolean' },
    resize: { control: 'boolean' },
    showClearIcon: { control: 'boolean' },
    showCopyIcon: { control: 'boolean' },
    minRows: { control: { type: 'number', min: 1, step: 1 } },
    maxRows: { control: { type: 'number', min: 1, step: 1 } },
    maxLength: { control: { type: 'number', min: 0, step: 1 } },
    clearButtonProps: { control: false, table: { disable: true } },
    copyButtonProps: { control: false, table: { disable: true } },
    containerProps: { control: false, table: { disable: true } },
    containerRef: { control: false, table: { disable: true } },
    onClear: { control: false, table: { disable: true } },
  },
  parameters: {
    controls: {
      include: [
        'dimension',
        'appearance',
        'status',
        'disabled',
        'readOnly',
        'required',
        'maxLength',
        'autoHeight',
        'minRows',
        'maxRows',
        'resize',
        'showClearIcon',
        'showCopyIcon',
      ] satisfies (keyof TextAreaProps)[],
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;

const defaultArgs: TextAreaProps = {
  placeholder: 'Введите текст',
  'aria-label': 'Текст',
  dimension: 'm',
  appearance: 'standard',
  disabled: false,
  readOnly: false,
  required: false,
  autoHeight: false,
  resize: false,
  showClearIcon: false,
  showCopyIcon: false,
  minRows: 2,
};

export const Playground: StoryObj<TextAreaProps> = {
  args: defaultArgs,
  render: TextAreaPlaygroundTemplate,
  parameters: {
    controls: meta.parameters.controls,
    docs: {
      description: {
        story:
          'Поле ввода для многострочного текста. Ширина компонента произвольная. При фиксированной высоте переполнение содержимого вызывает скролл. При включении `autoHeight` высота поля изменяется в зависимости от количества текста.',
      },
      source: {
        code: textAreaPlaygroundTemplateRaw,
      },
    },
  },
};

export const AutoHeight: StoryObj<TextAreaProps> = {
  args: {
    ...defaultArgs,
    autoHeight: true,
    minRows: 2,
    maxRows: 5,
    defaultValue: 'Первая строка\nВторая строка\nТретья строка',
  },
  render: TextAreaAutoHeightTemplate,
  parameters: {
    docs: { source: { code: textAreaAutoHeightTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'appearance',
        'status',
        'disabled',
        'readOnly',
        'autoHeight',
        'minRows',
        'maxRows',
        'maxLength',
        'showClearIcon',
        'showCopyIcon',
      ],
    },
  },
};
export const Resize: StoryObj<TextAreaProps> = {
  args: { ...defaultArgs, resize: true, minRows: 2, maxRows: 8 },
  render: TextAreaResizeTemplate,
  parameters: {
    docs: { source: { code: textAreaResizeTemplateRaw } },
    controls: {
      include: ['dimension', 'appearance', 'status', 'disabled', 'readOnly', 'resize', 'minRows', 'maxRows'],
    },
  },
};
export const Clear: StoryObj<TextAreaProps> = {
  args: { ...defaultArgs, showClearIcon: true, defaultValue: 'Текст для очистки' },
  render: TextAreaClearTemplate,
  parameters: {
    docs: { source: { code: textAreaClearTemplateRaw } },
    controls: {
      include: ['dimension', 'appearance', 'status', 'disabled', 'readOnly', 'required', 'maxLength', 'showClearIcon'],
    },
  },
};
export const Copy: StoryObj<TextAreaProps> = {
  args: { ...defaultArgs, showCopyIcon: true, defaultValue: 'Текст для копирования', readOnly: true },
  render: TextAreaCopyTemplate,
  parameters: {
    docs: { source: { code: textAreaCopyTemplateRaw } },
    controls: { include: ['dimension', 'appearance', 'status', 'disabled', 'readOnly', 'showCopyIcon'] },
  },
};
export const WithFormItem: StoryObj<TextAreaProps> = {
  args: {
    dimension: 'm',
    appearance: 'standard',
    disabled: false,
    readOnly: false,
    required: false,
    maxLength: 100,
    autoHeight: true,
    resize: false,
    minRows: 2,
    maxRows: 5,
    showClearIcon: true,
    showCopyIcon: false,
  },
  render: TextAreaWithFormItemTemplate,
  parameters: { controls: meta.parameters.controls, docs: { source: { code: textAreaWithFormItemTemplateRaw } } },
};
export const Controlled: StoryObj<TextAreaProps> = {
  args: {
    dimension: 'm',
    appearance: 'standard',
    disabled: false,
    readOnly: false,
    maxLength: 100,
    autoHeight: true,
    minRows: 2,
    maxRows: 4,
    showClearIcon: true,
    showCopyIcon: false,
  },
  render: TextAreaControlledTemplate,
  argTypes: {
    required: { control: false, table: { disable: true } },
    resize: { control: false, table: { disable: true } },
  },
  parameters: {
    docs: { source: { code: textAreaControlledTemplateRaw } },
    controls: {
      include: [
        'dimension',
        'appearance',
        'status',
        'disabled',
        'readOnly',
        'autoHeight',
        'minRows',
        'maxRows',
        'maxLength',
        'showClearIcon',
        'showCopyIcon',
      ],
    },
  },
};

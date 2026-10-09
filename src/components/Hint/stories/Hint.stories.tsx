import type { Meta, StoryObj } from '@storybook/react-vite';

import { Hint, type HintProps } from '@admiral-ds/admiral3-components';

import { HintClickTemplate } from './HintClick.template';
import hintClickTemplateRaw from './HintClick.template?raw';
import { HintContentTemplate } from './HintContent.template';
import hintContentTemplateRaw from './HintContent.template?raw';
import { HintInputTargetTemplate } from './HintInputTarget.template';
import hintInputTargetTemplateRaw from './HintInputTarget.template?raw';
import { HintPlaygroundTemplate } from './HintPlayground.template';
import hintPlaygroundTemplateRaw from './HintPlayground.template?raw';
import { HintScrollTemplate } from './HintScroll.template';
import hintScrollTemplateRaw from './HintScroll.template?raw';

const meta = {
  title: 'Components/Hint',
  component: Hint,
  tags: ['autodocs'],
  argTypes: {
    showCloseIcon: {
      control: 'boolean',
    },
    closeButtonProps: { control: false },
  },
} satisfies Meta<typeof Hint>;

export default meta;

const defaultArgs: Omit<HintProps, 'targetElement'> = {
  children: 'Hint',
};

export const Playground: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: hintPlaygroundTemplateRaw,
      },
    },
  },
  name: 'Открытие по наведению или фокусу',
};

export const Click: StoryObj<HintProps> = {
  render: HintClickTemplate,
  parameters: {
    docs: {
      source: {
        code: hintClickTemplateRaw,
      },
    },
  },
  name: 'Открытие по клику или клавише активации',
};

export const InputTarget: StoryObj<HintProps> = {
  args: {
    ...defaultArgs,
    children: 'Логин должен содержать от 6 до 32 символов.',
  },
  render: HintInputTargetTemplate,
  parameters: {
    docs: {
      source: {
        code: hintInputTargetTemplateRaw,
      },
    },
  },
  name: 'Позиционирование относительно отдельного элемента',
};

export const ContentVariants: StoryObj<HintProps> = {
  render: HintContentTemplate,
  parameters: {
    docs: {
      source: {
        code: hintContentTemplateRaw,
      },
    },
  },
  name: 'Варианты контента',
};

export const Scroll: StoryObj<HintProps> = {
  render: HintScrollTemplate,
  parameters: {
    docs: {
      source: {
        code: hintScrollTemplateRaw,
      },
    },
  },
  name: 'Внутренний скролл и максимальная высота',
};

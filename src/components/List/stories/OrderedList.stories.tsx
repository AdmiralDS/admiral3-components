import type { Meta, StoryObj } from '@storybook/react-vite';

import { OrderedList, type OrderedListProps } from '@admiral-ds/admiral3-primitives';

import { OrderedListNumberingTemplate } from './OrderedListNumbering.template';
import orderedListNumberingTemplateRaw from './OrderedListNumbering.template?raw';
import { OrderedListPlaygroundTemplate } from './OrderedListPlayground.template';
import orderedListPlaygroundTemplateRaw from './OrderedListPlayground.template?raw';
import { OrderedListVariantsTemplate } from './OrderedListVariants.template';
import orderedListVariantsTemplateRaw from './OrderedListVariants.template?raw';
import { LIST_DIMENSIONS, ORDERED_LIST_TYPE, LIST_GAP } from '../constants';

const meta = {
  title: 'Components/List/OrderedList',
  component: OrderedList,
  tags: ['autodocs'],
  argTypes: {
    dimension: { control: 'inline-radio', options: LIST_DIMENSIONS },
    styleType: { control: 'inline-radio', options: ORDERED_LIST_TYPE },
    gap: { control: 'number' },
  },
} satisfies Meta<typeof OrderedList>;

export default meta;

const defaultArgs: OrderedListProps = {
  dimension: 'm',
  styleType: 'numbers',
  gap: LIST_GAP,
};

export const OrderedPlaygroundStory: StoryObj<OrderedListProps> = {
  args: defaultArgs,
  render: OrderedListPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: orderedListPlaygroundTemplateRaw,
      },
    },
  },
  name: 'Playground',
};

export const OrderedListVariantsStory: StoryObj<OrderedListProps> = {
  args: defaultArgs,
  render: OrderedListVariantsTemplate,
  parameters: {
    controls: {
      exclude: ['dimension', 'styleType'],
    },
    docs: {
      source: {
        code: orderedListVariantsTemplateRaw,
      },
    },
  },
  name: 'OrderedList. Виды и размеры',
};

export const OrderedListNumberingStory: StoryObj<OrderedListProps> = {
  args: defaultArgs,
  render: OrderedListNumberingTemplate,
  parameters: {
    docs: {
      source: {
        code: orderedListNumberingTemplateRaw,
      },
    },
  },
  name: 'OrderedList. Начало, направление и значение нумерации',
};

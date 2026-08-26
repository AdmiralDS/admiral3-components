import type { Meta, StoryObj } from '@storybook/react-vite';

import { UnorderedList, type UnorderedListProps } from '@admiral-ds/admiral3-components';

import { UnorderedListPlaygroundTemplate } from './UnorderedListPlayground.template';
import unorderedListPlaygroundTemplateRaw from './UnorderedListPlayground.template?raw';
import { UnorderedListVariantsTemplate } from './UnorderedListVariants.template';
import unorderedListVariantsTemplateRaw from './UnorderedListVariants.template?raw';
import { LIST_DIMENSIONS, UNORDERED_LIST_TYPE, LIST_GAP } from '../constants';

const meta = {
  title: 'Components/List/UnorderedList',
  component: UnorderedList,
  tags: ['autodocs'],
  argTypes: {
    dimension: { control: 'inline-radio', options: LIST_DIMENSIONS },
    styleType: { control: 'inline-radio', options: UNORDERED_LIST_TYPE },
    gap: { control: 'number' },
  },
} satisfies Meta<typeof UnorderedList>;

export default meta;

const defaultArgs: UnorderedListProps = {
  dimension: 'm',
  styleType: 'bullet',
  gap: LIST_GAP,
};

export const UnorderedPlaygroundStory: StoryObj<UnorderedListProps> = {
  args: defaultArgs,
  render: UnorderedListPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: unorderedListPlaygroundTemplateRaw,
      },
    },
  },
  name: 'Playground',
};

export const UnorderedListVariantsStory: StoryObj<UnorderedListProps> = {
  args: defaultArgs,
  render: UnorderedListVariantsTemplate,
  parameters: {
    controls: {
      exclude: ['dimension', 'styleType'],
    },
    docs: {
      source: {
        code: unorderedListVariantsTemplateRaw,
      },
    },
  },
  name: 'UnorderedList. Виды и размеры',
};

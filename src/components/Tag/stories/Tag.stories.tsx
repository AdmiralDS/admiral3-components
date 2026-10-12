import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tag, type TagProps } from '@admiral-ds/admiral3-components';

import { TagPlaygroundTemplate } from './TagPlayground.template';
import tagPlaygroundTemplateRaw from './TagPlayground.template?raw';
import { TAG_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TAG_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;

const defaultArgs: TagProps = {
  children: 'Tag',
  dimension: 'm',
};

export const Playground: StoryObj<TagProps> = {
  args: defaultArgs,
  render: TagPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: tagPlaygroundTemplateRaw,
      },
    },
  },
};

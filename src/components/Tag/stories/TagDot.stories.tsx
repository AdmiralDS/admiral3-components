import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagDot, type TagNeutralProps } from '@admiral-ds/admiral3-components';

import { TagPlaygroundTemplate } from './TagPlayground.template';
import tagPlaygroundTemplateRaw from './TagPlayground.template?raw';
import { TAG_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Tags/TagDot',
  component: TagDot,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TAG_DIMENSIONS,
    },
    status: {
      control: { type: 'select' },
      options: [undefined, 'info', 'success', 'error', 'warning', 'attention'],
    },
    withBorder: { control: 'boolean' },
    iconsBefore: { control: false, table: { disable: true } },
    onClick: { action: 'click', control: false },
  },
} satisfies Meta<typeof TagDot>;

export default meta;

const defaultArgs: TagNeutralProps = {
  children: 'TagDot',
  dimension: 'm',
  status: 'success',
  withBorder: false,
};

export const Playground: StoryObj<TagNeutralProps> = {
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

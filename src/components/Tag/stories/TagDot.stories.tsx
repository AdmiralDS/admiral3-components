import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagDot, type TagNeutralProps } from '@admiral-ds/admiral3-components';

import { TagDotPlaygroundTemplate } from './TagDotPlayground.template';
import tagDotPlaygroundTemplateRaw from './TagDotPlayground.template?raw';
import { TAG_DIMENSIONS, TAG_STATUSES } from '../constants';

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
      options: TAG_STATUSES,
    },
    onClick: { action: 'click', control: false },
  },
} satisfies Meta<typeof TagDot>;

export default meta;

const defaultArgs: TagNeutralProps = {
  dimension: 'm',
  withBorder: false,
};

export const Playground: StoryObj<TagNeutralProps> = {
  args: defaultArgs,
  render: TagDotPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: tagDotPlaygroundTemplateRaw,
      },
    },
  },
};

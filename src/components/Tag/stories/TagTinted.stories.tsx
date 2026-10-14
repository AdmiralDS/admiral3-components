import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagTinted, type TagColoredProps } from '@admiral-ds/admiral3-components';

import { TagTintedPlaygroundTemplate } from './TagTintedPlayground.template';
import tagTintedPlaygroundTemplateRaw from './TagTintedPlayground.template?raw';
import { TAG_DIMENSIONS, TAG_STATUSES } from '../constants';

const meta = {
  title: 'Components/Tags/TagTinted',
  component: TagTinted,
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
    withBorder: { control: 'boolean' },
    iconsBefore: { control: false },
    onClick: { action: 'click', control: false },
  },
} satisfies Meta<typeof TagTinted>;

export default meta;

const defaultArgs: TagColoredProps = {
  dimension: 'm',
  withBorder: false,
};

export const Playground: StoryObj<TagColoredProps> = {
  args: defaultArgs,
  render: TagTintedPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: tagTintedPlaygroundTemplateRaw,
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TagDot, type TagDotProps } from '@admiral-ds/admiral3-components';

import { TagDotCustomStatusTemplate } from './TagDotCustomStatus.template';
import tagDotCustomStatusTemplateRaw from './TagDotCustomStatus.template?raw';
import { TagDotPlaygroundTemplate } from './TagDotPlayground.template';
import tagDotPlaygroundTemplateRaw from './TagDotPlayground.template?raw';
import { TAG_DIMENSIONS, TAG_STATUSES } from '../constants';
import { TagDotSizesTemplate } from './TagDotSizes.template';
import tagDotSizesTemplateRaw from './TagDotSizes.template?raw';
import { TagDotStatusesTemplate } from './TagDotStatuses.template';
import tagDotStatusesTemplateRaw from './TagDotStatuses.template?raw';
import { TagDotWithTooltipTemplate } from './TagDotWithTooltip.template';
import tagDotWithTooltipTemplateRaw from './TagDotWithTooltip.template?raw';

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

const defaultArgs: TagDotProps = {
  dimension: 'm',
  withBorder: false,
};

export const Playground: StoryObj<TagDotProps> = {
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

export const Sizes: StoryObj<TagDotProps> = {
  args: { ...defaultArgs },
  render: TagDotSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: tagDotSizesTemplateRaw } },
  },
};

export const Statuses: StoryObj<TagDotProps> = {
  args: { ...defaultArgs },
  render: TagDotStatusesTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: { source: { code: tagDotStatusesTemplateRaw } },
  },
};

export const CustomStatus: StoryObj<TagDotProps> = {
  args: { ...defaultArgs, onClick: fn() },
  render: TagDotCustomStatusTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: { source: { code: tagDotCustomStatusTemplateRaw } },
  },
};

export const WithTooltip: StoryObj<TagDotProps> = {
  args: { ...defaultArgs, onClick: fn() },
  render: TagDotWithTooltipTemplate,
  parameters: {
    docs: { source: { code: tagDotWithTooltipTemplateRaw } },
  },
};

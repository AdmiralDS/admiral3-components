import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TagTinted, type TagTintedProps } from '@admiral-ds/admiral3-components';

import { TagTintedCustomStatusTemplate } from './TagTintedCustomStatus.template';
import tagTintedCustomStatusTemplateRaw from './TagTintedCustomStatus.template?raw';
import { TagTintedPlaygroundTemplate } from './TagTintedPlayground.template';
import tagTintedPlaygroundTemplateRaw from './TagTintedPlayground.template?raw';
import { TAG_DIMENSIONS, TAG_STATUSES } from '../constants';
import { TagTintedSizesTemplate } from './TagTintedSizes.template';
import tagTintedSizesTemplateRaw from './TagTintedSizes.template?raw';
import { TagTintedStatusesTemplate } from './TagTintedStatuses.template';
import tagTintedStatusesTemplateRaw from './TagTintedStatuses.template?raw';
import { TagTintedWithIconTemplate } from './TagTintedWithIcon.template';
import tagTintedWithIconTemplateRaw from './TagTintedWithIcon.template?raw';
import { TagTintedWithTooltipTemplate } from './TagTintedWithTooltip.template';
import tagTintedWithTooltipTemplateRaw from './TagTintedWithTooltip.template?raw';

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

const defaultArgs: TagTintedProps = {
  dimension: 'm',
  withBorder: false,
};

export const Playground: StoryObj<TagTintedProps> = {
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

export const Sizes: StoryObj<TagTintedProps> = {
  args: { ...defaultArgs },
  render: TagTintedSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: tagTintedSizesTemplateRaw } },
  },
};

export const Statuses: StoryObj<TagTintedProps> = {
  args: { ...defaultArgs },
  render: TagTintedStatusesTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: { source: { code: tagTintedStatusesTemplateRaw } },
  },
};

export const CustomStatus: StoryObj<TagTintedProps> = {
  args: { ...defaultArgs, onClick: fn() },
  render: TagTintedCustomStatusTemplate,
  parameters: {
    controls: { exclude: ['status'] },
    docs: { source: { code: tagTintedCustomStatusTemplateRaw } },
  },
};

export const WithTooltip: StoryObj<TagTintedProps> = {
  args: { ...defaultArgs, status: 'success', onClick: fn() },
  render: TagTintedWithTooltipTemplate,
  parameters: {
    docs: { source: { code: tagTintedWithTooltipTemplateRaw } },
  },
};

export const WithIcon: StoryObj<TagTintedProps> = {
  args: { ...defaultArgs, status: 'success' },
  render: TagTintedWithIconTemplate,
  parameters: {
    controls: { exclude: ['iconsBefore'] },
    docs: { source: { code: tagTintedWithIconTemplateRaw } },
  },
};

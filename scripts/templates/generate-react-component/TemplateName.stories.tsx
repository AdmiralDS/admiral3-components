// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TemplateName, type TemplateNameProps } from '@admiral-ds/admiral3-components';

import { TemplateNamePlaygroundTemplate } from './TemplateNamePlayground.template';
import templateNamePlaygroundTemplateRaw from './TemplateNamePlayground.template?raw';
import { TEMPLATE_NAME_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/TemplateName',
  component: TemplateName,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TEMPLATE_NAME_DIMENSIONS,
    },
  },
} satisfies Meta<typeof TemplateName>;

export default meta;

const defaultArgs: TemplateNameProps = {
  children: 'TemplateName',
  dimension: 'm',
};

export const Playground: StoryObj<TemplateNameProps> = {
  args: defaultArgs,
  render: TemplateNamePlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: templateNamePlaygroundTemplateRaw,
      },
    },
  },
};

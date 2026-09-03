import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, type TooltipProps } from '@admiral-ds/admiral3-components';

import { TooltipPlaygroundTemplate } from './TooltipPlayground.template';
import tooltipPlaygroundTemplateRaw from './TooltipPlayground.template?raw';
import { TOOLTIP_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: TOOLTIP_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

const defaultArgs: TooltipProps = {
  children: 'Tooltip',
  dimension: 'm',
};

export const Playground: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: tooltipPlaygroundTemplateRaw,
      },
    },
  },
};

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
    tooltipPosition: {
      control: { type: 'inline-radio' },
      options: ['bottom', 'top', 'left', 'right'],
    },
    fallbackPositions: {
      control: 'object',
    },
    targetElement: { control: false },
    renderContent: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

const defaultArgs: TooltipProps = {
  dimension: 'm',
  targetElement: null,
  tooltipPosition: 'bottom',
  fallbackPositions: ['top', 'right', 'left'],
  renderContent: () =>
    'Tooltip остаётся открытым при переводе указателя с кнопки на его содержимое. Пользователь может выделить и скопировать этот текст.',
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

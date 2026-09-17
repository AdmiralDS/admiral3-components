import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, type TooltipProps } from '@admiral-ds/admiral3-components';

import { TooltipBaseTemplate } from './TooltipBase.template';
import tooltipBaseTemplateRaw from './TooltipBase.template?raw';
import { TooltipCustomTemplate } from './TooltipCustom.template';
import tooltipCustomTemplateRaw from './TooltipCustom.template?raw';
import { TooltipDelayTemplate } from './TooltipDelay.template';
import tooltipDelayTemplateRaw from './TooltipDelay.template?raw';
import { TooltipPlaygroundTemplate } from './TooltipPlayground.template';
import tooltipPlaygroundTemplateRaw from './TooltipPlayground.template?raw';
import { TooltipRefTemplate } from './TooltipRef.template';
import tooltipRefTemplateRaw from './TooltipRef.template?raw';
import { TOOLTIP_DIMENSIONS, TOOLTIP_POSITIONS } from '../constants';

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
      options: TOOLTIP_POSITIONS,
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

export const Base: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipBaseTemplate,
  parameters: {
    docs: { source: { code: tooltipBaseTemplateRaw } },
  },
  name: 'Базовый пример',
};

export const Delay: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipDelayTemplate,
  parameters: {
    docs: { source: { code: tooltipDelayTemplateRaw } },
  },
  name: 'Пример с задержкой в появлении',
};

export const TooltipRef: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipRefTemplate,
  parameters: {
    docs: { source: { code: tooltipRefTemplateRaw } },
  },
  name: 'Пример с получением ref тултипа',
};

export const CustomContent: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipCustomTemplate,
  parameters: {
    docs: { source: { code: tooltipCustomTemplateRaw } },
  },
  name: 'Пример с кастомным наполнением тултипа',
};

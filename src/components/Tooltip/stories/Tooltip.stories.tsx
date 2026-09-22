import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, type TooltipProps } from '@admiral-ds/admiral3-components';

import { TooltipCustomTemplate } from './TooltipCustom.template';
import tooltipCustomTemplateRaw from './TooltipCustom.template?raw';
import { TooltipDelayTemplate } from './TooltipDelay.template';
import tooltipDelayTemplateRaw from './TooltipDelay.template?raw';
import { TooltipPlaygroundTemplate } from './TooltipPlayground.template';
import tooltipPlaygroundTemplateRaw from './TooltipPlayground.template?raw';
import { TooltipPositionTemplate } from './TooltipPosition.template';
import tooltipPositionTemplateRaw from './TooltipPosition.template?raw';
import { TooltipRefTemplate } from './TooltipRef.template';
import tooltipRefTemplateRaw from './TooltipRef.template?raw';
import { TooltipUseTooltipTemplate } from './TooltipUseTooltip.template';
import tooltipUseTooltipTemplateRaw from './TooltipUseTooltip.template?raw';
import { TOOLTIP_DIMENSIONS, TOOLTIP_POSITIONS } from '../constants';

const componentDescription = `
Tooltip показывает дополнительную информацию при наведении или фокусе на элементе. Он позиционируется относительно
\`targetElement\`, а правила выбора направления можно настроить через \`tooltipPosition\`.

\`Tooltip\` отвечает за отображение и позиционирование, но не ограничивает способ управления видимостью. Для настройки
стандартного поведения можно использовать хук \`useTooltip\`; его возможности и контракт описаны в отдельном примере.

Tooltip существует в размерах S и M. Рекомендуется использовать для небольших подсказок в 1 строку из нескольких слов. 
При больших объемах текста используйте компонент Hint.
`;

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
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
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

const defaultArgs: TooltipProps = {
  dimension: 'm',
  targetElement: null,
  children:
    'Tooltip остаётся открытым при переводе указателя с кнопки на его содержимое. Пользователь может выделить и скопировать этот текст.',
};

export const Playground: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipPlaygroundTemplate,
  parameters: {
    docs: {
      description: {
        story: 'Используйте Controls, чтобы проверить размеры и направления открытия Tooltip.',
      },
      source: {
        code: tooltipPlaygroundTemplateRaw,
      },
    },
  },
};

export const UseTooltip: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipUseTooltipTemplate,
  parameters: {
    docs: {
      source: { code: tooltipUseTooltipTemplateRaw },
    },
  },
  name: 'Использование useTooltip',
};

export const Position: StoryObj<TooltipProps> = {
  args: { ...defaultArgs, tooltipPosition: 'top' },
  render: TooltipPositionTemplate,
  parameters: {
    docs: {
      source: { code: tooltipPositionTemplateRaw },
    },
  },
  name: 'Позиционирование Tooltip',
};

export const Delay: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipDelayTemplate,
  parameters: {
    docs: {
      source: { code: tooltipDelayTemplateRaw },
    },
  },
  name: 'Пример с задержкой в появлении',
};

export const TooltipRef: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipRefTemplate,
  parameters: {
    docs: {
      source: { code: tooltipRefTemplateRaw },
    },
  },
  name: 'Использование ref Tooltip',
};

export const CustomContent: StoryObj<TooltipProps> = {
  args: defaultArgs,
  render: TooltipCustomTemplate,
  parameters: {
    docs: {
      source: { code: tooltipCustomTemplateRaw },
    },
  },
  name: 'Пример с кастомным наполнением тултипа',
};

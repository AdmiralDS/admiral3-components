import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, withTooltip, type WithTooltipProps } from '@admiral-ds/admiral3-components';

import { WithTooltipBaseTemplate } from './WithTooltipBase.template';
import withTooltipBaseTemplateRaw from './WithTooltipBase.template?raw';
import { WithTooltipClassComponentTemplate } from './WithTooltipClassComponent.template';
import withTooltipClassComponentTemplateRaw from './WithTooltipClassComponent.template?raw';
import { WithTooltipFunctionalComponentTemplate } from './WithTooltipFunctionalComponent.template';
import withTooltipFunctionalComponentTemplateRaw from './WithTooltipFunctionalComponent.template?raw';
import { TOOLTIP_DIMENSIONS, TOOLTIP_POSITIONS } from '../constants';

const ButtonWithTooltip = withTooltip(Button);

// Вспомогательный компонент позволяет Storybook показать в Controls пропсы, добавляемые withTooltip.
const WithTooltipStory = (props: WithTooltipProps) => (
  <ButtonWithTooltip {...props}>Кнопка с Tooltip</ButtonWithTooltip>
);

const componentDescription = `
\`withTooltip\` — компонент высшего порядка, который добавляет оборачиваемому компоненту стандартное поведение Tooltip.
Tooltip открывается при наведении указателя или получении фокуса, закрывается при уходе указателя или фокуса и по
нажатию Escape. С помощью \`withDelay\` можно включить рекомендуемую задержку открытия при наведении; при получении
фокуса Tooltip всегда открывается сразу.

Вызов \`withTooltip(Component)\` возвращает новый компонент. Помимо исходных пропсов он принимает настройки для отображения тултипа: \`renderContent\`,
\`withDelay\`, \`tooltipPosition\`, \`tooltipDimension\`, \`tooltipRef\` и \`tooltipStyles\`.

**Важно: оборачиваемый компонент должен принимать \`ref\` и передавать его корневому HTML-элементу.** Этот DOM-элемент
нужен \`withTooltip\`, чтобы подписаться на события наведения и фокуса, связать элементы через \`aria-describedby\` и
вычислить положение Tooltip. Если ref не проброшен, Tooltip не сможет корректно открываться и позиционироваться.
`;

const meta = {
  title: 'Components/Tooltip/withTooltip',
  component: WithTooltipStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
  argTypes: {
    renderContent: { control: false },
    withDelay: { control: { type: 'boolean' } },
    tooltipPosition: { control: { type: 'inline-radio' }, options: TOOLTIP_POSITIONS },
    tooltipDimension: { control: { type: 'inline-radio' }, options: TOOLTIP_DIMENSIONS },
    tooltipRef: { control: false },
    tooltipStyles: { control: false },
  },
} satisfies Meta<typeof WithTooltipStory>;

export default meta;

const defaultArgs: WithTooltipProps = {
  renderContent: () => 'Tooltip',
  withDelay: false,
  tooltipDimension: 'm',
  tooltipPosition: 'bottom',
};

export const Base: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithTooltipBaseTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'Базовый сценарий: withTooltip оборачивает Button, который уже принимает ref и назначает его корневому элементу button.',
      },
      source: { code: withTooltipBaseTemplateRaw },
    },
  },
  name: 'Базовый пример',
};

export const ClassComponent: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithTooltipClassComponentTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'Классовый компонент оборачивается адаптером с forwardRef. Адаптер принимает ref от withTooltip и передаёт его через innerRef на корневую кнопку.',
      },
      source: { code: withTooltipClassComponentTemplateRaw },
    },
  },
  name: 'Классовый компонент',
};

export const FunctionalComponent: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithTooltipFunctionalComponentTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'Функциональный компонент объявлен через forwardRef и явно назначает полученный ref своему корневому HTML-элементу.',
      },
      source: { code: withTooltipFunctionalComponentTemplateRaw },
    },
  },
  name: 'Функциональный компонент',
};

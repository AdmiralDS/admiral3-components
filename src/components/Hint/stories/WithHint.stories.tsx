import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, withHint, type WithHintProps } from '@admiral-ds/admiral3-components';

import { WithHintBaseTemplate } from './WithHintBase.template';
import withHintBaseTemplateRaw from './WithHintBase.template?raw';
import { WithHintClassComponentTemplate } from './WithHintClassComponent.template';
import withHintClassComponentTemplateRaw from './WithHintClassComponent.template?raw';
import { WithHintFunctionalComponentTemplate } from './WithHintFunctionalComponent.template';
import withHintFunctionalComponentTemplateRaw from './WithHintFunctionalComponent.template?raw';
import { HINT_TOOLTIP_POSITIONS } from '../../_internal/FloatingPortal';

const ButtonWithHint = withHint(Button);
const WithHintStory = (props: WithHintProps) => <ButtonWithHint {...props}>Кнопка с Hint</ButtonWithHint>;

const componentDescription = `
\`withHint\` — компонент высшего порядка, добавляющий оборачиваемому компоненту стандартное поведение Hint. По
умолчанию Hint открывается при наведении или фокусе. Режим \`triggerMode="click"\` предназначен для интерактивного
содержимого и добавляет кнопку закрытия. \`withDelay\` включает рекомендуемую задержку только для открытия по наведению.

Помимо исходных пропсов новый компонент принимает \`renderContent\`, \`triggerMode\`, \`withDelay\`,
\`hintTargetElement\`, \`hintPosition\`, \`hintRef\`, \`hintStyles\` и \`closeButtonProps\`.

**Важно: оборачиваемый компонент должен принимать \`ref\` и передавать его корневому HTML-элементу.** Этот элемент
нужен для обработки событий, aria-связей и позиционирования Hint.
`;

const meta = {
  title: 'Components/Hint/withHint',
  component: WithHintStory,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: componentDescription } } },
  argTypes: {
    renderContent: { control: false },
    triggerMode: { control: { type: 'inline-radio' }, options: ['hover', 'click'] },
    withDelay: { control: 'boolean' },
    hintTargetElement: { control: false },
    hintPosition: { control: { type: 'inline-radio' }, options: HINT_TOOLTIP_POSITIONS },
    hintRef: { control: false },
    hintStyles: { control: false },
    closeButtonProps: { control: false },
  },
} satisfies Meta<typeof WithHintStory>;

export default meta;

const defaultArgs: WithHintProps = {
  renderContent: () =>
    'Всплывающая подсказка используется в ситуациях, когда информацию требуется пояснить или раскрыть более подробно.',
  triggerMode: 'hover',
  withDelay: false,
  hintPosition: 'bottom',
  hintStyles: { style: { width: 320 } },
};

export const Base: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithHintBaseTemplate,
  parameters: { docs: { source: { code: withHintBaseTemplateRaw } } },
  name: 'Базовый пример',
};

export const ClassComponent: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithHintClassComponentTemplate,
  parameters: { docs: { source: { code: withHintClassComponentTemplateRaw } } },
  name: 'Классовый компонент',
};

export const FunctionalComponent: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: WithHintFunctionalComponentTemplate,
  parameters: { docs: { source: { code: withHintFunctionalComponentTemplateRaw } } },
  name: 'Функциональный компонент',
};

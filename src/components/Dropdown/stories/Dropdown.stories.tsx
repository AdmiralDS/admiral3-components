import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown, type DropdownProps } from '@admiral-ds/admiral3-components';

import { DropdownAdaptiveTemplate } from './DropdownAdaptive.template';
import dropdownAdaptiveTemplateRaw from './DropdownAdaptive.template?raw';
import { DROPDOWN_ALIGNMENTS } from '../constants';

const componentDescription = `
Dropdown отображает произвольное содержимое относительно \`targetElement\`. Компонент самостоятельно выбирает
позицию сверху или снизу, отдавая приоритет нижней позиции. Горизонтальный режим \`auto\` выбирает между \`start\`
и \`end\` с приоритетом \`start\`, после чего Dropdown сдвигается внутрь viewport при столкновении с его границей.

Dropdown отвечает только за отображение и позиционирование. Управление видимостью и обработка пользовательских
взаимодействий остаются на стороне потребителя.
`;

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  // TODO: Не публиковать Dropdown в Storybook, пока не реализованы управление фокусом,
  // клавиатурная навигация и закрытие при клике за пределами компонента.
  tags: ['!dev', '!test', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: componentDescription } },
  },
  argTypes: {
    targetElement: { control: false },
    children: { control: false },
    align: { control: { type: 'inline-radio' }, options: DROPDOWN_ALIGNMENTS },
    widthMode: { control: 'radio', options: ['content', 'target'] },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

export const AdaptivePosition: StoryObj<DropdownProps> = {
  args: {
    targetElement: null,
    align: 'auto',
    widthMode: 'content',
  },
  render: DropdownAdaptiveTemplate,
  parameters: {
    docs: {
      description: {
        story: 'Интерактивный стенд для проверки выбора стороны, горизонтальной коррекции, resize и scroll.',
      },
      source: { code: dropdownAdaptiveTemplateRaw },
    },
  },
  name: 'Адаптивное позиционирование',
};

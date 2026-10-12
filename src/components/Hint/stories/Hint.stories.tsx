import type { Meta, StoryObj } from '@storybook/react-vite';

import { Hint, type HintProps } from '@admiral-ds/admiral3-components';

import { HintClickTemplate } from './HintClick.template';
import hintClickTemplateRaw from './HintClick.template?raw';
import { HintContentTemplate } from './HintContent.template';
import hintContentTemplateRaw from './HintContent.template?raw';
import { HintHoverTemplate } from './HintHover.template';
import hintHoverTemplateRaw from './HintHover.template?raw';
import { HintInputTargetTemplate } from './HintInputTarget.template';
import hintInputTargetTemplateRaw from './HintInputTarget.template?raw';
import { HintPlaygroundTemplate } from './HintPlayground.template';
import hintPlaygroundTemplateRaw from './HintPlayground.template?raw';
import { HintPositionTemplate } from './HintPosition.template';
import hintPositionTemplateRaw from './HintPosition.template?raw';
import { HintRefTemplate } from './HintRef.template';
import hintRefTemplateRaw from './HintRef.template?raw';
import { HintScrollTemplate } from './HintScroll.template';
import hintScrollTemplateRaw from './HintScroll.template?raw';
import { HintUseHintTemplate } from './HintUseHint.template';
import hintUseHintTemplateRaw from './HintUseHint.template?raw';
import { HINT_TOOLTIP_POSITIONS } from '../../_internal/FloatingPortal';

const componentDescription = `
Всплывающая подсказка используется для ситуаций, когда требуется пояснить или раскрыть информацию более детально.
В отличие от \`Tooltip\`, \`Hint\` подходит для многострочного текста, заголовков и интерактивных элементов.
Вызывается либо по клику, например на иконку Question, либо по ховеру на любом элементе.

В случае, когда \`Hint\` вызывается по клику, у нас есть возможность закрыть его кликом вне \`Hint\`,
либо нажатием на крестик.

В сценарии, когда \`Hint\` вызывается по ховеру, иконки закрытия на компоненте нет и он скрывается,
когда мы уводим курсор с объекта, к которому он привязан, или с самого \`Hint\`.

\`Hint\` позиционируется относительно \`targetElement\`, а правила выбора направления можно настроить через \`hintPosition\`.

\`Hint\` отвечает за отображение и позиционирование, но не ограничивает способ управления видимостью.
Для настройки стандартного поведения можно использовать хук \`useHint\`; его возможности и контракт описаны в отдельном примере.
`;

const meta = {
  title: 'Components/Hint/Hint',
  component: Hint,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: componentDescription } },
  },
  argTypes: {
    hintPosition: { control: { type: 'inline-radio' }, options: HINT_TOOLTIP_POSITIONS },
    targetElement: { control: false },
    children: { control: false },
    showCloseIcon: {
      control: 'boolean',
    },
    closeButtonProps: { control: false },
  },
} satisfies Meta<typeof Hint>;

export default meta;

const defaultArgs: Omit<HintProps, 'targetElement'> = {
  children:
    'Всплывающая подсказка используется в ситуациях, когда информацию требуется пояснить или раскрыть более подробно.',
  hintStyles: { style: { width: 320 } },
};

export const Playground: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: hintPlaygroundTemplateRaw,
      },
    },
  },
};

export const UseHint: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintUseHintTemplate,
  parameters: { docs: { source: { code: hintUseHintTemplateRaw } } },
  name: 'Использование useHint',
};

export const Hover: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintHoverTemplate,
  parameters: { docs: { source: { code: hintHoverTemplateRaw } } },
  name: 'Открытие по ховеру',
};

export const Click: StoryObj<HintProps> = {
  render: HintClickTemplate,
  parameters: {
    docs: {
      source: {
        code: hintClickTemplateRaw,
      },
    },
  },
  name: 'Открытие по клику',
};

export const Position: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintPositionTemplate,
  parameters: {
    controls: { exclude: ['hintPosition'] },
    docs: { source: { code: hintPositionTemplateRaw } },
  },
  name: 'Позиционирование Hint',
};

export const InputTarget: StoryObj<HintProps> = {
  args: {
    ...defaultArgs,
    children: 'Логин должен содержать от 6 до 32 символов.',
  },
  render: HintInputTargetTemplate,
  parameters: {
    docs: {
      source: {
        code: hintInputTargetTemplateRaw,
      },
    },
  },
  name: 'Позиционирование относительно отдельного элемента',
};

export const HintRef: StoryObj<HintProps> = {
  args: defaultArgs,
  render: HintRefTemplate,
  parameters: { docs: { source: { code: hintRefTemplateRaw } } },
  name: 'Использование ref Hint',
};

export const ContentVariants: StoryObj<HintProps> = {
  render: HintContentTemplate,
  parameters: {
    docs: {
      source: {
        code: hintContentTemplateRaw,
      },
    },
  },
  name: 'Варианты контента',
};

export const Scroll: StoryObj<HintProps> = {
  render: HintScrollTemplate,
  parameters: {
    docs: {
      source: {
        code: hintScrollTemplateRaw,
      },
    },
  },
  name: 'Внутренний скролл и максимальная высота',
};

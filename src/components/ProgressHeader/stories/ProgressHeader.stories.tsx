import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressHeader, type ProgressHeaderProps } from '@admiral-ds/admiral3-components';

import { ProgressHeaderAnimationTemplate } from './ProgressHeaderAnimation.template';
import progressHeaderAnimationTemplateRaw from './ProgressHeaderAnimation.template?raw';
import { ProgressHeaderErrorTemplate } from './ProgressHeaderError.template';
import progressHeaderErrorTemplateRaw from './ProgressHeaderError.template?raw';
import { ProgressHeaderPlaygroundTemplate } from './ProgressHeaderPlayground.template';
import progressHeaderPlaygroundTemplateRaw from './ProgressHeaderPlayground.template?raw';
import { ProgressHeaderStatesTemplate } from './ProgressHeaderStates.template';
import progressHeaderStatesTemplateRaw from './ProgressHeaderStates.template?raw';

const meta = {
  title: 'Components/ProgressHeader',
  component: ProgressHeader,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    error: { control: { type: 'boolean' } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ProgressHeader закрепляется у верхней границы viewport. Рекомендуется рендерить его как можно выше в дереве приложения, рядом с корневым layout: так компонент не попадёт в локальный stacking context и не будет размонтирован при смене страницы. Для доступного имени передайте aria-label или aria-labelledby.',
      },
    },
  },
} satisfies Meta<typeof ProgressHeader>;

export default meta;

const defaultArgs: ProgressHeaderProps = {
  value: 35,
  'aria-label': 'Загрузка страницы',
};

export const Playground: StoryObj<ProgressHeaderProps> = {
  args: defaultArgs,
  render: ProgressHeaderPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: progressHeaderPlaygroundTemplateRaw,
      },
    },
  },
};

export const Animation: StoryObj<ProgressHeaderProps> = {
  render: ProgressHeaderAnimationTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressHeaderAnimationTemplateRaw } },
  },
};

export const DeterminateAndIndeterminate: StoryObj<ProgressHeaderProps> = {
  render: ProgressHeaderStatesTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressHeaderStatesTemplateRaw } },
  },
};

export const Error: StoryObj<ProgressHeaderProps> = {
  render: ProgressHeaderErrorTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressHeaderErrorTemplateRaw } },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressPage, type ProgressPageProps } from '@admiral-ds/admiral3-components';

import { ProgressPageAnimationTemplate } from './ProgressPageAnimation.template';
import progressPageAnimationTemplateRaw from './ProgressPageAnimation.template?raw';
import { ProgressPageCustomAppearanceTemplate } from './ProgressPageCustomAppearance.template';
import progressPageCustomAppearanceTemplateRaw from './ProgressPageCustomAppearance.template?raw';
import { ProgressPageDeterminateTemplate } from './ProgressPageDeterminate.template';
import progressPageDeterminateTemplateRaw from './ProgressPageDeterminate.template?raw';
import { ProgressPageErrorTemplate } from './ProgressPageError.template';
import progressPageErrorTemplateRaw from './ProgressPageError.template?raw';
import { ProgressPageIndeterminateTemplate } from './ProgressPageIndeterminate.template';
import progressPageIndeterminateTemplateRaw from './ProgressPageIndeterminate.template?raw';
import { ProgressPageOverlayTemplate } from './ProgressPageOverlay.template';
import progressPageOverlayTemplateRaw from './ProgressPageOverlay.template?raw';
import { ProgressPagePlaygroundTemplate } from './ProgressPagePlayground.template';
import progressPagePlaygroundTemplateRaw from './ProgressPagePlayground.template?raw';

const meta = {
  title: 'Components/ProgressPage',
  component: ProgressPage,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    error: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    valueLabel: { control: { type: 'text' } },
  },
} satisfies Meta<typeof ProgressPage>;

export default meta;

const defaultArgs: ProgressPageProps = {
  value: 35,
  label: 'Загрузка данных...',
  valueLabel: '35%',
};

export const Playground: StoryObj<ProgressPageProps> = {
  args: defaultArgs,
  render: ProgressPagePlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: progressPagePlaygroundTemplateRaw,
      },
    },
  },
};

export const Determinate: StoryObj<ProgressPageProps> = {
  args: defaultArgs,
  render: ProgressPageDeterminateTemplate,
  parameters: {
    docs: { source: { code: progressPageDeterminateTemplateRaw } },
  },
};

export const Indeterminate: StoryObj<ProgressPageProps> = {
  render: ProgressPageIndeterminateTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressPageIndeterminateTemplateRaw } },
  },
};

export const Animation: StoryObj<ProgressPageProps> = {
  render: ProgressPageAnimationTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressPageAnimationTemplateRaw } },
  },
};

export const Error: StoryObj<ProgressPageProps> = {
  render: ProgressPageErrorTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressPageErrorTemplateRaw } },
  },
};

export const CustomAppearance: StoryObj<ProgressPageProps> = {
  render: ProgressPageCustomAppearanceTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressPageCustomAppearanceTemplateRaw } },
  },
};

export const InOverlay: StoryObj<ProgressPageProps> = {
  render: ProgressPageOverlayTemplate,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: progressPageOverlayTemplateRaw } },
  },
};

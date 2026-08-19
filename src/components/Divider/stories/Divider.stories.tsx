import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider, type DividerProps } from '@admiral-ds/admiral3-primitives';

import { DividerPlaygroundTemplate } from './DividerPlayground.template';
import dividerPlaygroundTemplateRaw from './DividerPlayground.template?raw';
import { DividerVariantsTemplate } from './DividerVariants.template';
import dividerVariantsTemplateRaw from './DividerVariants.template?raw';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;

const defaultArgs: DividerProps = {
  dimension: 'm',
  appearance: 'default',
  orientation: 'horizontal',
};

export const Playground: StoryObj<DividerProps> = {
  args: defaultArgs,
  render: DividerPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: dividerPlaygroundTemplateRaw,
      },
    },
  },
};

export const Variants: StoryObj<DividerProps> = {
  args: defaultArgs,
  render: DividerVariantsTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'dimension', 'length', 'orientation'],
    },
    docs: {
      source: {
        code: dividerVariantsTemplateRaw,
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider, type DividerProps } from '@admiral-ds/admiral3-components';

import { DividerPlaygroundTemplate } from './DividerPlayground.template';
import dividerPlaygroundTemplateRaw from './DividerPlayground.template?raw';
import { DividerVariantsTemplate } from './DividerVariants.template';
import dividerVariantsTemplateRaw from './DividerVariants.template?raw';
import { DIVIDER_APPEARANCES, DIVIDER_DIMENSIONS, DIVIDER_ORIENTATIONS } from '../constants';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: DIVIDER_APPEARANCES,
    },
    dimension: {
      control: 'radio',
      options: DIVIDER_DIMENSIONS,
    },
    orientation: {
      control: 'radio',
      options: DIVIDER_ORIENTATIONS,
    },
  },
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

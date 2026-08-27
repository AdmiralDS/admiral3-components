import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider, type DividerProps } from '@admiral-ds/admiral3-components';

import { DividerAccessibilityTemplate } from './DividerAccessibility.template';
import dividerAccessibilityTemplateRaw from './DividerAccessibility.template?raw';
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
    decorative: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;

const defaultArgs: DividerProps = {
  dimension: 'm',
  appearance: 'default',
  orientation: 'horizontal',
  decorative: false,
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
      exclude: ['appearance', 'decorative', 'dimension', 'length', 'orientation'],
    },
    docs: {
      source: {
        code: dividerVariantsTemplateRaw,
      },
    },
  },
};

export const Accessibility: StoryObj<DividerProps> = {
  args: defaultArgs,
  render: DividerAccessibilityTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'decorative', 'dimension', 'length', 'orientation'],
    },
    docs: {
      source: {
        code: dividerAccessibilityTemplateRaw,
      },
    },
  },
};

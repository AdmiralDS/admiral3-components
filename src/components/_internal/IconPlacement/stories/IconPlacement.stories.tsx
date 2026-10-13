import type { Meta, StoryObj } from '@storybook/react-vite';

import { ICON_PLACEMENT_COLOR_MODES, ICON_PLACEMENT_DIMENSIONS } from '../constants';
import { IconPlacement } from '../IconPlacement';
import { IconPlacementClickTemplate } from './IconPlacementClick.template';
import iconPlacementClickTemplateRaw from './IconPlacementClick.template?raw';
import { IconPlacementSizesTemplate } from './IconPlacementSizes.template';
import iconPlacementSizesTemplateRaw from './IconPlacementSizes.template?raw';

const meta = {
  title: 'Internal/IconPlacement',
  component: IconPlacement,
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: ICON_PLACEMENT_DIMENSIONS,
    },
    colorMode: {
      control: { type: 'radio' },
      options: ICON_PLACEMENT_COLOR_MODES,
    },
  },
} satisfies Meta<typeof IconPlacement>;

export default meta;

export const Sizes: StoryObj<typeof meta> = {
  args: {
    colorMode: 'colored',
  },
  render: IconPlacementSizesTemplate,
  parameters: {
    controls: { exclude: ['children', 'dimension'] },
    docs: { source: { code: iconPlacementSizesTemplateRaw } },
  },
};

export const ClickHandling: StoryObj<typeof meta> = {
  args: {
    dimension: 'm',
    colorMode: 'colored',
  },
  render: IconPlacementClickTemplate,
  parameters: {
    controls: { exclude: ['children', 'onClick'] },
    docs: { source: { code: iconPlacementClickTemplateRaw } },
  },
};

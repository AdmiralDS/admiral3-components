import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { BadgeAppearancesTemplate } from './BadgeAppearances.template';
import badgeAppearancesTemplateRaw from './BadgeAppearances.template?raw';
import { BadgeCustomColorsTemplate } from './BadgeCustomColors.template';
import badgeCustomColorsTemplateRaw from './BadgeCustomColors.template?raw';
import { BadgePlaygroundTemplate } from './BadgePlayground.template';
import badgePlaygroundTemplateRaw from './BadgePlayground.template?raw';
import { BadgeSizesTemplate } from './BadgeSizes.template';
import badgeSizesTemplateRaw from './BadgeSizes.template?raw';
import { BADGE_APPEARANCES, BADGE_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: BADGE_APPEARANCES,
    },
    dimension: {
      control: { type: 'inline-radio' },
      options: BADGE_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

const defaultArgs: BadgeProps = {
  appearance: 'neutral1',
  dimension: 'm',
  children: 5,
};

export const Playground: StoryObj<BadgeProps> = {
  args: defaultArgs,
  render: BadgePlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: badgePlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    appearance: 'info',
  },
  render: BadgeSizesTemplate,
  parameters: {
    controls: {
      exclude: ['dimension'],
    },
    docs: {
      source: {
        code: badgeSizesTemplateRaw,
      },
    },
  },
};

export const Appearances: StoryObj<BadgeProps> = {
  args: defaultArgs,
  render: BadgeAppearancesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'dimension'],
    },
    docs: {
      source: {
        code: badgeAppearancesTemplateRaw,
      },
    },
  },
};

export const CustomColors: StoryObj<BadgeProps> = {
  args: {
    ...defaultArgs,
    dimension: 's',
    children: 8,
  },
  render: BadgeCustomColorsTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: badgeCustomColorsTemplateRaw,
      },
    },
  },
};

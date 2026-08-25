import type { Meta, StoryObj } from '@storybook/react-vite';

import { BadgeDot, type BadgeDotProps } from '@admiral-ds/admiral3-components';

import { BadgeDotAppearancesTemplate } from './BadgeDotAppearances.template';
import badgeDotAppearancesTemplateRaw from './BadgeDotAppearances.template?raw';
import { BadgeDotCustomColorsTemplate } from './BadgeDotCustomColors.template';
import badgeDotCustomColorsTemplateRaw from './BadgeDotCustomColors.template?raw';
import { BadgeDotPlaygroundTemplate } from './BadgeDotPlayground.template';
import badgeDotPlaygroundTemplateRaw from './BadgeDotPlayground.template?raw';
import { BadgeDotSizesTemplate } from './BadgeDotSizes.template';
import badgeDotSizesTemplateRaw from './BadgeDotSizes.template?raw';
import { BADGE_DOT_APPEARANCES, BADGE_DOT_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/BadgeDot',
  component: BadgeDot,
  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: BADGE_DOT_APPEARANCES,
    },
    dimension: {
      control: { type: 'inline-radio' },
      options: BADGE_DOT_DIMENSIONS,
    },
  },
} satisfies Meta<typeof BadgeDot>;

export default meta;

const defaultArgs: BadgeDotProps = {
  appearance: 'neutral',
  dimension: 'm',
};

export const Playground: StoryObj<BadgeDotProps> = {
  args: defaultArgs,
  render: BadgeDotPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: badgeDotPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<BadgeDotProps> = {
  args: {
    ...defaultArgs,
    appearance: 'info',
  },
  render: BadgeDotSizesTemplate,
  parameters: {
    controls: {
      exclude: ['dimension'],
    },
    docs: {
      source: {
        code: badgeDotSizesTemplateRaw,
      },
    },
  },
};

export const Appearances: StoryObj<BadgeDotProps> = {
  args: defaultArgs,
  render: BadgeDotAppearancesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'dimension'],
    },
    docs: {
      source: {
        code: badgeDotAppearancesTemplateRaw,
      },
    },
  },
};

export const CustomColors: StoryObj<BadgeDotProps> = {
  args: defaultArgs,
  render: BadgeDotCustomColorsTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: badgeDotCustomColorsTemplateRaw,
      },
    },
  },
};

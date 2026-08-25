import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner, type SpinnerProps } from '@admiral-ds/admiral3-components';

import { SpinnerAppearancesTemplate } from './SpinnerAppearances.template';
import spinnerAppearancesTemplateRaw from './SpinnerAppearances.template?raw';
import { SpinnerCustomColorsTemplate } from './SpinnerCustomColor.template';
import spinnerCustomColorsTemplateRaw from './SpinnerCustomColor.template?raw';
import { SpinnerPlaygroundTemplate } from './SpinnerPlayground.template';
import spinnerPlaygroundTemplateRaw from './SpinnerPlayground.template?raw';
import { SpinnerSizesTemplate } from './SpinnerSizes.template';
import spinnerSizesTemplateRaw from './SpinnerSizes.template?raw';
import { SPINNER_APPEARANCES, SPINNER_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: SPINNER_APPEARANCES,
    },
    dimension: {
      control: { type: 'inline-radio' },
      options: SPINNER_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

const defaultArgs: SpinnerProps = {
  dimension: 'm',
  appearance: 'colored',
};

export const Playground: StoryObj<SpinnerProps> = {
  args: defaultArgs,
  render: SpinnerPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: spinnerPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<SpinnerProps> = {
  args: defaultArgs,
  render: SpinnerSizesTemplate,
  parameters: {
    controls: {
      exclude: ['dimension'],
    },
    docs: {
      source: {
        code: spinnerSizesTemplateRaw,
      },
    },
  },
};

export const Appearances: StoryObj<SpinnerProps> = {
  args: defaultArgs,
  render: SpinnerAppearancesTemplate,
  parameters: {
    controls: {
      exclude: ['appearance', 'dimension'],
    },
    docs: {
      source: {
        code: spinnerAppearancesTemplateRaw,
      },
    },
  },
};

export const CustomColors: StoryObj<SpinnerProps> = {
  args: {
    ...defaultArgs,
    dimension: 'l',
  },
  render: SpinnerCustomColorsTemplate,
  parameters: {
    controls: {
      exclude: ['appearance'],
    },
    docs: {
      source: {
        code: spinnerCustomColorsTemplateRaw,
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { ChipTemplate } from './Chip.template';
import chipTemplateRaw from './Chip.template?raw';
import { ChipAppearancesTemplate } from './ChipAppearances.template';
import chipAppearancesTemplateRaw from './ChipAppearances.template?raw';
import { ChipContentTemplate } from './ChipContent.template';
import chipContentTemplateRaw from './ChipContent.template?raw';
import { ChipSizesTemplate } from './ChipSizes.template';
import chipSizesTemplateRaw from './ChipSizes.template?raw';
import { ChipTooltipTemplate } from './ChipTooltip.template';
import chipTooltipTemplateRaw from './ChipTooltip.template?raw';
import { ChipWithBadgeTemplate } from './ChipWithBadge.template';
import chipWithBadgeTemplateRaw from './ChipWithBadge.template?raw';
import { CHIPS_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Chips/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHIPS_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;

const defaultArgs: ChipBaseProps = {
  children: 'Chip',
  dimension: 'm',
  appearance: 'outlined',
  colorMode: 'colored',
  disabled: false,
  readOnly: false,
  showTooltip: true,
};

export const Playground: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: ChipTemplate,
  parameters: { docs: { source: { code: chipTemplateRaw } } },
};

export const Sizes: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: ChipSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'children'] },
    docs: { source: { code: chipSizesTemplateRaw } },
  },
};

export const Appearances: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: ChipAppearancesTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'colorMode', 'children'] },
    docs: { source: { code: chipAppearancesTemplateRaw } },
  },
};

export const WithBadge: StoryObj<typeof meta> = {
  args: { ...defaultArgs, badge: 5 },
  render: ChipWithBadgeTemplate,
  parameters: { docs: { source: { code: chipWithBadgeTemplateRaw } } },
};

export const Content: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: ChipContentTemplate,
  parameters: {
    controls: { exclude: ['iconsBefore', 'iconsAfter', 'avatar', 'badge'] },
    docs: { source: { code: chipContentTemplateRaw } },
  },
};

export const WithTooltip: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: ChipTooltipTemplate,
  parameters: {
    controls: { exclude: ['children', 'showTooltip', 'renderTooltipContent'] },
    docs: { source: { code: chipTooltipTemplateRaw } },
  },
};

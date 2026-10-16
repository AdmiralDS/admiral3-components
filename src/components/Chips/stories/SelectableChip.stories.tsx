import type { Meta, StoryObj } from '@storybook/react-vite';

import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { SelectableChipTemplate } from './SelectableChip.template';
import selectableChipTemplateRaw from './SelectableChip.template?raw';
import { SelectableChipAppearancesTemplate } from './SelectableChipAppearances.template';
import selectableChipAppearancesTemplateRaw from './SelectableChipAppearances.template?raw';
import { SelectableChipContentTemplate } from './SelectableChipContent.template';
import selectableChipContentTemplateRaw from './SelectableChipContent.template?raw';
import { SelectableChipSizesTemplate } from './SelectableChipSizes.template';
import selectableChipSizesTemplateRaw from './SelectableChipSizes.template?raw';
import { SelectableChipTooltipTemplate } from './SelectableChipTooltip.template';
import selectableChipTooltipTemplateRaw from './SelectableChipTooltip.template?raw';
import { SelectableChipWithBadgeTemplate } from './SelectableChipWithBadge.template';
import selectableChipWithBadgeTemplateRaw from './SelectableChipWithBadge.template?raw';
import { CHIPS_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Chips/SelectableChip',
  component: SelectableChip,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHIPS_DIMENSIONS,
    },
  },
} satisfies Meta<typeof SelectableChip>;

export default meta;

const defaultArgs: SelectableChipProps = {
  dimension: 'm',
};

export const Playground: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipTemplate,
  parameters: { docs: { source: { code: selectableChipTemplateRaw } } },
};

export const Sizes: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'children'] },
    docs: { source: { code: selectableChipSizesTemplateRaw } },
  },
};

export const Appearances: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipAppearancesTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'colorMode', 'children'] },
    docs: { source: { code: selectableChipAppearancesTemplateRaw } },
  },
};

export const WithBadge: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipWithBadgeTemplate,
  parameters: { docs: { source: { code: selectableChipWithBadgeTemplateRaw } } },
};

export const Content: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipContentTemplate,
  parameters: {
    controls: { exclude: ['children', 'iconsBefore', 'avatar', 'badge'] },
    docs: { source: { code: selectableChipContentTemplateRaw } },
  },
};

export const WithTooltip: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: SelectableChipTooltipTemplate,
  parameters: {
    controls: { exclude: ['children', 'disabledTooltip', 'renderContentTooltip'] },
    docs: { source: { code: selectableChipTooltipTemplateRaw } },
  },
};

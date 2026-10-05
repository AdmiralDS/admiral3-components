import type { Meta, StoryObj } from '@storybook/react-vite';

import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { RemovableChipTemplate } from './RemovableChip.template';
import removableChipTemplateRaw from './RemovableChip.template?raw';
import { RemovableChipAppearancesTemplate } from './RemovableChipAppearances.template';
import removableChipAppearancesTemplateRaw from './RemovableChipAppearances.template?raw';
import { RemovableChipContentTemplate } from './RemovableChipContent.template';
import removableChipContentTemplateRaw from './RemovableChipContent.template?raw';
import { RemovableChipSizesTemplate } from './RemovableChipSizes.template';
import removableChipSizesTemplateRaw from './RemovableChipSizes.template?raw';
import { RemovableChipTooltipTemplate } from './RemovableChipTooltip.template';
import removableChipTooltipTemplateRaw from './RemovableChipTooltip.template?raw';
import { RemovableChipWithBadgeTemplate } from './RemovableChipWithBadge.template';
import removableChipWithBadgeTemplateRaw from './RemovableChipWithBadge.template?raw';
import { CHIPS_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Chips/RemovableChip',
  component: RemovableChip,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHIPS_DIMENSIONS,
    },
  },
} satisfies Meta<typeof RemovableChip>;

export default meta;

const defaultArgs: RemovableChipProps = {
  children: 'Chip',
  dimension: 'm',
  onClose: () => undefined,
  closeButtonProps: { 'aria-label': 'Удалить чипс' },
};

export const Playground: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: (args) => <RemovableChipTemplate {...args} />,
  parameters: {
    docs: { source: { code: removableChipTemplateRaw } },
  },
};

export const Sizes: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: RemovableChipSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'children'] },
    docs: { source: { code: removableChipSizesTemplateRaw } },
  },
};

export const Appearances: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: RemovableChipAppearancesTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'colorMode', 'children'] },
    docs: { source: { code: removableChipAppearancesTemplateRaw } },
  },
};

export const WithBadge: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: RemovableChipWithBadgeTemplate,
  parameters: { docs: { source: { code: removableChipWithBadgeTemplateRaw } } },
};

export const Content: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: RemovableChipContentTemplate,
  parameters: {
    controls: { exclude: ['children', 'iconsBefore', 'avatar', 'badge'] },
    docs: { source: { code: removableChipContentTemplateRaw } },
  },
};

export const WithTooltip: StoryObj<typeof meta> = {
  args: defaultArgs,
  render: RemovableChipTooltipTemplate,
  parameters: {
    controls: { exclude: ['children', 'disabledTooltip', 'renderContentTooltip'] },
    docs: { source: { code: removableChipTooltipTemplateRaw } },
  },
};

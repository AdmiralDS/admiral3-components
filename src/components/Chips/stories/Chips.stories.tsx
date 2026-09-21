import type { Meta, StoryObj } from '@storybook/react-vite';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { ChipsAppearancesTemplate } from './ChipsAppearances.template';
import chipsAppearancesTemplateRaw from './ChipsAppearances.template?raw';
import { ChipsContentTemplate } from './ChipsContent.template';
import chipsContentTemplateRaw from './ChipsContent.template?raw';
import { ChipsPlaygroundTemplate } from './ChipsPlayground.template';
import chipsPlaygroundTemplateRaw from './ChipsPlayground.template?raw';
import { ChipsRemovableTemplate } from './ChipsRemovable.template';
import chipsRemovableTemplateRaw from './ChipsRemovable.template?raw';
import { ChipsSelectionTemplate } from './ChipsSelection.template';
import chipsSelectionTemplateRaw from './ChipsSelection.template?raw';
import { ChipsSizesTemplate } from './ChipsSizes.template';
import chipsSizesTemplateRaw from './ChipsSizes.template?raw';
import { ChipsTooltipTemplate } from './ChipsTooltip.template';
import chipsTooltipTemplateRaw from './ChipsTooltip.template?raw';
import { ChipsWithBadgeTemplate } from './ChipsWithBadge.template';
import chipsWithBadgeTemplateRaw from './ChipsWithBadge.template?raw';
import { CHIPS_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Chips/Chips',
  component: Chips,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHIPS_DIMENSIONS,
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;

const defaultArgs: ChipsProps = {
  children: 'Chip',
  dimension: 'm',
};

export const Playground: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsPlaygroundTemplate,
  parameters: {
    docs: {
      source: {
        code: chipsPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsSizesTemplate,
  parameters: {
    controls: { exclude: ['dimension', 'children'] },
    docs: { source: { code: chipsSizesTemplateRaw } },
  },
};

export const Appearances: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsAppearancesTemplate,
  parameters: {
    controls: { exclude: ['appearance', 'colorMode', 'children'] },
    docs: { source: { code: chipsAppearancesTemplateRaw } },
  },
};

export const WithBadge: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsWithBadgeTemplate,
  parameters: {
    docs: { source: { code: chipsWithBadgeTemplateRaw } },
  },
};

export const Content: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsContentTemplate,
  parameters: {
    controls: { exclude: ['children', 'iconsBefore', 'badge'] },
    docs: { source: { code: chipsContentTemplateRaw } },
  },
};

export const Selection: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsSelectionTemplate,
  parameters: {
    controls: { exclude: ['children', 'selected', 'onClick', 'onClose'] },
    docs: { source: { code: chipsSelectionTemplateRaw } },
  },
};

export const Removable: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsRemovableTemplate,
  parameters: {
    controls: { exclude: ['children', 'onClose'] },
    docs: { source: { code: chipsRemovableTemplateRaw } },
  },
};

export const Tooltip: StoryObj<ChipsProps> = {
  args: defaultArgs,
  render: ChipsTooltipTemplate,
  parameters: {
    controls: { exclude: ['children', 'disabledTooltip', 'renderContentTooltip'] },
    docs: { source: { code: chipsTooltipTemplateRaw } },
  },
};

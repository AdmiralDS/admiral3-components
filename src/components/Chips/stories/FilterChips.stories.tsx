import type { Meta, StoryObj } from '@storybook/react-vite';

import { FilterChips, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { FilterChipsTemplate } from './FilterChips.template';
import filterChipsTemplateRaw from './FilterChips.template?raw';
import { FilterChipsAppearancesTemplate } from './FilterChipsAppearances.template';
import filterChipsAppearancesTemplateRaw from './FilterChipsAppearances.template?raw';
import { FilterChipsControlledUncontrolledTemplate } from './FilterChipsControlledUncontrolled.template';
import filterChipsControlledUncontrolledTemplateRaw from './FilterChipsControlledUncontrolled.template?raw';
import { FilterChipsRadioTemplate } from './FilterChipsRadio.template';
import filterChipsRadioTemplateRaw from './FilterChipsRadio.template?raw';
import { FilterChipsValueTemplate } from './FilterChipsValue.template';
import filterChipsValueTemplateRaw from './FilterChipsValue.template?raw';
import { FilterChipsWithChipsTemplate } from './FilterChipsWithChips.template';
import filterChipsWithChipsTemplateRaw from './FilterChipsWithChips.template?raw';
import { CHIPS_DIMENSIONS } from '../constants';

const meta = {
  title: 'Components/Chips/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  argTypes: {
    dimension: {
      control: { type: 'inline-radio' },
      options: CHIPS_DIMENSIONS,
    },
  },
} satisfies Meta<typeof FilterChips>;

export default meta;

export const Playground: StoryObj<FilterChipsProps> = {
  args: { value: [], dimension: 'm', exclusive: false },
  render: (args: FilterChipsProps) => <FilterChipsTemplate dimension={args.dimension} exclusive={args.exclusive} />,
  parameters: {
    controls: { exclude: ['value', 'onChange', 'children'] },
    docs: { source: { code: filterChipsTemplateRaw } },
  },
};

export const RadioMode: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsRadioTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['value', 'defaultValue', 'exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsRadioTemplateRaw } },
  },
};

export const Appearances: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsAppearancesTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['value', 'defaultValue', 'exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsAppearancesTemplateRaw } },
  },
};

export const ControlledUncontrolled: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsControlledUncontrolledTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['value', 'defaultValue', 'exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsControlledUncontrolledTemplateRaw } },
  },
  name: 'Controlled и uncontrolled',
};

export const WithAndWithoutId: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsValueTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['value', 'exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsValueTemplateRaw } },
  },
};

export const WithRegularChips: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsWithChipsTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['value', 'exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsWithChipsTemplateRaw } },
  },
};

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
import { FilterChipsWithSelectableChipTemplate } from './FilterChipsWithSelectableChip.template';
import filterChipsWithSelectableChipTemplateRaw from './FilterChipsWithSelectableChip.template?raw';
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
    value: {
      control: false,
      description:
        'Управляемый выбор. При exclusive=true — value выбранного FilterChips.Item или null; при exclusive=false — массив value выбранных FilterChips.Item. Обновляется пользователем через onChange. Если не передан, группа хранит выбор самостоятельно.',
    },
    defaultValue: {
      control: false,
      description:
        'Начальный выбор в неконтролируемом режиме, когда value не передан. При exclusive=true — value выбранного FilterChips.Item или null; при exclusive=false — массив value выбранных FilterChips.Item.',
    },
  },
} satisfies Meta<typeof FilterChips>;

export default meta;

export const Playground: StoryObj<FilterChipsProps> = {
  args: { value: [], dimension: 'm', exclusive: false },
  render: (args: FilterChipsProps) => (
    <FilterChipsTemplate
      dimension={args.dimension}
      exclusive={args.exclusive}
      disabled={args.disabled}
      gap={args.gap}
    />
  ),
  parameters: {
    controls: { exclude: ['onChange', 'children'] },
    docs: { source: { code: filterChipsTemplateRaw } },
  },
};

export const RadioMode: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsRadioTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsRadioTemplateRaw } },
  },
};

export const Appearances: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsAppearancesTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsAppearancesTemplateRaw } },
  },
};

export const ControlledUncontrolled: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsControlledUncontrolledTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsControlledUncontrolledTemplateRaw } },
  },
  name: 'Controlled и uncontrolled',
};

export const WithSelectableChip: StoryObj<FilterChipsProps> = {
  args: { dimension: 'm' },
  render: (args: FilterChipsProps) => <FilterChipsWithSelectableChipTemplate dimension={args.dimension} />,
  parameters: {
    controls: { exclude: ['exclusive', 'onChange', 'children'] },
    docs: { source: { code: filterChipsWithSelectableChipTemplateRaw } },
  },
};

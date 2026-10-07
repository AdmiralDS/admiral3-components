import type { PlaygroundScenario } from './index';
import { CHIPS_DIMENSIONS } from '../../src/components/Chips/constants';
import { RemovableChipTemplate } from '../../src/components/Chips/stories/RemovableChip.template';
import { RemovableChipAppearancesTemplate } from '../../src/components/Chips/stories/RemovableChipAppearances.template';
import { RemovableChipSizesTemplate } from '../../src/components/Chips/stories/RemovableChipSizes.template';
import { RemovableChipTooltipTemplate } from '../../src/components/Chips/stories/RemovableChipTooltip.template';
import { SelectableChipTemplate } from '../../src/components/Chips/stories/SelectableChip.template';
import { SelectableChipAppearancesTemplate } from '../../src/components/Chips/stories/SelectableChipAppearances.template';
import { SelectableChipContentTemplate } from '../../src/components/Chips/stories/SelectableChipContent.template';
import { SelectableChipSizesTemplate } from '../../src/components/Chips/stories/SelectableChipSizes.template';
import { SelectableChipTooltipTemplate } from '../../src/components/Chips/stories/SelectableChipTooltip.template';

const onClose = () => undefined;
const closeButtonProps = { 'aria-label': 'Удалить чипс' };

export const chipsScenarios: PlaygroundScenario[] = [
  ...[
    { id: 'default', props: {} },
    { id: 'disabled', props: { disabled: true } },
    { id: 'readonly', props: { readOnly: true } },
  ].map(({ id, props }) => ({
    id: `selectable-chip/${id}`,
    title: `SelectableChip ${id}`,
    render: () => <SelectableChipTemplate {...props} appearance="flat" data-testid="selectable-chip" />,
  })),
  {
    id: 'selectable-chip/appearances',
    title: 'SelectableChip Appearances',
    render: () => <SelectableChipAppearancesTemplate data-testid="selectable-chip" />,
  },
  {
    id: 'selectable-chip/content',
    title: 'SelectableChip Content',
    render: () => (
      <>
        {CHIPS_DIMENSIONS.map((dimension) => (
          <SelectableChipContentTemplate key={dimension} dimension={dimension} data-testid="selectable-chip-content" />
        ))}
      </>
    ),
  },
  {
    id: 'selectable-chip/sizes',
    title: 'SelectableChip Sizes',
    render: () => <SelectableChipSizesTemplate data-testid="selectable-chip" />,
  },
  {
    id: 'selectable-chip/tooltip',
    title: 'SelectableChip Tooltip',
    render: () => <SelectableChipTooltipTemplate />,
  },
  ...[
    { id: 'default', props: {} },
    { id: 'disabled', props: { disabled: true } },
    { id: 'readonly', props: { readOnly: true } },
  ].map(({ id, props }) => ({
    id: `removable-chip/${id}`,
    title: `RemovableChip ${id}`,
    render: () => (
      <RemovableChipTemplate
        {...props}
        onClose={onClose}
        closeButtonProps={closeButtonProps}
        appearance="flat"
        data-testid="removable-chip"
      />
    ),
  })),
  {
    id: 'removable-chip/appearances',
    title: 'RemovableChip Appearances',
    render: () => (
      <RemovableChipAppearancesTemplate
        onClose={onClose}
        closeButtonProps={closeButtonProps}
        data-testid="removable-chip"
      />
    ),
  },
  {
    id: 'removable-chip/sizes',
    title: 'RemovableChip Sizes',
    render: () => (
      <RemovableChipSizesTemplate onClose={onClose} closeButtonProps={closeButtonProps} data-testid="removable-chip" />
    ),
  },
  {
    id: 'removable-chip/tooltip',
    title: 'RemovableChip Tooltip',
    render: () => <RemovableChipTooltipTemplate onClose={onClose} closeButtonProps={closeButtonProps} />,
  },
];

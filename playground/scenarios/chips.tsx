import type { PlaygroundScenario } from './index';
import type { ChipsProps } from '../../src/components/Chips';
import { ChipsAppearancesTemplate } from '../../src/components/Chips/stories/ChipsAppearances.template';
import { ChipsFilterTemplate } from '../../src/components/Chips/stories/ChipsFilter.template';
import { ChipsPlaygroundTemplate } from '../../src/components/Chips/stories/ChipsPlayground.template';
import { ChipsRemovableTemplate } from '../../src/components/Chips/stories/ChipsRemovable.template';
import { ChipsSelectionTemplate } from '../../src/components/Chips/stories/ChipsSelection.template';
import { ChipsSizesTemplate } from '../../src/components/Chips/stories/ChipsSizes.template';

const defaultArgs: ChipsProps = {
  children: 'Chips',
};

export const chipsScenarios: PlaygroundScenario[] = [
  {
    id: 'chips/appearances',
    title: 'Chips Appearances',
    render: () => <ChipsAppearancesTemplate data-testid="chips" />,
  },
  {
    id: 'chips/default',
    title: 'Chips Default',
    render: () => <ChipsPlaygroundTemplate {...defaultArgs} data-testid="chips" />,
  },
  ...[
    { id: 'filter', props: {} },
    { id: 'filter-disabled', props: { disabled: true } },
    { id: 'filter-readonly', props: { readOnly: true } },
  ].map(({ id, props }) => ({
    id: `chips/${id}`,
    title: `Chips ${id}`,
    render: () => <ChipsFilterTemplate {...props} appearance="flat" colorMode="colored" data-testid="chips" />,
  })),
  {
    id: 'chips/removable',
    title: 'Chips Removable',
    render: () => (
      <ChipsRemovableTemplate appearance="flat" colorMode="colored" data-testid="chips" onClick={() => undefined} />
    ),
  },
  {
    id: 'chips/selection',
    title: 'Chips Selection',
    render: () => <ChipsSelectionTemplate data-testid="chips" />,
  },
  {
    id: 'chips/sizes',
    title: 'Chips Sizes',
    render: () => <ChipsSizesTemplate data-testid="chips" />,
  },
];

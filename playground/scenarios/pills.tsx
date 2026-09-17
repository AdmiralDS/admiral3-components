import type { PillProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { PillsCustomColorsTemplate } from '../../src/components/Pills/stories/PillsCustomColors.template';
import { PillsDirtyTemplate } from '../../src/components/Pills/stories/PillsDirty.template';
import { PillsDropdownTemplate } from '../../src/components/Pills/stories/PillsDropdown.template';
import { PillsKeyboardNavigationTemplate } from '../../src/components/Pills/stories/PillsKeyboardNavigation.template';
import { PillsNestedTemplate } from '../../src/components/Pills/stories/PillsNested.template';
import { PillsPlaygroundTemplate } from '../../src/components/Pills/stories/PillsPlayground.template';
import { PillsTruncatedTextTemplate } from '../../src/components/Pills/stories/PillsTruncatedText.template';

const defaultArgs: PillProps = {
  children: 'Pills',
  appearance: 'neutral1',
};

export const pillsScenarios: PlaygroundScenario[] = [
  {
    id: 'pills/default',
    title: 'Pills Default',
    render: () => <PillsPlaygroundTemplate {...defaultArgs} data-testid="pills" />,
  },
  {
    id: 'pills/info',
    title: 'Pills Info',
    render: () => <PillsPlaygroundTemplate {...defaultArgs} appearance="info1" data-testid="pills" />,
  },
  {
    id: 'pills/custom-colors',
    title: 'Pills Custom Colors',
    render: () => <PillsCustomColorsTemplate {...defaultArgs} data-testid="pills" />,
  },
  {
    id: 'pills/truncated',
    title: 'Pills Truncated',
    render: () => (
      <PillsTruncatedTextTemplate {...defaultArgs} appearance="success1">
        Я три дня гналась за вами, чтобы сказать, как вы мне безразличны
      </PillsTruncatedTextTemplate>
    ),
  },
  {
    id: 'pills/nested',
    title: 'Pills Nested',
    render: () => <PillsNestedTemplate />,
  },
  {
    id: 'pills/dirty',
    title: 'Pills Dirty',
    render: () => <PillsDirtyTemplate {...defaultArgs} />,
  },
  {
    id: 'pills/dropdown',
    title: 'Pills Dropdown',
    render: () => <PillsDropdownTemplate />,
  },
  {
    id: 'pills/keyboard-navigation',
    title: 'Pills Keyboard Navigation',
    render: () => <PillsKeyboardNavigationTemplate />,
  },
];

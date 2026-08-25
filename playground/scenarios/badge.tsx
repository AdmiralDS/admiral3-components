import type { BadgeProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { BadgeCustomColorsTemplate } from '../../src/components/Badge/stories/BadgeCustomColors.template';
import { BadgeDirtyTemplate } from '../../src/components/Badge/stories/BadgeDirty.template';
import { BadgePlaygroundTemplate } from '../../src/components/Badge/stories/BadgePlayground.template';

const defaultArgs: BadgeProps = {
  appearance: 'neutral1',
  dimension: 'm',
  children: 5,
};

export const badgeScenarios: PlaygroundScenario[] = [
  {
    id: 'badge/default',
    title: 'Badge Default',
    render: () => <BadgePlaygroundTemplate {...defaultArgs} data-testid="badge" />,
  },
  {
    id: 'badge/info',
    title: 'Badge Info',
    render: () => (
      <BadgePlaygroundTemplate {...defaultArgs} appearance="info" data-testid="badge" dimension="s">
        159
      </BadgePlaygroundTemplate>
    ),
  },
  {
    id: 'badge/custom-colors',
    title: 'Badge Custom Colors',
    render: () => (
      <BadgeCustomColorsTemplate {...defaultArgs} data-testid="badge">
        8
      </BadgeCustomColorsTemplate>
    ),
  },
  {
    id: 'badge/dirty',
    title: 'Badge Dirty',
    render: () => <BadgeDirtyTemplate {...defaultArgs} />,
  },
];

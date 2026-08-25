import type { BadgeDotProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { BadgeDotCustomColorsTemplate } from '../../src/components/BadgeDot/stories/BadgeDotCustomColors.template';
import { BadgeDotDirtyTemplate } from '../../src/components/BadgeDot/stories/BadgeDotDirty.template';
import { BadgeDotPlaygroundTemplate } from '../../src/components/BadgeDot/stories/BadgeDotPlayground.template';

const defaultArgs: BadgeDotProps = {
  appearance: 'neutral',
  dimension: 'm',
};

export const badgeDotScenarios: PlaygroundScenario[] = [
  {
    id: 'badge-dot/default',
    title: 'BadgeDot Default',
    render: () => <BadgeDotPlaygroundTemplate {...defaultArgs} data-testid="badge-dot" />,
  },
  {
    id: 'badge-dot/info',
    title: 'BadgeDot Info',
    render: () => (
      <BadgeDotPlaygroundTemplate {...defaultArgs} appearance="info" data-testid="badge-dot" dimension="xxl" />
    ),
  },
  {
    id: 'badge-dot/custom-colors',
    title: 'BadgeDot Custom Colors',
    render: () => <BadgeDotCustomColorsTemplate {...defaultArgs} data-testid="badge-dot" dimension="xxl" />,
  },
  {
    id: 'badge-dot/dirty',
    title: 'BadgeDot Dirty',
    render: () => <BadgeDotDirtyTemplate {...defaultArgs} />,
  },
];

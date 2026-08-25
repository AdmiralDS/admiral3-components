import type { PulseProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { PulsePlaygroundTemplate } from '../../src/components/Pulse/stories/PulsePlayground.template';

const defaultArgs: PulseProps = {
  dimension: 'l',
  status: 'info',
};

export const pulseScenarios: PlaygroundScenario[] = [
  {
    id: 'pulse/default',
    title: 'Pulse Default',
    render: () => <PulsePlaygroundTemplate {...defaultArgs} data-testid="pulse" />,
  },
];

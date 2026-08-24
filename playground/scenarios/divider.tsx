import type { PlaygroundScenario } from './index';
import { DividerPlaygroundTemplate } from '../../src/components/Divider/stories/DividerPlayground.template';

export const dividerScenarios: PlaygroundScenario[] = [
  {
    id: 'divider/default',
    title: 'Divider Default',
    render: () => <DividerPlaygroundTemplate data-testid="divider" />,
  },
];

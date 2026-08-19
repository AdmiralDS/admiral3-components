import type { PlaygroundScenario } from './index';
import type { DividerProps } from '../../src/components/Divider';
import { DividerPlaygroundTemplate } from '../../src/components/Divider/stories/DividerPlayground.template';

const defaultArgs: DividerProps = {
  children: 'Divider',
};

export const dividerScenarios: PlaygroundScenario[] = [
  {
    id: 'divider/default',
    title: 'Divider Default',
    render: () => <DividerPlaygroundTemplate {...defaultArgs} data-testid="divider" />,
  },
];

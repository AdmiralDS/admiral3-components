import type { PlaygroundScenario } from './index';
import type { HintProps } from '../../src/components/Hint';
import { HintPlaygroundTemplate } from '../../src/components/Hint/stories/HintPlayground.template';

const defaultArgs: HintProps = {
  children: 'Hint',
};

export const hintScenarios: PlaygroundScenario[] = [
  {
    id: 'hint/default',
    title: 'Hint Default',
    render: () => <HintPlaygroundTemplate {...defaultArgs} data-testid="hint" />,
  },
];

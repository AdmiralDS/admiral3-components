import type { PlaygroundScenario } from './index';
import type { HintProps } from '../../src/components/Hint';
import { HintClickTemplate } from '../../src/components/Hint/stories/HintClick.template';
import { HintPlaygroundTemplate } from '../../src/components/Hint/stories/HintPlayground.template';

const defaultArgs: Omit<HintProps, 'targetElement'> = {
  children: 'Hint',
};

export const hintScenarios: PlaygroundScenario[] = [
  {
    id: 'hint/default',
    title: 'Hint Default',
    render: () => <HintPlaygroundTemplate {...defaultArgs} data-testid="hint" />,
  },
  {
    id: 'hint/click',
    title: 'Hint Click',
    render: () => <HintClickTemplate />,
  },
];

import type { PlaygroundScenario } from './index';
import type { ToggleProps } from '../../src/components/Toggle';
import { TogglePlaygroundTemplate } from '../../src/components/Toggle/stories/TogglePlayground.template';
import { ToggleStatesTemplate } from '../../src/components/Toggle/stories/ToggleStates.template';

const defaultArgs: ToggleProps = {
  children: 'Toggle text',
};

export const toggleScenarios: PlaygroundScenario[] = [
  {
    id: 'toggle/default',
    title: 'Toggle Default',
    render: () => <TogglePlaygroundTemplate {...defaultArgs} data-testid="toggle" />,
  },
  {
    id: 'toggle/states',
    title: 'Toggle States',
    render: () => <ToggleStatesTemplate />,
  },
];

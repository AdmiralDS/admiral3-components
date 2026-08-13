import type { PlaygroundScenario } from './index';
import type { ToggleProps } from '../../src/components/Toggle';
import { TogglePlaygroundTemplate } from '../../src/components/Toggle/stories/TogglePlayground.template';

const defaultArgs: ToggleProps = {
  children: 'Toggle text',
};

export const toggleScenarios: PlaygroundScenario[] = [
  {
    id: 'toggle/default',
    title: 'Toggle Default',
    render: () => <TogglePlaygroundTemplate {...defaultArgs} data-testid="toggle" />,
  },
];

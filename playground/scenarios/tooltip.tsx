import type { PlaygroundScenario } from './index';
import type { TooltipProps } from '../../src/components/Tooltip';
import { TooltipPlaygroundTemplate } from '../../src/components/Tooltip/stories/TooltipPlayground.template';

const defaultArgs: TooltipProps = {
  children: 'Tooltip',
};

export const tooltipScenarios: PlaygroundScenario[] = [
  {
    id: 'tooltip/default',
    title: 'Tooltip Default',
    render: () => <TooltipPlaygroundTemplate {...defaultArgs} data-testid="tooltip" />,
  },
];

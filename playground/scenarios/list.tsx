import type { PlaygroundScenario } from './index';
import type { ListProps } from '../../src/components/List';
import { ListPlaygroundTemplate } from '../../src/components/List/stories/ListPlayground.template';

const defaultArgs: ListProps = {
  children: 'List',
};

export const listScenarios: PlaygroundScenario[] = [
  {
    id: 'list/default',
    title: 'List Default',
    render: () => <ListPlaygroundTemplate {...defaultArgs} data-testid="list" />,
  },
];

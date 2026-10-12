import type { PlaygroundScenario } from './index';
import type { TagProps } from '../../src/components/Tag';
import { TagPlaygroundTemplate } from '../../src/components/Tag/stories/TagPlayground.template';

const defaultArgs: TagProps = {
  children: 'Tag',
};

export const tagScenarios: PlaygroundScenario[] = [
  {
    id: 'tag/default',
    title: 'Tag Default',
    render: () => <TagPlaygroundTemplate {...defaultArgs} data-testid="tag" />,
  },
];

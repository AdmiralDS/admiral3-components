import type { SkeletonProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { SkeletonPlaygroundTemplate } from '../../src/components/Skeleton/stories/SkeletonPlayground.template';

const defaultArgs: SkeletonProps = {
  width: 200,
  height: 40,
  borderRadius: 4,
};

export const skeletonScenarios: PlaygroundScenario[] = [
  {
    id: 'skeleton/default',
    title: 'Skeleton Default',
    render: () => <SkeletonPlaygroundTemplate {...defaultArgs} data-testid="skeleton" />,
  },
];

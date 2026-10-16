import type { PlaygroundScenario } from './index';
import { TagDotCustomStatusTemplate } from '../../src/components/Tag/stories/TagDotCustomStatus.template';
import { TagDotPlaygroundTemplate } from '../../src/components/Tag/stories/TagDotPlayground.template';
import { TagDotStatusesTemplate } from '../../src/components/Tag/stories/TagDotStatuses.template';
import {
  TagDotInteractionTemplate,
  TagTintedInteractionTemplate,
} from '../../src/components/Tag/stories/TagInteraction.template';
import { TagTintedCustomStatusTemplate } from '../../src/components/Tag/stories/TagTintedCustomStatus.template';
import { TagTintedPlaygroundTemplate } from '../../src/components/Tag/stories/TagTintedPlayground.template';
import { TagTintedStatusesTemplate } from '../../src/components/Tag/stories/TagTintedStatuses.template';

export const tagScenarios: PlaygroundScenario[] = [
  {
    id: 'tag-dot/default',
    title: 'TagDot Default',
    render: () => <TagDotPlaygroundTemplate status="success" data-testid="tag-dot" />,
  },
  {
    id: 'tag-dot/statuses',
    title: 'TagDot Statuses',
    render: () => <TagDotStatusesTemplate withBorder />,
  },
  {
    id: 'tag-dot/custom-status',
    title: 'TagDot Custom Status',
    render: () => <TagDotCustomStatusTemplate data-testid="tag-dot" />,
  },
  {
    id: 'tag-dot/interaction',
    title: 'TagDot Interaction',
    render: () => <TagDotInteractionTemplate />,
  },
  {
    id: 'tag-tinted/default',
    title: 'TagTinted Default',
    render: () => <TagTintedPlaygroundTemplate status="success" data-testid="tag-tinted" />,
  },
  {
    id: 'tag-tinted/statuses',
    title: 'TagTinted Statuses',
    render: () => <TagTintedStatusesTemplate withBorder />,
  },
  {
    id: 'tag-tinted/custom-status',
    title: 'TagTinted Custom Status',
    render: () => <TagTintedCustomStatusTemplate data-testid="tag-tinted" />,
  },
  {
    id: 'tag-tinted/interaction',
    title: 'TagTinted Interaction',
    render: () => <TagTintedInteractionTemplate />,
  },
];

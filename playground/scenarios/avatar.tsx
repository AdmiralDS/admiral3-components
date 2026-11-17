import type { PlaygroundScenario } from './index';
import type { AvatarProps } from '../../src/components/Avatar';
import { ActivityAvatarTemplate } from '../../src/components/Avatar/stories/ActivityAvatarPlayground.template';
import {
  AvatarInteractionTemplate,
  ActivityAvatarInteractionTemplate,
} from '../../src/components/Avatar/stories/AvatarInteraction.template';
import { AvatarPlaygroundTemplate } from '../../src/components/Avatar/stories/AvatarPlayground.template';
import avatarImage from '../assets/avatar.svg';

const defaultArgs = {
  userName: 'Иван Иванов',
} satisfies AvatarProps;

export const avatarScenarios: PlaygroundScenario[] = [
  {
    id: 'avatar/default',
    title: 'Avatar Default',
    render: () => <AvatarPlaygroundTemplate {...defaultArgs} data-testid="avatar" />,
  },
  {
    id: 'avatar/interaction',
    title: 'Avatar Interaction',
    render: () => <AvatarInteractionTemplate />,
  },
  {
    id: 'avatar/image',
    title: 'Avatar Image',
    render: () => (
      <AvatarPlaygroundTemplate {...defaultArgs} href={avatarImage} status="success" data-testid="avatar" />
    ),
  },
  {
    id: 'activity-avatar/default',
    title: 'ActivityAvatar Default',
    render: () => <ActivityAvatarTemplate {...defaultArgs} showActivityRing data-testid="activity-avatar" />,
  },
  {
    id: 'activity-avatar/interaction',
    title: 'ActivityAvatar Interaction',
    render: () => <ActivityAvatarInteractionTemplate />,
  },
  {
    id: 'activity-avatar/image',
    title: 'ActivityAvatar Image',
    render: () => (
      <ActivityAvatarTemplate
        {...defaultArgs}
        href={avatarImage}
        status="success"
        showActivityRing
        data-testid="activity-avatar"
      />
    ),
  },
];

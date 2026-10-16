import type { PlaygroundScenario } from './index';
import type { AvatarProps } from '../../src/components/Avatar';
import { AvatarPlaygroundTemplate } from '../../src/components/Avatar/stories/AvatarPlayground.template';

const defaultArgs: AvatarProps = {
  children: 'Avatar',
};

export const avatarScenarios: PlaygroundScenario[] = [
  {
    id: 'avatar/default',
    title: 'Avatar Default',
    render: () => <AvatarPlaygroundTemplate {...defaultArgs} data-testid="avatar" />,
  },
];

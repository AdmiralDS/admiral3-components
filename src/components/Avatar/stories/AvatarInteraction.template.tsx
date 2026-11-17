import type { ComponentType } from 'react';
import { useState } from 'react';

import { ActivityAvatar, Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

type InteractionAvatarProps = Pick<AvatarProps, 'userName' | 'onClick' | 'status' | 'aria-describedby'> & {
  'data-testid': string;
};

const ActivityAvatarWithRing = (props: InteractionAvatarProps) => <ActivityAvatar {...props} showActivityRing />;

const AvatarInteractionExample = ({ Component }: { Component: ComponentType<InteractionAvatarProps> }) => {
  const [activationCount, setActivationCount] = useState(0);

  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <button type="button" data-testid="before-avatar">
        Перед аватаром
      </button>
      <Component
        userName="Иван Иванов"
        status="success"
        aria-describedby="avatar-description"
        data-testid="interactive-avatar"
        onClick={() => setActivationCount((count) => count + 1)}
      />
      <Component userName="Пётр Петров" data-testid="passive-avatar" />
      <button type="button" data-testid="after-avatar">
        После аватара
      </button>
      <p id="avatar-description">Открыть профиль пользователя</p>
      <output data-testid="activation-count" aria-live="polite">
        {activationCount}
      </output>
    </StoryDemoContainer>
  );
};

export const AvatarInteractionTemplate = () => <AvatarInteractionExample Component={Avatar} />;

export const ActivityAvatarInteractionTemplate = () => <AvatarInteractionExample Component={ActivityAvatarWithRing} />;

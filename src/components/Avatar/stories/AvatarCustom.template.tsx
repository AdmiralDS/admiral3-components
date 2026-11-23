import { Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

import { AVATAR_CUSTOM_COLORS } from './avatarCustomColors';
import {
  StoryDemoContainer,
  StoryDemoDescription,
  StoryDemoSample,
  StoryDemoSamples,
} from '../../stories/StoryContainers';

export const AvatarCustomTemplate = (args: AvatarProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription $textAlign="center">
      Пользовательские цвета задаются объектом в <code>appearance</code>. Для окраски фона компонента, букв (иконок)
      используйте стандартную палитру дизайн-системы, следите за контрастностью и читаемостью. Рекомендуемые цвета:
    </StoryDemoDescription>
    <StoryDemoSamples>
      {AVATAR_CUSTOM_COLORS.map(({ label, backgroundColor, textColor }) => (
        <StoryDemoSample key={label}>
          <Avatar {...args} appearance={{ backgroundColor, textColor }} status={undefined} />
          <StoryDemoDescription>{label}</StoryDemoDescription>
        </StoryDemoSample>
      ))}
    </StoryDemoSamples>
    <StoryDemoSample>
      <StoryDemoDescription>Пользовательский статус</StoryDemoDescription>
      <Avatar {...args} status={{ backgroundColor: 'var(--admiral-color-magenta-base-1-rest)' }} />
    </StoryDemoSample>
  </StoryDemoContainer>
);

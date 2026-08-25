import { Badge, type BadgeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const BadgeCustomColorsTemplate = (args: BadgeProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoDescription $textAlign="center">
        Пользовательские цвета задаются объектом в <code>appearance</code>. Для Badge передавайте{' '}
        <code>backgroundColor</code> и <code>textColor</code> как пару и выбирайте их так, чтобы текст оставался
        читаемым на выбранном фоне во всех темах.
      </StoryDemoDescription>
      <Badge
        {...args}
        appearance={{
          backgroundColor: 'var(--admiral-color-blue-base-1-rest)',
          textColor: 'var(--admiral-color-neutral-text-static-white-1)',
        }}
      />
    </StoryDemoContainer>
  );
};

import { BadgeDot, type BadgeDotProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const BadgeDotCustomColorsTemplate = (args: BadgeDotProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoDescription>
        Пользовательский цвет задается объектом в <code>appearance</code>. Для BadgeDot передавайте{' '}
        <code>backgroundColor</code>: это может быть CSS custom property из токенов или любое валидное CSS-значение
        цвета.
      </StoryDemoDescription>
      <BadgeDot
        {...args}
        appearance={{
          backgroundColor: 'var(--admiral-color-blue-base-1-rest)',
        }}
      />
    </StoryDemoContainer>
  );
};

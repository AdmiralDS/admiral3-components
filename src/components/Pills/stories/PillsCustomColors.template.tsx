import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const PillsCustomColorsTemplate = (args: PillProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        Пользовательские цвета задаются объектом в <code>appearance</code>. <br />
        Передавайте <code>backgroundColor</code> и <code>textColor</code> как пару и проверяйте контраст текста на фоне
        во всех темах.
      </StoryDemoDescription>
      <Pill
        {...args}
        appearance={{
          backgroundColor: 'var(--admiral-color-purple-base-1-rest)',
          textColor: 'var(--admiral-color-neutral-text-static-white-1)',
        }}
      />
    </StoryDemoContainer>
  );
};

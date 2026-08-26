import { Spinner, type SpinnerProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SpinnerCustomColorsTemplate = (args: SpinnerProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px">
      <StoryDemoDescription $textAlign="center">
        Пользовательские цвета задаются объектом в <code>appearance</code>. Для Spinner передавайте <code>color</code> и
        выбирайте его так, чтобы компонент оставался видимым на выбранном фоне во всех темах.
      </StoryDemoDescription>
      <Spinner
        {...args}
        appearance={{
          color: 'var(--admiral-color-purple-base-1-rest)',
        }}
      />
    </StoryDemoContainer>
  );
};

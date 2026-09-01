import { FieldSet, type FieldSetProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

// TODO в дальнейшем заменить нативные инпуты на библиотечные компоненты

export const FieldSetPlaygroundTemplate = (args: FieldSetProps) => {
  return (
    <StoryDemoContainer>
      <FieldSet {...args}>
        <input placeholder="Фамилия" />
        <input placeholder="Имя" />
        <input placeholder="Отчество" />
      </FieldSet>
    </StoryDemoContainer>
  );
};

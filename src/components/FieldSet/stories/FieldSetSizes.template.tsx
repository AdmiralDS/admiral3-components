import { FieldSet, type FieldSetProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

// TODO в дальнейшем заменить нативные инпуты на библиотечные компоненты

export const FieldSetSizesTemplate = (args: FieldSetProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="40px">
      <FieldSet {...args}>
        <input placeholder="Фамилия" />
        <input placeholder="Имя" />
        <input placeholder="Отчество" />
      </FieldSet>
      <FieldSet {...args} dimension="s">
        <input placeholder="Фамилия" />
        <input placeholder="Имя" />
        <input placeholder="Отчество" />
      </FieldSet>
      <FieldSet {...args} dimension="xs">
        <input placeholder="Фамилия" />
        <input placeholder="Имя" />
        <input placeholder="Отчество" />
      </FieldSet>
    </StoryDemoContainer>
  );
};

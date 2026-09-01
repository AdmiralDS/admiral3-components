import { FieldSet, type FieldSetProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';

// TODO в дальнейшем заменить нативные инпуты на библиотечные компоненты

export const FieldSetStatesTemplate = (args: FieldSetProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="40px">
      <FieldSet {...args} disabled>
        <input placeholder="Фамилия" />
        <input placeholder="Имя" />
        <input placeholder="Отчество" />
      </FieldSet>
      <FieldSet {...args} required>
        <input placeholder="Фамилия" required />
        <input placeholder="Имя" required />
        <input placeholder="Отчество" />
      </FieldSet>
      <FieldSet {...args} required error>
        <input placeholder="Фамилия" required />
        <input placeholder="Имя" required />
        <input placeholder="Отчество" />
      </FieldSet>
    </StoryDemoContainer>
  );
};

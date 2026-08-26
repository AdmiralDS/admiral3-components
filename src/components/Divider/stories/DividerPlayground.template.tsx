import { StoryDemoContainer, StoryDemoDescription } from '#src/components/stories/StoryContainers';

import { Divider, ListItem, UnorderedList, type DividerProps } from '@admiral-ds/admiral3-components';

export const DividerPlaygroundTemplate = (args: DividerProps) => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <StoryDemoDescription>
        Компонент для визуального разделения групп контента, создания визуальной иерархии или упорядочивания длинного
        списка элементов.
        <br />
        <br />
        Рекомендации:
      </StoryDemoDescription>
      <UnorderedList dimension="s" styleType="bullet">
        <ListItem>
          Используйте Divider, только когда это необходимо. В большинстве ситуаций можно обойтись пустым пространством
          (отступами) и цветами.
        </ListItem>
        <ListItem>Не используйте компонент для создания обводок и других аналогичных элементов.</ListItem>
        <ListItem>
          При использовании между несколькими одинаковыми элементами интерфейса, разделители ставятся только между ними.
          Не ставьте разделители перед первым элементом и после последнего.
        </ListItem>
      </UnorderedList>
      <Divider {...args} />
    </StoryDemoContainer>
  );
};

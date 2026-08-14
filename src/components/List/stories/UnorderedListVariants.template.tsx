import { DocumentsTasksOutline, SystemEmailOutline, SystemPeopleOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { UnorderedList, ListItem, ListIcon, type UnorderedListProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Layout = styled(StoryDemoContainer)`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, auto);
  ${StoryDemoDescription} {
    grid-column-start: 1;
    grid-column-end: span 2;
    margin-top: 20px;
  }
`;

export const UnorderedListVariantsTemplate = (props: UnorderedListProps) => {
  return (
    <Layout>
      <StoryDemoDescription>Bullet</StoryDemoDescription>
      <UnorderedList {...props}>
        <ListItem>Уборка</ListItem>
        <ListItem>Покупка продуктов</ListItem>
        <ListItem>Работа</ListItem>
      </UnorderedList>
      <UnorderedList {...props} dimension="s">
        <ListItem>Уборка</ListItem>
        <ListItem>Покупка продуктов</ListItem>
        <ListItem>Работа</ListItem>
      </UnorderedList>
      <StoryDemoDescription>Virgule</StoryDemoDescription>
      <UnorderedList {...props} styleType="virgule">
        <ListItem>Куриная грудка</ListItem>
        <ListItem>Сливки</ListItem>
        <ListItem>Чеснок</ListItem>
      </UnorderedList>
      <UnorderedList {...props} styleType="virgule" dimension="s">
        <ListItem>Куриная грудка</ListItem>
        <ListItem>Сливки</ListItem>
        <ListItem>Чеснок</ListItem>
      </UnorderedList>
      <StoryDemoDescription>Icon</StoryDemoDescription>
      <UnorderedList {...props} styleType="icon">
        <ListItem>
          <ListIcon as={DocumentsTasksOutline} />
          Задачи
        </ListItem>
        <ListItem>
          <ListIcon as={SystemEmailOutline} />
          Почта
        </ListItem>
        <ListItem>
          <ListIcon as={SystemPeopleOutline} />
          Встречи
        </ListItem>
      </UnorderedList>
      <UnorderedList {...props} styleType="icon" dimension="s">
        <ListItem>
          <ListIcon as={DocumentsTasksOutline} />
          Задачи
        </ListItem>
        <ListItem>
          <ListIcon as={SystemEmailOutline} />
          Почта
        </ListItem>
        <ListItem>
          <ListIcon as={SystemPeopleOutline} />
          Встречи
        </ListItem>
      </UnorderedList>
    </Layout>
  );
};

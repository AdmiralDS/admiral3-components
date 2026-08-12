import styled from 'styled-components';

import { OrderedList, UnorderedList, ListItem } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Layout = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
`;

export const ListNestedTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Списки могут быть вложенными, а разновидности могут смешиваться внутри вложенных группировок.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Отступ слева равен расстоянию от текста до левого края компонента вышестоящего уровня. То есть выравнивание идет
        по краю текста вышестоящего уровня.
      </StoryDemoDescription>
      <Layout>
        <OrderedList>
          <ListItem>Текст строки</ListItem>
          <ListItem>
            Текст строки
            <OrderedList>
              <ListItem>Текст строки</ListItem>
              <ListItem>Текст строки</ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>Текст строки</ListItem>
        </OrderedList>
        <OrderedList dimension="s">
          <ListItem>Текст строки</ListItem>
          <ListItem>
            Текст строки
            <OrderedList dimension="s">
              <ListItem>Текст строки</ListItem>
              <ListItem>Текст строки</ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>Текст строки</ListItem>
        </OrderedList>
        <UnorderedList>
          <ListItem>Текст строки</ListItem>
          <ListItem>
            Текст строки
            <UnorderedList styleType="virgule">
              <ListItem>Текст строки</ListItem>
              <ListItem>Текст строки</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>Текст строки</ListItem>
        </UnorderedList>
        <UnorderedList dimension="s">
          <ListItem>Текст строки</ListItem>
          <ListItem>
            Текст строки
            <UnorderedList dimension="s" styleType="virgule">
              <ListItem>Текст строки</ListItem>
              <ListItem>Текст строки</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>Текст строки</ListItem>
        </UnorderedList>
      </Layout>
    </StoryDemoContainer>
  );
};

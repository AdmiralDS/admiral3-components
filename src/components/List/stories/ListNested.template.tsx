import styled from 'styled-components';

import {
  OrderedList,
  UnorderedList,
  ListItem,
  type OrderedListProps,
  type UnorderedListProps,
} from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Layout = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
`;

export const NestedOrderedListExample = (props: OrderedListProps) => (
  <OrderedList {...props}>
    <ListItem>Текст строки</ListItem>
    <ListItem>
      Текст строки
      <OrderedList dimension={props.dimension}>
        <ListItem>Текст строки</ListItem>
        <ListItem>Текст строки</ListItem>
      </OrderedList>
    </ListItem>
    <ListItem>Текст строки</ListItem>
  </OrderedList>
);

export const NestedUnorderedListExample = (props: UnorderedListProps) => (
  <UnorderedList {...props}>
    <ListItem>Текст строки</ListItem>
    <ListItem>
      Текст строки
      <UnorderedList dimension={props.dimension} styleType="virgule">
        <ListItem>Текст строки</ListItem>
        <ListItem>Текст строки</ListItem>
      </UnorderedList>
    </ListItem>
    <ListItem>Текст строки</ListItem>
  </UnorderedList>
);

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
        <NestedOrderedListExample />
        <NestedOrderedListExample dimension="s" />
        <NestedUnorderedListExample />
        <NestedUnorderedListExample dimension="s" />
      </Layout>
    </StoryDemoContainer>
  );
};

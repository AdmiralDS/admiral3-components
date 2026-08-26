import styled from 'styled-components';

import { OrderedList, ListItem, type OrderedListProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Layout = styled(StoryDemoContainer)`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, auto);
  ${StoryDemoDescription} {
    grid-column-start: 1;
    grid-column-end: span 2;
    margin-top: 20px;
  }
`;

export const OrderedListVariantsTemplate = (props: OrderedListProps) => {
  return (
    <Layout>
      <StoryDemoDescription>Numbers</StoryDemoDescription>
      <OrderedList {...props}>
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
      <OrderedList {...props} dimension="s">
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
      <StoryDemoDescription>Letters lower</StoryDemoDescription>
      <OrderedList {...props} styleType="lower-letters">
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
      <OrderedList {...props} styleType="lower-letters" dimension="s">
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
      <StoryDemoDescription>Letters upper</StoryDemoDescription>
      <OrderedList {...props} styleType="upper-letters">
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
      <OrderedList {...props} styleType="upper-letters" dimension="s">
        <ListItem>Обработка запроса</ListItem>
        <ListItem>Исследование</ListItem>
        <ListItem>Подведение итогов</ListItem>
      </OrderedList>
    </Layout>
  );
};

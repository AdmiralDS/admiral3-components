import { ListItem, OrderedList, type OrderedListProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const OrderedListNumberingTemplate = (props: OrderedListProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Компоненты <code>OrderedList</code> и <code>ListItem</code> поддерживают нативные атрибуты <code>start</code>,{' '}
        <code>reversed</code> и <code>value</code>.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В компоненте <code>OrderedList</code> по умолчанию нумерация пунктов начинается с единицы, но с помощью атрибута{' '}
        <code>start</code> можно поменять это стартовое число.
      </StoryDemoDescription>
      <OrderedList start={3} {...props}>
        <ListItem>Третий пункт</ListItem>
        <ListItem>Четвёртый пункт</ListItem>
        <ListItem>Пятый пункт</ListItem>
      </OrderedList>

      <StoryDemoDescription>
        Атрибут <code>reversed</code> меняет направление нумерации на противоположное. Этот атрибут не требует значения.
      </StoryDemoDescription>
      <OrderedList reversed {...props}>
        <ListItem>Третий пункт</ListItem>
        <ListItem>Второй пункт</ListItem>
        <ListItem>Первый пункт</ListItem>
      </OrderedList>

      <StoryDemoDescription>
        Параметр <code>value</code> задаёт номер отдельного пункта (<code>ListItem</code>) и меняет продолжение
        нумерации.
      </StoryDemoDescription>
      <OrderedList {...props}>
        <ListItem>Первый пункт</ListItem>
        <ListItem value={5}>Пятый пункт</ListItem>
        <ListItem>Шестой пункт</ListItem>
      </OrderedList>
    </StoryDemoContainer>
  );
};

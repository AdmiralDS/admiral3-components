import { ListItem, OrderedList, type OrderedListProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const OrderedListNumberingTemplate = (props: OrderedListProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Компонент <code>ListItem</code> поддерживает нативный атрибут <code>value</code>. Данный атрибут задаёт номер
        отдельного пункта и меняет продолжение нумерации.
      </StoryDemoDescription>
      <OrderedList {...props}>
        <ListItem>Первый пункт</ListItem>
        <ListItem value={5}>Пятый пункт</ListItem>
        <ListItem>Шестой пункт</ListItem>
      </OrderedList>
    </StoryDemoContainer>
  );
};

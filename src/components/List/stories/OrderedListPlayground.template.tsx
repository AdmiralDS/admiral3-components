import { OrderedList, ListItem, type OrderedListProps } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer } from '../../stories/StoryContainers';

export const OrderedListPlaygroundTemplate = ({ styleType = 'numbers', ...props }: OrderedListProps) => {
  return (
    <StoryDemoContainer>
      <OrderedList {...props} styleType={styleType}>
        <ListItem>Текст строки</ListItem>
        <ListItem>Текст строки</ListItem>
        <ListItem>Текст строки</ListItem>
        <ListItem>Текст строки</ListItem>
      </OrderedList>
    </StoryDemoContainer>
  );
};

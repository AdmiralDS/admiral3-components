import { DocumentsTasksOutline, SystemEmailOutline, SystemPeopleOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { UnorderedList, ListItem, ListIcon } from '@admiral-ds/admiral3-primitives';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const ItemWithColoredMarker = styled(ListItem)<{ $color: string }>`
  &&::before {
    color: ${(p) => p.$color};
  }
`;

export const ListMarkerColorTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Пользователь может кастомизировать цвет маркеров и иконок самостоятельно, как это продемонстрировано в данном
        примере.
      </StoryDemoDescription>
      <UnorderedList>
        <ListItem>Уборка</ListItem>
        <ListItem>
          Покупка продуктов
          <UnorderedList>
            <ItemWithColoredMarker $color="blue">Куриная грудка</ItemWithColoredMarker>
            <ItemWithColoredMarker $color="red">Сливки</ItemWithColoredMarker>
            <ItemWithColoredMarker $color="green">Чеснок</ItemWithColoredMarker>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Работа
          <UnorderedList styleType="icon">
            <ListItem>
              <ListIcon as={DocumentsTasksOutline} color="blue" />
              Задачи
            </ListItem>
            <ListItem>
              <ListIcon as={SystemEmailOutline} color="red" />
              Почта
            </ListItem>
            <ListItem>
              <ListIcon as={SystemPeopleOutline} color="green" />
              Встречи
            </ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
    </StoryDemoContainer>
  );
};

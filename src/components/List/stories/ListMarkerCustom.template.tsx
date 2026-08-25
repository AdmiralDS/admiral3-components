import { css } from 'styled-components';

import { OrderedList, UnorderedList, ListItem } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

/**
 * Контент маркера может зависить от значения счетчика.
 * В компонентах OrderedList и UnorderedList используется счетчик с именем admiral-list-counter.
 **/
const latinLettersMarker = css`
  content: counter(admiral-list-counter, lower-latin) ')';
`;

const squareMarker = css`
  content: counter(admiral-list-counter, square);
`;

const checkMarker = css`
  content: '✓';
  color: green;
`;

export const ListMarkerCustomTemplate = () => {
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Пользователь может кастомизировать внешний вид и контент маркеров в списках с помощью параметра{' '}
        <code>markerCssMixin</code>, задаваемого для компонентов <code>OrderedList</code> и <code>UnorderedList</code>.
      </StoryDemoDescription>
      <StoryDemoDescription>
        В компонентах <code>OrderedList</code> и <code>UnorderedList</code> также специально введен CSS-счётчик с именем{' '}
        <code>admiral-list-counter</code>. Пользователи могут опираться на его значение для задания контента маркеров с
        использованием CSS-функций <code>counter()</code> и <code>counters()</code>.
      </StoryDemoDescription>
      <OrderedList styleType="lower-letters" markerCssMixin={latinLettersMarker}>
        <ListItem>Уборка</ListItem>
        <ListItem>
          Покупка продуктов
          <UnorderedList markerCssMixin={checkMarker}>
            <ListItem>Куриная грудка</ListItem>
            <ListItem>Сливки</ListItem>
            <ListItem>Чеснок</ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          Работа
          <UnorderedList markerCssMixin={squareMarker}>
            <ListItem>Задачи</ListItem>
            <ListItem>Почта</ListItem>
            <ListItem>Встречи</ListItem>
          </UnorderedList>
        </ListItem>
      </OrderedList>
    </StoryDemoContainer>
  );
};

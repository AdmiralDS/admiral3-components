import { SystemStarSolid } from '@admiral-ds/admiral3-icons';
import { css } from 'styled-components';

import { ListIcon, ListItem, OrderedList, UnorderedList } from '@admiral-ds/admiral3-primitives';

import type { PlaygroundScenario } from './index';

const customMarker = css`
  content: '✓';
  color: rgb(0, 128, 0);
`;

const counterMarker = css`
  content: '[' counter(admiral-list-counter, decimal) ']';
  color: rgb(255, 99, 71);
`;

export const listScenarios: PlaygroundScenario[] = [
  {
    id: 'list/default',
    title: 'List Default',
    render: () => (
      <OrderedList data-testid="ordered-list">
        <ListItem>Первый пункт</ListItem>
        <ListItem>Второй пункт</ListItem>
      </OrderedList>
    ),
  },
  {
    id: 'list/variants',
    title: 'List Variants',
    render: () => (
      <div>
        <OrderedList data-testid="ordered-letters" dimension="s" styleType="lower-letters" gap={12}>
          <ListItem>Первый пункт</ListItem>
          <ListItem>Второй пункт</ListItem>
        </OrderedList>
        <UnorderedList data-testid="unordered-custom" dimension="xs" styleType="virgule" markerCssMixin={customMarker}>
          <ListItem>Первый пункт</ListItem>
          <ListItem>
            Второй пункт
            <UnorderedList data-testid="nested-list">
              <ListItem>Вложенный пункт</ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </div>
    ),
  },
  {
    id: 'list/markers',
    title: 'List Markers',
    render: () => (
      <div>
        <OrderedList data-testid="ordered-numbers" styleType="numbers">
          <ListItem>Numbers</ListItem>
        </OrderedList>
        <OrderedList data-testid="ordered-lower-letters" styleType="lower-letters">
          <ListItem>Lower letters</ListItem>
        </OrderedList>
        <OrderedList data-testid="ordered-upper-letters" styleType="upper-letters">
          <ListItem>Upper letters</ListItem>
        </OrderedList>
        <OrderedList data-testid="ordered-custom" markerCssMixin={counterMarker}>
          <ListItem>Custom counter</ListItem>
        </OrderedList>
        <UnorderedList data-testid="unordered-bullet" styleType="bullet">
          <ListItem>Bullet</ListItem>
        </UnorderedList>
        <UnorderedList data-testid="unordered-virgule" styleType="virgule">
          <ListItem>Virgule</ListItem>
        </UnorderedList>
        <UnorderedList data-testid="unordered-icon" styleType="icon">
          <ListItem>Icon</ListItem>
        </UnorderedList>
      </div>
    ),
  },
  {
    id: 'list/icon',
    title: 'List Icon',
    render: () => (
      <UnorderedList data-testid="icon-list" dimension="s" styleType="icon">
        <ListItem>
          <ListIcon as={SystemStarSolid} color="rgb(255, 0, 0)" data-testid="list-icon" />
          Пункт с иконкой
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    id: 'list/item-value',
    title: 'List Item Value',
    render: () => (
      <OrderedList data-testid="ordered-value-list">
        <ListItem>Первый пункт</ListItem>
        <ListItem value={5} data-testid="ordered-value">
          Пятый пункт
        </ListItem>
        <ListItem>Шестой пункт</ListItem>
      </OrderedList>
    ),
  },
];

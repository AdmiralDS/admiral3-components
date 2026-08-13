import { SystemStarSolid } from '@admiral-ds/admiral3-icons';
import { css } from 'styled-components';

import { ListIcon, ListItem, UnorderedList } from '@admiral-ds/admiral3-primitives';

import type { PlaygroundScenario } from './index';
import { ListMultiLineTemplate } from '../../src/components/List/stories/ListMultiline.template';
import { NestedOrderedListExample } from '../../src/components/List/stories/ListNested.template';
import { OrderedListNumberingTemplate } from '../../src/components/List/stories/OrderedListNumbering.template';
import { OrderedListPlaygroundTemplate } from '../../src/components/List/stories/OrderedListPlayground.template';
import { UnorderedListPlaygroundTemplate } from '../../src/components/List/stories/UnorderedListPlayground.template';

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
    render: () => <OrderedListPlaygroundTemplate data-testid="ordered-list" />,
  },
  {
    id: 'list/variants',
    title: 'List Variants',
    render: () => (
      <>
        <OrderedListPlaygroundTemplate data-testid="ordered-variant" dimension="s" gap={12} />
        <UnorderedListPlaygroundTemplate data-testid="unordered-custom" dimension="xs" markerCssMixin={customMarker} />
      </>
    ),
  },
  {
    id: 'list/markers',
    title: 'List Markers',
    render: () => (
      <>
        <OrderedListPlaygroundTemplate data-testid="ordered-numbers" styleType="numbers" />
        <OrderedListPlaygroundTemplate data-testid="ordered-lower-letters" styleType="lower-letters" />
        <OrderedListPlaygroundTemplate data-testid="ordered-upper-letters" styleType="upper-letters" />
        <OrderedListPlaygroundTemplate data-testid="ordered-custom" markerCssMixin={counterMarker} />
        <UnorderedListPlaygroundTemplate data-testid="unordered-bullet" styleType="bullet" />
        <UnorderedListPlaygroundTemplate data-testid="unordered-virgule" styleType="virgule" />
        <UnorderedListPlaygroundTemplate data-testid="unordered-icon" styleType="icon" />
      </>
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
        <ListItem>
          <ListIcon as={SystemStarSolid} data-testid="default-list-icon" />
          Пункт с иконкой цвета по умолчанию
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    id: 'list/item-value',
    title: 'List Item Value',
    render: () => <OrderedListNumberingTemplate data-testid="ordered-value-list" />,
  },
  {
    id: 'list/multiline',
    title: 'List Multiline',
    render: () => <ListMultiLineTemplate data-testid="multiline-list" style={{ width: '220px' }} />,
  },
  {
    id: 'list/nested-counters',
    title: 'List Nested Counters',
    render: () => <NestedOrderedListExample data-testid="outer-ordered-list" />,
  },
];

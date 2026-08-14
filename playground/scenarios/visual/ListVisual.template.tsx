import { SystemStarSolid } from '@admiral-ds/admiral3-icons';
import { css } from 'styled-components';

import {
  ListIcon,
  ListItem,
  OrderedList,
  type OrderedListType,
  UnorderedList,
  type UnorderedListType,
} from '@admiral-ds/admiral3-primitives';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import { LIST_DIMENSIONS, ORDERED_LIST_TYPE, UNORDERED_LIST_TYPE } from '../../../src/components/List/constants';

const ITEMS = ['Первый пункт списка', 'Второй пункт списка', 'Третий пункт списка'];

const customOrderedMarker = css`
  content: '[' counter(admiral-list-counter) ']';
  color: #7c3aed;
`;

const customUnorderedMarker = css`
  content: '✓';
  color: #00873c;
`;

const renderItems = () => ITEMS.map((item) => <ListItem key={item}>{item}</ListItem>);

const renderOrderedList = (styleType: OrderedListType, dimension: (typeof LIST_DIMENSIONS)[number]) => (
  <OrderedList dimension={dimension} styleType={styleType}>
    {renderItems()}
  </OrderedList>
);

const renderUnorderedList = (styleType: UnorderedListType, dimension: (typeof LIST_DIMENSIONS)[number]) => (
  <UnorderedList dimension={dimension} styleType={styleType}>
    {styleType === 'icon'
      ? ITEMS.map((item) => (
          <ListItem key={item}>
            <ListIcon as={SystemStarSolid} />
            {item}
          </ListItem>
        ))
      : renderItems()}
  </UnorderedList>
);

export const ListVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Ordered list marker types</VisualTitle>
      <VisualGroups>
        {ORDERED_LIST_TYPE.map((styleType) => (
          <VisualGroup key={styleType}>
            <VisualGroupTitle>{styleType}</VisualGroupTitle>
            <VisualSamples>
              {LIST_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  {renderOrderedList(styleType, dimension)}
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Unordered list marker types</VisualTitle>
      <VisualGroups>
        {UNORDERED_LIST_TYPE.map((styleType) => (
          <VisualGroup key={styleType}>
            <VisualGroupTitle>{styleType}</VisualGroupTitle>
            <VisualSamples>
              {LIST_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  {renderUnorderedList(styleType, dimension)}
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>List item layouts</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>Custom item value</VisualGroupTitle>
          <VisualSamples>
            <OrderedList>
              <ListItem>Первый пункт списка</ListItem>
              <ListItem value={5}>Пятый пункт списка</ListItem>
              <ListItem>Шестой пункт списка</ListItem>
            </OrderedList>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Multiline item</VisualGroupTitle>
          <VisualSamples>
            <OrderedList style={{ width: 280 }}>
              <ListItem>
                Длинный пункт списка, который занимает несколько строк и позволяет проверить выравнивание маркера
              </ListItem>
              <ListItem>Короткий пункт списка</ListItem>
            </OrderedList>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Nested lists</VisualGroupTitle>
          <VisualSamples>
            <OrderedList>
              <ListItem>
                Первый уровень
                <OrderedList dimension="s">
                  <ListItem>Второй уровень</ListItem>
                  <ListItem>Ещё один пункт второго уровня</ListItem>
                </OrderedList>
              </ListItem>
              <ListItem>Следующий пункт первого уровня</ListItem>
            </OrderedList>
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Custom markers and spacing</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>Custom ordered marker</VisualGroupTitle>
          <VisualSamples>
            <OrderedList gap={12} markerCssMixin={customOrderedMarker}>
              {renderItems()}
            </OrderedList>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Custom unordered marker</VisualGroupTitle>
          <VisualSamples>
            <UnorderedList gap="4px" markerCssMixin={customUnorderedMarker}>
              {renderItems()}
            </UnorderedList>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Custom list icon color</VisualGroupTitle>
          <VisualSamples>
            <UnorderedList styleType="icon">
              <ListItem>
                <ListIcon as={SystemStarSolid} color="#d92020" />
                Красная иконка
              </ListItem>
              <ListItem>
                <ListIcon as={SystemStarSolid} />
                Иконка стандартного цвета
              </ListItem>
            </UnorderedList>
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

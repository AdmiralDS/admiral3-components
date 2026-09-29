import { useState } from 'react';

import styled from 'styled-components';

import { FilterChips, ListItem, UnorderedList, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const planets = ['Марс', 'Венера', 'Юпитер'];
const renderItems = () => planets.map((item) => <FilterChips.Item key={item}>{item}</FilterChips.Item>);

const DescriptionList = styled(UnorderedList)`
  width: 100%;
  max-width: 640px;
`;

type ExampleProps = Pick<FilterChipsProps, 'dimension' | 'gap' | 'disabled'>;
type FilterChipsTemplateProps = ExampleProps & { exclusive?: boolean };

const MultipleSelection = ({ dimension }: ExampleProps) => {
  const [checkBoxSelected, setCheckBoxSelected] = useState<string[]>([]);

  return (
    <FilterChips
      dimension={dimension}
      value={checkBoxSelected}
      onChange={(_, value) => setCheckBoxSelected(value)}
      aria-label="Планеты: множественный выбор"
    >
      {renderItems()}
    </FilterChips>
  );
};

const ExclusiveSelection = ({ dimension }: ExampleProps) => {
  const [radioSelected, setRadioSelected] = useState<string | null>(null);

  return (
    <FilterChips
      exclusive
      dimension={dimension}
      value={radioSelected}
      onChange={(_, value) => setRadioSelected(value)}
      aria-label="Планеты: одиночный выбор"
    >
      {renderItems()}
    </FilterChips>
  );
};

export const FilterChipsTemplate = ({ dimension, exclusive, gap, disabled }: FilterChipsTemplateProps) => {
  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Filter Chips – набор из двух и более чипсов, которые могут быть в выбранном или невыбранном состояниях. <br />
        <br />
        Filter Chips могут работать в двух режимах:
      </StoryDemoDescription>
      <DescriptionList dimension="s" styleType="bullet">
        <ListItem>режим чекбоксов, когда можно выбрать любое количество значений</ListItem>
        <ListItem>режима радио кнопок, когда можно выбрать только одно значение из списка</ListItem>
      </DescriptionList>
      {exclusive ? (
        <ExclusiveSelection dimension={dimension} gap={gap} disabled={disabled} />
      ) : (
        <MultipleSelection dimension={dimension} gap={gap} disabled={disabled} />
      )}
    </StoryDemoContainer>
  );
};

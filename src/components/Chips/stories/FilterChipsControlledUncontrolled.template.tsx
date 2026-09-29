import { useState } from 'react';

import { FilterChips, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const items = ['Марс', 'Венера', 'Юпитер'];

const renderItems = () => items.map((item) => <FilterChips.Item key={item}>{item}</FilterChips.Item>);

export const FilterChipsControlledUncontrolledTemplate = ({ dimension }: Pick<FilterChipsProps, 'dimension'>) => {
  const [controlledValue, setControlledValue] = useState<string[]>(['Марс']);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="40px">
      <StoryDemoDescription>
        Controlled-группа получает выбранные значения через value. Родительский компонент хранит их в состоянии и
        обновляет в обработчике onChange.
      </StoryDemoDescription>
      <FilterChips
        aria-label="Controlled FilterChips"
        dimension={dimension}
        value={controlledValue}
        onChange={(_, nextValue) => setControlledValue(nextValue)}
      >
        {renderItems()}
      </FilterChips>

      <StoryDemoDescription>
        Uncontrolled-группа получает только начальные значения через defaultValue.
      </StoryDemoDescription>
      <FilterChips aria-label="Uncontrolled FilterChips" dimension={dimension} defaultValue={['Венера']}>
        {renderItems()}
      </FilterChips>
    </StoryDemoContainer>
  );
};

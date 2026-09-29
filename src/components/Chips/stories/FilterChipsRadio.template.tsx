import { useState } from 'react';

import { FilterChips, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const planets = ['Марс', 'Венера', 'Юпитер'];

export const FilterChipsRadioTemplate = ({ dimension }: Pick<FilterChipsProps, 'dimension'>) => {
  const [radioSelected, setRadioSelected] = useState<string | null>('Марс');
  const [radioSelectedWithDeselect, setRadioSelectedWithDeselect] = useState<string | null>('Марс');
  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="40px">
      <StoryDemoDescription>
        В режиме exclusive одновременно может быть выбрано не более одного чипса. При повторном нажатии на выбранный
        чипс onChange передаёт null. В первом примере обработчик игнорирует null, поэтому снять текущий выбор нельзя —
        можно только переключиться на другой чипс.
      </StoryDemoDescription>
      <FilterChips
        exclusive
        aria-label="Одиночный выбор без снятия"
        dimension={dimension}
        value={radioSelected}
        onChange={(_, value) => {
          if (value !== null) setRadioSelected(value);
        }}
      >
        {planets.map((planet) => (
          <FilterChips.Item key={planet}>{planet}</FilterChips.Item>
        ))}
      </FilterChips>

      <StoryDemoDescription>
        Во втором примере onChange сохраняет любое новое значение, включая null, поэтому повторное нажатие снимает
        выбор.
      </StoryDemoDescription>
      <FilterChips
        exclusive
        aria-label="Одиночный выбор со снятием"
        dimension={dimension}
        value={radioSelectedWithDeselect}
        onChange={(_, value) => setRadioSelectedWithDeselect(value)}
      >
        {planets.map((planet) => (
          <FilterChips.Item key={planet}>{planet}</FilterChips.Item>
        ))}
      </FilterChips>
    </StoryDemoContainer>
  );
};

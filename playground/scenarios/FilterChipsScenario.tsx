import { useState } from 'react';

import { FilterChips } from '../../src/components/Chips';

const planets = ['Марс', 'Венера', 'Юпитер'];

export const FilterChipsScenario = ({
  disabled = false,
  readOnly = false,
}: {
  disabled?: boolean;
  readOnly?: boolean;
}) => {
  const [multipleValue, setMultipleValue] = useState(['Марс', 'Венера']);
  const [exclusiveValue, setExclusiveValue] = useState<string | null>('Марс');

  return (
    <>
      <FilterChips
        aria-label="Планеты: множественный выбор"
        value={multipleValue}
        onChange={(_, value) => setMultipleValue(value)}
        disabled={disabled}
      >
        {planets.map((planet) => (
          <FilterChips.Item key={planet} data-testid="chips" appearance="flat" colorMode="colored" readOnly={readOnly}>
            {planet}
          </FilterChips.Item>
        ))}
      </FilterChips>
      {!disabled && !readOnly && (
        <FilterChips
          aria-label="Планеты: одиночный выбор"
          exclusive
          value={exclusiveValue}
          onChange={(_, value) => setExclusiveValue(value)}
        >
          {planets.map((planet) => (
            <FilterChips.Item key={planet} appearance="flat" colorMode="colored">
              {planet}
            </FilterChips.Item>
          ))}
        </FilterChips>
      )}
    </>
  );
};

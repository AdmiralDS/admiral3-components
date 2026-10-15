import { useState } from 'react';

import { FilterChips } from '@admiral-ds/admiral3-components';

const planets = [
  { value: 'mars', label: 'Марс' },
  { value: 'venus', label: 'Венера' },
  { value: 'jupiter', label: 'Юпитер' },
];

export const FilterChipsScenario = ({
  disabled = false,
  readOnly = false,
}: {
  disabled?: boolean;
  readOnly?: boolean;
}) => {
  const [multipleValue, setMultipleValue] = useState(['mars', 'venus']);
  const [exclusiveValue, setExclusiveValue] = useState<string | null>('mars');

  return (
    <>
      <FilterChips
        aria-label="Планеты: множественный выбор"
        value={multipleValue}
        onChange={(_, value) => setMultipleValue(value)}
        disabled={disabled}
      >
        {planets.map(({ value, label }) => (
          <FilterChips.Item
            key={value}
            value={value}
            data-testid="chips"
            appearance="flat"
            colorMode="colored"
            readOnly={readOnly}
          >
            {label}
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
          {planets.map(({ value, label }) => (
            <FilterChips.Item key={value} value={value} appearance="flat" colorMode="colored">
              {label}
            </FilterChips.Item>
          ))}
        </FilterChips>
      )}
    </>
  );
};

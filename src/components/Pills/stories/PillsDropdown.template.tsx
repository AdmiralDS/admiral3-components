import { useState } from 'react';

import { SystemChevronDownOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Pill, type PillAppearance } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const OPTIONS = [
  { value: 'info', label: 'Info', appearance: 'info1' },
  { value: 'success', label: 'Success', appearance: 'success1' },
  { value: 'error', label: 'Error', appearance: 'error1' },
  { value: 'warning', label: 'Warning', appearance: 'warning1' },
] as const satisfies ReadonlyArray<{ value: string; label: string; appearance: PillAppearance }>;

const PillsDropdown = styled.span`
  position: relative;
  display: inline-flex;

  &:has(select:focus-visible) > [data-appearance] {
    outline: 2px solid var(--admiral-color-primary-stroke-1-rest);
    outline-offset: 2px;
  }
`;

const StyledPill = styled(Pill)`
  width: 75px;
  pointer-events: none;
`;

const NativeSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

export const PillsDropdownTemplate = () => {
  const [selectedValue, setSelectedValue] = useState<(typeof OPTIONS)[number]['value']>(OPTIONS[0].value);
  const selectedOption = OPTIONS.find(({ value }) => value === selectedValue) ?? OPTIONS[0];

  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        Временная композиция с нативным select сохраняет клавиатурную доступность до появления Dropdown.
      </StoryDemoDescription>
      <PillsDropdown>
        <StyledPill
          appearance={selectedOption.appearance}
          tabIndex={-1}
          aria-hidden="true"
          data-testid="pills-dropdown-value"
        >
          {selectedOption.label}
          <SystemChevronDownOutline aria-hidden="true" focusable="false" />
        </StyledPill>
        {/* TODO: Заменить нативный select на Dropdown после появления компонента. */}
        <NativeSelect
          name="status"
          aria-label="Статус"
          value={selectedValue}
          data-testid="pills-dropdown-select"
          onChange={(event) => setSelectedValue(event.currentTarget.value as (typeof OPTIONS)[number]['value'])}
        >
          {OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </PillsDropdown>
    </StoryDemoContainer>
  );
};

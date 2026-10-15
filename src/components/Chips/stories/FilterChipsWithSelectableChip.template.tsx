import { useState } from 'react';

import { SelectableChip, FilterChips, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const planets = ['Марс', 'Венера', 'Юпитер'];

export const FilterChipsWithSelectableChipTemplate = ({ dimension }: Pick<SelectableChipProps, 'dimension'>) => {
  const [selected, setSelected] = useState<string[]>(['Марс']);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Самостоятельные SelectableChip внутри FilterChips сохраняют собственное управление выбором: состояние selected
        задаётся снаружи, а onSelectedChange обновляет его. FilterChips в этом случае только объединяет элементы в
        группу.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Каждый SelectableChip доступен отдельно по Tab. Стрелки и Home/End не переключают фокус между ними, а Enter и
        Space активируют текущий SelectableChip. Для одного Tab-перехода на всю группу, навигации стрелками и выбора
        только по Space используйте FilterChips.Item.
      </StoryDemoDescription>
      <FilterChips aria-label="Планеты: самостоятельное управление">
        {planets.map((item) => (
          <SelectableChip
            key={item}
            dimension={dimension}
            selected={selected.includes(item)}
            onSelectedChange={(nextSelected) =>
              setSelected((current) =>
                nextSelected ? [...current, item] : current.filter((selectedItem) => selectedItem !== item),
              )
            }
          >
            {item}
          </SelectableChip>
        ))}
      </FilterChips>
    </StoryDemoContainer>
  );
};

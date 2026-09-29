import { useState } from 'react';

import { Chips, FilterChips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const planets = ['Марс', 'Венера', 'Юпитер'];

export const FilterChipsWithChipsTemplate = ({ dimension }: Pick<ChipsProps, 'dimension'>) => {
  const [selected, setSelected] = useState<string[]>(['Марс']);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Обычные Chips внутри FilterChips сохраняют собственное управление выбором: состояние selected задаётся снаружи,
        а onClick обновляет его. FilterChips в этом случае только объединяет элементы в группу.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Каждый Chips доступен отдельно по Tab. Стрелки и Home/End не переключают фокус между ними, а Enter и Space
        активируют текущий Chips. Для одного Tab-перехода на всю группу, навигации стрелками и выбора только по Space
        используйте FilterChips.Item.
      </StoryDemoDescription>
      <FilterChips aria-label="Планеты: самостоятельное управление">
        {planets.map((item) => (
          <Chips
            key={item}
            dimension={dimension}
            selected={selected.includes(item)}
            onClick={() =>
              setSelected((current) =>
                current.includes(item) ? current.filter((selectedItem) => selectedItem !== item) : [...current, item],
              )
            }
          >
            {item}
          </Chips>
        ))}
      </FilterChips>
    </StoryDemoContainer>
  );
};

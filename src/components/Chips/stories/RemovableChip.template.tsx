import { useState } from 'react';

import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const planets = ['Марс', 'Венера', 'Юпитер'];

export const RemovableChipTemplate = (args: RemovableChipProps) => {
  const [items, setItems] = useState(planets);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        RemovableChip используется для отображения элементов, которые можно удалить. Нажатие на крестик вызывает
        onClose; в этом примере обработчик удаляет соответствующий чипс из списка. Клавиша Tab переводит фокус на чипс,
        после чего Enter, Space или Backspace вызывают удаление. Крестик не входит в порядок Tab. При disabled удаление
        недоступно, а при readOnly дополнительно скрывается крестик. Иконка, аватар и Badge показывают варианты
        дополнительного содержимого чипса.
      </StoryDemoDescription>
      <StoryDemoContainer $withBackground={false} $gap="12px">
        {items.map((item) => (
          <RemovableChip
            key={item}
            {...args}
            onClose={() => setItems((current) => current.filter((value) => value !== item))}
          >
            {item}
          </RemovableChip>
        ))}
      </StoryDemoContainer>
    </StoryDemoContainer>
  );
};

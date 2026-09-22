import { StoryDemoContainer, StoryDemoDescription } from '#src/components/stories/StoryContainers';

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

export const ChipsPlaygroundTemplate = (args: ChipsProps) => {
  return (
    <StoryDemoContainer $withBackground={false} $gap="16px" $direction="column">
      <StoryDemoDescription>
        Чипсы — это перечень выбранных фильтров, опций или каких-либо элементов из списка.
        <br />
        Чипсы можно использовать при множественном выборе для визуализации выбранных опций и возможности их быстрого
        редактирования (добавление, удаление). Примером может служить компонент Multi Select с выбором участников
        встречи, когда имена выбранных людей выводятся списком в виде чипсов.
      </StoryDemoDescription>
      <Chips {...args} />
    </StoryDemoContainer>
  );
};

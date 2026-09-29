import { useState } from 'react';

import { FilterChips, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const FilterChipsValueTemplate = ({ dimension }: Pick<FilterChipsProps, 'dimension'>) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['planet-mars']);
  const [selectedContent, setSelectedContent] = useState<string[]>(['Марс']);

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>С id: в value передаются заданные идентификаторы.</StoryDemoDescription>
      <FilterChips
        aria-label="Выбор планет по id"
        dimension={dimension}
        value={selectedIds}
        onChange={(_, value) => setSelectedIds(value)}
      >
        <FilterChips.Item id="planet-mars">Марс</FilterChips.Item>
        <FilterChips.Item id="planet-venus">Венера</FilterChips.Item>
        <FilterChips.Item id="planet-jupiter">Юпитер</FilterChips.Item>
      </FilterChips>
      <StoryDemoDescription>value: {JSON.stringify(selectedIds)}</StoryDemoDescription>

      <StoryDemoDescription>Без id: в value передаётся текст элемента.</StoryDemoDescription>
      <FilterChips
        aria-label="Выбор планет по содержимому"
        dimension={dimension}
        value={selectedContent}
        onChange={(_, value) => setSelectedContent(value)}
      >
        <FilterChips.Item>Марс</FilterChips.Item>
        <FilterChips.Item>Венера</FilterChips.Item>
        <FilterChips.Item>Юпитер</FilterChips.Item>
      </FilterChips>
      <StoryDemoDescription>value: {JSON.stringify(selectedContent)}</StoryDemoDescription>
    </StoryDemoContainer>
  );
};

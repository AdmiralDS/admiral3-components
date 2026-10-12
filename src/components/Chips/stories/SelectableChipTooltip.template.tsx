import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Очень длинное название выбранного фильтра, которое не помещается в чипс';

export const SelectableChipTooltipTemplate = (args: SelectableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Для строкового children содержимое определяется автоматически; renderContentTooltip позволяет задать собственный
      текст.
    </StoryDemoDescription>
    <SelectableChip {...args} disabledTooltip={false} renderContentTooltip={undefined}>
      {longText}
    </SelectableChip>
    <SelectableChip
      {...args}
      disabledTooltip={false}
      renderContentTooltip={() => 'Собственное описание выбранного фильтра'}
    >
      <span>{longText}</span>
    </SelectableChip>
    <StoryDemoDescription>disabledTooltip отключает подсказку даже для обрезанного текста.</StoryDemoDescription>
    <SelectableChip {...args} disabledTooltip renderContentTooltip={undefined}>
      {longText}
    </SelectableChip>
    <StoryDemoDescription>Если текст помещается в чипс, подсказка не появляется.</StoryDemoDescription>
    <SelectableChip {...args} disabledTooltip={false} renderContentTooltip={undefined}>
      Короткий
    </SelectableChip>
  </StoryDemoContainer>
);

import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Очень длинное название выбранного фильтра, которое не помещается в чипс';

export const RemovableChipTooltipTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Для строкового children содержимое определяется автоматически; renderContentTooltip позволяет задать собственный
      текст.
    </StoryDemoDescription>
    <RemovableChip {...args} disabledTooltip={false} renderContentTooltip={undefined}>
      {longText}
    </RemovableChip>
    <RemovableChip
      {...args}
      disabledTooltip={false}
      renderContentTooltip={() => 'Собственное описание выбранного фильтра'}
    >
      <span>{longText}</span>
    </RemovableChip>
    <StoryDemoDescription>disabledTooltip отключает подсказку даже для обрезанного текста.</StoryDemoDescription>
    <RemovableChip {...args} disabledTooltip renderContentTooltip={undefined}>
      {longText}
    </RemovableChip>
    <StoryDemoDescription>Если текст помещается в чипс, подсказка не появляется.</StoryDemoDescription>
    <RemovableChip {...args} disabledTooltip={false} renderContentTooltip={undefined}>
      Короткий
    </RemovableChip>
  </StoryDemoContainer>
);

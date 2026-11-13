import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Очень длинное название выбранного фильтра, которое не помещается в чипс';

export const SelectableChipTooltipTemplate = (args: SelectableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      При переполнении Tooltip по умолчанию отображает <code>children</code>; <code>renderTooltipContent</code>{' '}
      позволяет задать собственное содержимое.
    </StoryDemoDescription>
    <SelectableChip {...args} showTooltip renderTooltipContent={undefined}>
      {longText}
    </SelectableChip>
    <SelectableChip {...args} showTooltip renderTooltipContent={() => 'Собственное описание выбранного фильтра'}>
      <span>{longText}</span>
    </SelectableChip>
    <StoryDemoDescription>
      <code>{'showTooltip={false}'}</code> отключает Tooltip и связанные с ним обработчики.
    </StoryDemoDescription>
    <SelectableChip {...args} showTooltip={false} renderTooltipContent={undefined}>
      {longText}
    </SelectableChip>
    <StoryDemoDescription>Если текст помещается в чипс, подсказка не появляется.</StoryDemoDescription>
    <SelectableChip {...args} showTooltip renderTooltipContent={undefined}>
      Короткий
    </SelectableChip>
  </StoryDemoContainer>
);

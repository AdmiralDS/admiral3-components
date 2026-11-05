import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Очень длинное название выбранного фильтра, которое не помещается в чипс';

export const RemovableChipTooltipTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      При переполнении Tooltip по умолчанию отображает <code>children</code>; <code>renderTooltipContent</code>{' '}
      позволяет задать собственное содержимое.
    </StoryDemoDescription>
    <RemovableChip {...args} showTooltip renderTooltipContent={undefined}>
      {longText}
    </RemovableChip>
    <RemovableChip {...args} showTooltip renderTooltipContent={() => 'Собственное описание выбранного фильтра'}>
      <span>{longText}</span>
    </RemovableChip>
    <StoryDemoDescription>
      <code>{'showTooltip={false}'}</code> отключает Tooltip и связанные с ним обработчики.
    </StoryDemoDescription>
    <RemovableChip {...args} showTooltip={false} renderTooltipContent={undefined}>
      {longText}
    </RemovableChip>
    <StoryDemoDescription>Если текст помещается в чипс, подсказка не появляется.</StoryDemoDescription>
    <RemovableChip {...args} showTooltip renderTooltipContent={undefined}>
      Короткий
    </RemovableChip>
  </StoryDemoContainer>
);

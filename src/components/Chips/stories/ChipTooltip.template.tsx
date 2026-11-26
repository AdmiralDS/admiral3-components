import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Длинное название категории, которое не помещается в чипс';

export const ChipTooltipTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      При переполнении Tooltip показывает текст чипса. Проп renderTooltipContent позволяет задать собственное
      содержимое.
    </StoryDemoDescription>
    <Chip {...args} showTooltip renderTooltipContent={undefined}>
      {longText}
    </Chip>
    <Chip {...args} showTooltip renderTooltipContent={() => 'Дополнительная информация о категории'}>
      {longText}
    </Chip>
    <StoryDemoDescription>При showTooltip=false подсказка отключается.</StoryDemoDescription>
    <Chip {...args} showTooltip={false} renderTooltipContent={undefined}>
      {longText}
    </Chip>
    <StoryDemoDescription>Если текст помещается в чипс, подсказка не появляется.</StoryDemoDescription>
    <Chip {...args} showTooltip renderTooltipContent={undefined}>
      Короткий
    </Chip>
  </StoryDemoContainer>
);

import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const longText = 'Очень длинное название выбранного фильтра, которое не помещается в Chips';

export const ChipsTooltipTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Наведите курсор на обрезанный текст. Пока используется нативная подсказка браузера (title): её оформление и
      задержку показа определяет браузер. renderContentTooltip должен возвращать строку. Если текст помещается,
      подсказка не появляется.
    </StoryDemoDescription>
    <Chips {...args} disabledTooltip={false} renderContentTooltip={undefined} data-testid="tooltip-auto">
      {longText}
    </Chips>
    <Chips
      {...args}
      disabledTooltip={false}
      renderContentTooltip={() => 'Собственное описание выбранного фильтра'}
      data-testid="tooltip-custom"
    >
      <span>{longText}</span>
    </Chips>
    <StoryDemoDescription>disabledTooltip отключает подсказку даже для обрезанного текста.</StoryDemoDescription>
    <Chips {...args} disabledTooltip renderContentTooltip={undefined} data-testid="tooltip-disabled">
      {longText}
    </Chips>
    <Chips {...args} disabledTooltip={false} renderContentTooltip={undefined} data-testid="tooltip-short">
      Короткий
    </Chips>
  </StoryDemoContainer>
);

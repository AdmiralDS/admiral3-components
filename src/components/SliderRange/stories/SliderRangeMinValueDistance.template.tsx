import { useState } from 'react';

import { SliderRange } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderRangeMinValueDistanceTemplate = () => {
  const [value, setValue] = useState<[number, number]>([25, 75]);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        MinValueDistance задаёт минимальный зазор в единицах значения. По умолчанию у SliderRange он равен 0. Здесь
        задано 10: во время перетаскивания ползунки свободно сближаются и меняются ролями, а при отпускании активный
        ползунок отступает в сторону своей текущей роли — нижний влево, верхний вправо. Сосед обычно остаётся на месте.
        Например, нижний ползунок из [25, 75] можно довести до 75; после отпускания получится [65, 75]. После обмена
        ролями отступает уже верхний ползунок.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Если активному ползунку не хватает места у края, он доходит до допустимого края, затем сдвигается сосед.
        Например, из [25, 95] перетащите нижний ползунок до 100: после обмена будет [95, 100], после отпускания — [90,
        100]. У min действует симметричное правило: [0, 5] превращается в [0, 10].
      </StoryDemoDescription>
      <StoryDemoDescription>
        Клавиатура, нажатие на дорожку и отметки учитывают зазор сразу, без обмена ролями. Положительный
        minValueDistance округляется вверх до кратного step и ограничивается доступной длиной шкалы. Значения,
        переданные владельцем, автоматически не раздвигаются: задавайте начальный и controlled-интервал с нужным
        зазором.
      </StoryDemoDescription>
      <StoryDemoItem>
        <SliderRange
          label="Интервал с зазором 10"
          minValueDistance={10}
          showTooltip
          value={value}
          onChange={setValue}
          lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
          upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        />
        <StoryDemoDescription role="status" aria-label="Выбранный интервал">
          {JSON.stringify(value)}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

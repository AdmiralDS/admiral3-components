import { useState } from 'react';

import { InputSliderRange, type InputSliderRangeValue } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderRangeBehaviorTemplate = () => {
  const [swapping, setSwapping] = useState<InputSliderRangeValue>(['25', '75']);
  const [fixed, setFixed] = useState<InputSliderRangeValue>(['25', '75']);
  const [coincident, setCoincident] = useState<InputSliderRangeValue>(['25', '75']);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        MinValueDistance измеряется в единицах значения. По умолчанию он равен step. При выборе ползунком сетка step
        может дать больший фактический зазор. Здесь в первых двух примерах задан зазор 10, чтобы отскок был заметнее.
        При перетаскивании сближение свободное, после отпускания слишком близкий ползунок отступает по своей текущей
        роли: нижний влево, верхний вправо. Сосед обычно остаётся на месте.
      </StoryDemoDescription>
      <StoryDemoDescription>
        При разрешённом обмене нижний ползунок из [25, 75] можно довести до 90: он станет верхним, интервал — [75, 90].
        Если вернуться до 78 и отпустить, получится [75, 85]. При запрете обмена нижний остановится на 75, а при
        отпускании отступит до 65. Поля всегда показывают упорядоченную пару.
      </StoryDemoDescription>
      <StoryDemoDescription>
        У края активному ползунку может не хватить места для отступа. Тогда он доходит до допустимого края, а
        недостающий зазор восстанавливается сдвигом соседа. Например, задайте верхнюю границу 95 и перетащите нижний
        ползунок до 100: [95, 100] после отпускания превратится в [90, 100]. Симметрично у min: [0, 5] превращается в
        [0, 10].
      </StoryDemoDescription>
      <StoryDemoDescription>
        Ручной ввод нормализуется на blur с учётом min/max, соседа и зазора. Пустая граница остаётся пустой. Стрелки,
        Home и End учитывают зазор сразу, обмена с клавиатуры нет. После обмена мышью Tab сохраняет физический порядок
        inputs, поэтому первым ползунком в нём может стать верхний. Начальные и внешние значения задавайте с нужным
        зазором: компонент сам их не раздвигает.
      </StoryDemoDescription>
      <StoryDemoItem>
        <StoryDemoDescription>Обмен разрешён, minValueDistance=10</StoryDemoDescription>
        <InputSliderRange
          minValueDistance={10}
          value={swapping}
          onValueChange={setSwapping}
          lowerInputProps={{ prefix: 'От', 'aria-label': 'От, обмен разрешён' }}
          upperInputProps={{ prefix: 'До', 'aria-label': 'До, обмен разрешён' }}
        />
        <StoryDemoDescription role="status" aria-label="Интервал с обменом">
          {JSON.stringify(swapping)}
        </StoryDemoDescription>
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Обмен запрещён, minValueDistance=10</StoryDemoDescription>
        <InputSliderRange
          minValueDistance={10}
          sliderProps={{ allowSwap: false }}
          value={fixed}
          onValueChange={setFixed}
          lowerInputProps={{ prefix: 'От', 'aria-label': 'От, обмен запрещён' }}
          upperInputProps={{ prefix: 'До', 'aria-label': 'До, обмен запрещён' }}
        />
        <StoryDemoDescription role="status" aria-label="Интервал без обмена">
          {JSON.stringify(fixed)}
        </StoryDemoDescription>
      </StoryDemoItem>
      <StoryDemoItem>
        <StoryDemoDescription>Совпадение разрешено, minValueDistance=0</StoryDemoDescription>
        <InputSliderRange
          minValueDistance={0}
          value={coincident}
          onValueChange={setCoincident}
          lowerInputProps={{ prefix: 'От', 'aria-label': 'От, без зазора' }}
          upperInputProps={{ prefix: 'До', 'aria-label': 'До, без зазора' }}
        />
        <StoryDemoDescription role="status" aria-label="Интервал без зазора">
          {JSON.stringify(coincident)}
        </StoryDemoDescription>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

import { useState } from 'react';

import { SliderRange } from '@admiral-ds/admiral3-components';

import { Sample, Samples } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeThumbSwapTemplate = () => {
  const [swappingValue, setSwappingValue] = useState<[number, number]>([25, 75]);
  const [fixedValue, setFixedValue] = useState<[number, number]>([25, 75]);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        AllowSwap управляет обменом ролями при перетаскивании мышью или касанием. По умолчанию true: если нижний
        ползунок из интервала [25, 75] перетащить до 90, он продолжит движение как верхний, а интервал станет [75, 90].
        Удерживаемый DOM-ползунок и его фокус сохраняются. OnChange всегда получает упорядоченную пару [lower, upper].
      </StoryDemoDescription>
      <StoryDemoDescription>
        При allowSwap=false ползунок останавливается на соседнем. Границы могут совпадать: для того же движения
        получится [75, 75]. Минимальный положительный зазор не задаётся.
      </StoryDemoDescription>
      <StoryDemoDescription>
        LowerNativeSliderProps применяются к DOM-инпуту текущей нижней границы, upperNativeSliderProps — к инпуту
        текущей верхней. Например, инпут A сначала нижний и получает lowerNativeSliderProps. После перетаскивания за
        соседа он становится верхним и получает upperNativeSliderProps; инпут B получает lowerNativeSliderProps. Вместе
        с ролью на другой инпут переходят доступное имя, name и обработчики. Сами объекты props не изменяются.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Refs также следуют ролям: после обмена upperNativeSliderRef.current указывает на инпут A, а
        lowerNativeSliderRef.current — на B. Для доступа к актуальной границе читайте ref.current; заранее сохранённая
        ссылка на DOM-элемент продолжит указывать на тот же физический ползунок.
      </StoryDemoDescription>
      <StoryDemoDescription>
        Клавиатура работает одинаково при обоих значениях allowSwap: стрелки изменяют значение на step, Home и End
        перемещают к допустимой границе с учётом соседнего ползунка. Обмена ролями с клавиатуры нет. Tab и Shift+Tab
        сохраняют порядок двух DOM-ползунков, поэтому после обмена мышью или касанием первым в этом порядке может
        оказаться верхний ползунок.
      </StoryDemoDescription>
      <Samples>
        <Sample>
          <StoryDemoDescription>allowSwap=true — обмен разрешён</StoryDemoDescription>
          <SliderRange
            label="Интервал с обменом"
            allowSwap
            showTooltip
            value={swappingValue}
            onChange={setSwappingValue}
            lowerNativeSliderProps={{ 'aria-label': 'Нижняя граница, обмен разрешён' }}
            upperNativeSliderProps={{ 'aria-label': 'Верхняя граница, обмен разрешён' }}
          />
          <StoryDemoDescription role="status" aria-label="Значение с обменом">
            {JSON.stringify(swappingValue)}
          </StoryDemoDescription>
        </Sample>
        <Sample>
          <StoryDemoDescription>allowSwap=false — обмен запрещён</StoryDemoDescription>
          <SliderRange
            label="Интервал без обмена"
            allowSwap={false}
            showTooltip
            value={fixedValue}
            onChange={setFixedValue}
            lowerNativeSliderProps={{ 'aria-label': 'Нижняя граница, обмен запрещён' }}
            upperNativeSliderProps={{ 'aria-label': 'Верхняя граница, обмен запрещён' }}
          />
          <StoryDemoDescription role="status" aria-label="Значение без обмена">
            {JSON.stringify(fixedValue)}
          </StoryDemoDescription>
        </Sample>
      </Samples>
    </StoryDemoContainer>
  );
};

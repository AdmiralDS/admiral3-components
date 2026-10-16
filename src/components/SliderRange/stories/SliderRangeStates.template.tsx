import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeStatesTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Middle — выбран внутренний интервал, Full Range — весь диапазон. Значения могут совпадать, но ползунки не
      пересекаются. Наведение на ползунок включает Hover, удерживание основной кнопки мыши — Press. В Disable
      взаимодействие отключено. При совпадении значений перетаскивается последний использованный ползунок; изначально —
      верхний. Другую границу можно выбрать нажатием на дорожку или клавишами Tab/Shift+Tab. На краях доступен ползунок,
      который может двигаться внутрь шкалы.
    </StoryDemoDescription>
    <Samples>
      {[false, true].flatMap((disabled) =>
        [
          { title: 'Middle', defaultValue: [25, 75] as const },
          { title: 'Full Range', defaultValue: [0, 100] as const },
          { title: 'Совпадающие значения', defaultValue: [50, 50] as const },
          { title: 'Совпадение на минимуме', defaultValue: [0, 0] as const },
          { title: 'Совпадение на максимуме', defaultValue: [100, 100] as const },
        ].map(({ title, defaultValue }) => (
          <Sample key={`${disabled}-${title}`}>
            <StoryDemoDescription>
              {title}
              {disabled ? ' / Disabled' : ''}
            </StoryDemoDescription>
            <SliderRange {...args} disabled={disabled} defaultValue={defaultValue} />
          </Sample>
        )),
      )}
    </Samples>
  </StoryDemoContainer>
);

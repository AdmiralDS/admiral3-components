import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderStoryPlaygroundTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column">
    <StoryDemoDescription>
      Слайдер позволяет выбрать значение из заданного диапазона, перемещая ползунок по горизонтальной шкале.
      HTML-атрибуты и основной ref относятся к контейнеру; атрибуты ползунка задаются через nativeSliderProps, ref —
      через nativeSliderRef.
    </StoryDemoDescription>
    <StoryDemoItem>
      <Slider
        {...args}
        nativeSliderProps={{
          'aria-label': args.label === undefined ? 'Значение' : undefined,
          ...args.nativeSliderProps,
        }}
      />
    </StoryDemoItem>
  </StoryDemoContainer>
);

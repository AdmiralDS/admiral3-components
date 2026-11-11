import { Button, Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const SliderStoryKeyboardTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column">
    <StoryDemoDescription>
      Tab переводит фокус на ползунок. Стрелки вправо и вверх увеличивают значение на шаг, влево и вниз — уменьшают.
      Home выбирает минимум, End — максимум. Нижние подписи выбираются указателем и не входят в порядок Tab; следующий
      Tab переводит фокус за пределы компонента.
    </StoryDemoDescription>
    <StoryDemoItem>
      <Button>До слайдера</Button>
      <Slider label="Громкость" defaultValue={50} {...args} />
      <Button>После слайдера</Button>
    </StoryDemoItem>
  </StoryDemoContainer>
);

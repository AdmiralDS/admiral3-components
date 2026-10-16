import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderStepsTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Slider Steps используется для выбора из набора заданных значений и притягивается к ближайшему к клику значению.
      Здесь показаны 4, 5 и 6 значений; количество можно изменять. Подписи Steps Set расположены под шкалой. Hover и
      Press ползунка и подписей проверяются наведением и нажатием.
    </StoryDemoDescription>
    <Samples>
      {[4, 5, 6].map((count) => (
        <Sample key={count}>
          <StoryDemoDescription>
            {count} {count === 4 ? 'значения' : 'значений'}
          </StoryDemoDescription>
          <Slider
            {...args}
            min={0}
            max={count === 4 ? 150 : (count - 1) * 25}
            defaultValue={count === 4 ? 50 : 25}
            marks={Array.from({ length: count }, (_, index) => index * (count === 4 ? 50 : 25))}
          />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);

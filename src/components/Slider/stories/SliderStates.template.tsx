import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderStatesTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Состояния слайдера: Min, Middle, Max и Disable. Наведите указатель на ползунок для Hover и удерживайте основную
      кнопку мыши для Press. Отключённый слайдер недоступен для взаимодействия.
    </StoryDemoDescription>
    <Samples>
      {[false, true].flatMap((disabled) =>
        [0, 50, 100].map((defaultValue) => (
          <Sample key={`${disabled}-${defaultValue}`}>
            <StoryDemoDescription>
              {defaultValue === 0 ? 'Min' : defaultValue === 100 ? 'Max' : 'Middle'}
              {disabled ? ' / Disabled' : ''}
            </StoryDemoDescription>
            <Slider {...args} defaultValue={defaultValue} disabled={disabled} />
          </Sample>
        )),
      )}
    </Samples>
  </StoryDemoContainer>
);

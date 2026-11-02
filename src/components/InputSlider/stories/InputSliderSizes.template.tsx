import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';
import { INPUT_SLIDER_DIMENSIONS } from '../constants';

export const InputSliderSizesTemplate = (args: InputSliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Поля l и m используют слайдер m. Размеры s и xs используют одноимённый слайдер.
    </StoryDemoDescription>
    {INPUT_SLIDER_DIMENSIONS.map((dimension) => (
      <StoryDemoItem key={dimension}>
        <StoryDemoDescription>Размер {dimension}</StoryDemoDescription>
        <InputSlider
          {...args}
          dimension={dimension}
          inputProps={{ ...args.inputProps, 'aria-label': `Сумма, размер ${dimension}` }}
        />
      </StoryDemoItem>
    ))}
  </StoryDemoContainer>
);

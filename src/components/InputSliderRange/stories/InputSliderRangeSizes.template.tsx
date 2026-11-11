import { InputSliderRange, type InputSliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';
import { INPUT_SLIDER_RANGE_DIMENSIONS } from '../constants';

export const InputSliderRangeSizesTemplate = (args: InputSliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>Поля l и m используют слайдер m; s и xs — одноимённый слайдер.</StoryDemoDescription>
    {INPUT_SLIDER_RANGE_DIMENSIONS.map((dimension) => (
      <StoryDemoItem key={dimension}>
        <StoryDemoDescription>Размер {dimension}</StoryDemoDescription>
        <InputSliderRange
          {...args}
          dimension={dimension}
          lowerInputProps={{ prefix: 'От', ...args.lowerInputProps, 'aria-label': `От, размер ${dimension}` }}
          upperInputProps={{ prefix: 'До', ...args.upperInputProps, 'aria-label': `До, размер ${dimension}` }}
        />
      </StoryDemoItem>
    ))}
  </StoryDemoContainer>
);

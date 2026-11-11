import { SystemLightModeOutline, SystemLightModeSolid } from '@admiral-ds/admiral3-icons';

import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderIconsTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Icon Left и Icon Right — опциональные иконки слева и/или справа от шкалы. Иконки выровнены по строке ползунка,
      отдельно от подписи и границ диапазона.
    </StoryDemoDescription>
    <Samples>
      {[
        { title: 'Слева', iconStart: <SystemLightModeSolid /> },
        { title: 'Справа', iconEnd: <SystemLightModeOutline /> },
        { title: 'С обеих сторон', iconStart: <SystemLightModeSolid />, iconEnd: <SystemLightModeOutline /> },
      ].map(({ title, iconStart, iconEnd }) => (
        <Sample key={title}>
          <StoryDemoDescription>{title}</StoryDemoDescription>
          <Slider {...args} iconStart={iconStart} iconEnd={iconEnd} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);

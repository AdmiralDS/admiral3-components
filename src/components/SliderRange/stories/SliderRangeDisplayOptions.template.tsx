import { SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderRangeStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderRangeDisplayOptionsTemplate = (args: SliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Label — поясняющая подпись сверху слева; Value — выбранный интервал сверху справа, доступный только вместе с
      Label; Range — границы допустимых значений под шкалой. Опции можно комбинировать. renderMarks=null скрывает нижние
      подписи; renderValue=null скрывает верхний интервал, сохраняя числовые Tooltip при showTooltip=true.
    </StoryDemoDescription>
    <Samples>
      {[
        { title: 'Без Label', props: { label: undefined } },
        { title: 'Без Value', props: { renderValue: null } },
        { title: 'Без Range', props: { renderMarks: null } },
        { title: 'Только SliderRange', props: { label: undefined, renderMarks: null } },
      ].map(({ title, props }) => (
        <Sample key={title}>
          <StoryDemoDescription>{title}</StoryDemoDescription>
          <SliderRange {...args} {...props} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);

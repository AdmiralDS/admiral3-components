import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const SliderDisplayOptionsTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Опции можно комбинировать: Label — поясняющая подпись сверху слева; Value — выбранное значение сверху справа,
      доступное только вместе с Label; Range — границы диапазона снизу. Нижние подписи скрываются через
      renderMarks=null; renderValue=null скрывает верхнее значение, сохраняя числовой Tooltip при showTooltip=true.
    </StoryDemoDescription>
    <Samples>
      {[
        { title: 'Без Label', props: { label: undefined } },
        { title: 'Без Value', props: { renderValue: null } },
        { title: 'Без Range', props: { renderMarks: null } },
        { title: 'Только Slider', props: { label: undefined, renderMarks: null } },
      ].map(({ title, props }) => (
        <Sample key={title}>
          <StoryDemoDescription>{title}</StoryDemoDescription>
          <Slider {...args} nativeSliderProps={{ 'aria-label': 'Громкость', ...args.nativeSliderProps }} {...props} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);

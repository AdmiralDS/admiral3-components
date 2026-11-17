import { Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { Samples, Sample } from './SliderStories.style';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const textLabels: Record<number, string> = { 0: 'Нет', 25: 'Мало', 50: 'Средне', 75: 'Много', 100: 'Все' };

export const SliderMarksTemplate = (args: SliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Отметки могут иметь числовые или текстовые подписи и неравномерные позиции. При наличии marks дорожка
      автоматически становится прерывистой. Выбирать можно только переданные отметки; step не влияет на выбор. Границы
      min/max доступны для выбора только тогда, когда они включены в marks. Подписи, включая min/max, задаются через
      renderMarks: undefined выводит число, null скрывает нижнюю строку, функция возвращает ReactNode для каждого
      значения. renderValue независимо задаёт выбранное значение и Tooltip.
    </StoryDemoDescription>
    <Samples>
      {[
        {
          title: 'Числовые подписи',
          marks: [0, 25, 50, 75, 100],
        },
        {
          title: 'Текстовые подписи',
          marks: [0, 25, 50, 75, 100],
          renderMarks: (value: number) => textLabels[value],
        },
        {
          title: 'Неравномерные шаги',
          marks: [0, 10, 40, 70, 100],
        },
        {
          title: 'Точки выбора без нижних подписей',
          marks: [0, 25, 50, 75, 100],
          renderMarks: null,
        },
        {
          title: 'Только подписи min/max',
          marks: [0, 25, 50, 75, 100],
          renderMarks: (value: number) => (value === 0 || value === 100 ? String(value) : null),
        },
        {
          title: 'Произвольное содержимое значения и подписей',
          marks: [0, 25, 50, 75, 100],
          renderValue: (value: number) => <strong>{value} ₽</strong>,
          renderMarks: (value: number) => <span>{value} ₽</span>,
        },
      ].map(({ title, ...props }) => (
        <Sample key={title}>
          <StoryDemoDescription>{title}</StoryDemoDescription>
          <Slider {...args} min={0} max={100} defaultValue={40} {...props} />
        </Sample>
      ))}
    </Samples>
  </StoryDemoContainer>
);

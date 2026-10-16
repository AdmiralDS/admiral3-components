import { useState } from 'react';
import type { SubmitEvent } from 'react';

import styled from 'styled-components';

import { Button, SliderRange, type SliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const NativeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SliderRangeStoryNativeFormTemplate = (args: SliderRangeProps) => {
  const [submitted, setSubmitted] = useState<string>();
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(`${data.get('from')} — ${data.get('to')}`);
  };
  return (
    <StoryDemoContainer $direction="column">
      <StoryDemoDescription>
        Каждый ползунок отправляет своё значение вместе с формой. Сброс восстанавливает начальный интервал.
      </StoryDemoDescription>
      <StoryDemoItem>
        <NativeForm onSubmit={handleSubmit}>
          <SliderRange
            {...args}
            defaultValue={[25, 75]}
            lowerNativeSliderProps={{ ...args.lowerNativeSliderProps, name: 'from' }}
            upperNativeSliderProps={{ ...args.upperNativeSliderProps, name: 'to' }}
          />
          <Button type="submit">Отправить</Button>
          <Button type="reset">Сбросить</Button>
          {submitted !== undefined && <output>Сохранено: {submitted}</output>}
        </NativeForm>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

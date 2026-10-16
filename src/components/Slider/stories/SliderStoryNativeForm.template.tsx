import { useState } from 'react';
import type { SubmitEvent } from 'react';

import styled from 'styled-components';

import { Button, Slider, type SliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const NativeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SliderStoryNativeFormTemplate = (args: SliderProps) => {
  const [submitted, setSubmitted] = useState<string>();
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get('volume')));
  };
  return (
    <StoryDemoContainer $direction="column">
      <StoryDemoDescription>
        Нативное поле отправляет выбранное значение вместе с формой. Сброс восстанавливает начальное значение.
      </StoryDemoDescription>
      <StoryDemoItem>
        <NativeForm onSubmit={handleSubmit}>
          <Slider
            label="Громкость"
            defaultValue={50}
            {...args}
            nativeSliderProps={{ ...args.nativeSliderProps, name: 'volume' }}
          />
          <Button type="submit">Отправить</Button>
          <Button type="reset">Сбросить</Button>
          {submitted !== undefined && <output>Сохранено: {submitted}</output>}
        </NativeForm>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

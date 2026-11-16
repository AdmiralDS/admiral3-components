import { useState } from 'react';

import { Button, InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderControlledTemplate = (args: InputSliderProps) => {
  const [value, setValue] = useState('50');
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Value хранит числовую строку без форматирования. OnValueChange передаёт исходную строку или пустую строку при
        очистке; изменение value извне обновляет поле и положение слайдера.
      </StoryDemoDescription>
      <StoryDemoItem>
        <InputSlider
          {...args}
          inputProps={{ 'aria-label': 'Значение', ...args.inputProps }}
          value={value}
          onValueChange={setValue}
        />
        <StoryDemoDescription>Выбрано: {value || 'пусто'}</StoryDemoDescription>
        <Button type="button" onClick={() => setValue('25')}>
          Установить 25
        </Button>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

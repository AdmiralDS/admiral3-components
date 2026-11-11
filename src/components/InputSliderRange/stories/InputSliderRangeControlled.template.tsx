import { useState } from 'react';

import { Button, InputSliderRange, type InputSliderRangeValue } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderRangeControlledTemplate = () => {
  const [value, setValue] = useState<InputSliderRangeValue>(['25', '75']);
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Оба редактора и ползунка обновляют общую пару через onValueChange. Внешнее value имеет приоритет над вводом.
      </StoryDemoDescription>
      <StoryDemoItem>
        <InputSliderRange
          value={value}
          onValueChange={setValue}
          lowerInputProps={{ 'aria-label': 'От', showClearIcon: true }}
          upperInputProps={{ 'aria-label': 'До', showClearIcon: true }}
        />
        <StoryDemoDescription role="status" aria-label="Исходный интервал">
          {JSON.stringify(value)}
        </StoryDemoDescription>
        <Button onClick={() => setValue(['10', '90'])}>Установить 10–90</Button>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

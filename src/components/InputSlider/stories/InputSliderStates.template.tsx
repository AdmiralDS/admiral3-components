import { InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderStatesTemplate = (args: InputSliderProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Disabled отключает поле и слайдер. В readOnly остаётся поле, в котором можно выделить и скопировать число. Статусы
      error и success относятся к полю ввода и не заменяют нативную валидацию.
    </StoryDemoDescription>
    <StoryDemoItem>
      <StoryDemoDescription>Обычное состояние</StoryDemoDescription>
      <InputSlider {...args} inputProps={{ ...args.inputProps, 'aria-label': 'Обычное поле' }} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Disabled — недоступно</StoryDemoDescription>
      <InputSlider {...args} disabled inputProps={{ ...args.inputProps, 'aria-label': 'Недоступное поле' }} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>ReadOnly — только чтение</StoryDemoDescription>
      <InputSlider {...args} readOnly inputProps={{ ...args.inputProps, 'aria-label': 'Только чтение' }} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Error — ошибка</StoryDemoDescription>
      <InputSlider {...args} status="error" inputProps={{ ...args.inputProps, 'aria-label': 'Поле с ошибкой' }} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Success — успешно</StoryDemoDescription>
      <InputSlider {...args} status="success" inputProps={{ ...args.inputProps, 'aria-label': 'Поле с успехом' }} />
    </StoryDemoItem>
  </StoryDemoContainer>
);

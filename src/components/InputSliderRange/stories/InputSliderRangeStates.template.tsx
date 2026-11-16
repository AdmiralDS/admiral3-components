import { InputSliderRange, type InputSliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const states = [
  { label: 'Обычное состояние', props: {} },
  { label: 'Disabled — недоступно', props: { disabled: true } },
  { label: 'ReadOnly — только чтение', props: { readOnly: true } },
  { label: 'Error — ошибка', props: { status: 'error' } },
  { label: 'Success — успешно', props: { status: 'success' } },
] satisfies { label: string; props: InputSliderRangeProps }[];

export const InputSliderRangeStatesTemplate = (args: InputSliderRangeProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Общие состояния распространяются на оба поля. В readOnly слайдер скрыт; значения можно выделить и скопировать.
    </StoryDemoDescription>
    {states.map(({ label, props }) => (
      <StoryDemoItem key={label}>
        <StoryDemoDescription>{label}</StoryDemoDescription>
        <InputSliderRange
          {...args}
          {...props}
          lowerInputProps={{ ...args.lowerInputProps, 'aria-label': `От: ${label}` }}
          upperInputProps={{ ...args.upperInputProps, 'aria-label': `До: ${label}` }}
        />
      </StoryDemoItem>
    ))}
  </StoryDemoContainer>
);

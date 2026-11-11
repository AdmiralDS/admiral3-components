import { useId } from 'react';

import { FormItem, InputSliderRange, type InputSliderRangeProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderRangeFormItemTemplate = (args: InputSliderRangeProps) => {
  const id = useId();
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        FormItem добавляет общую подпись и пояснение снаружи. Его размер, состояния, status и required применяются к
        обоим полям. У каждой границы своё доступное имя; общая подпись и пояснение доступны всем четырём редакторам.
      </StoryDemoDescription>
      <StoryDemoItem>
        <FormItem
          label={<span id={`${id}-label`}>Диапазон суммы</span>}
          htmlFor={`${id}-lower`}
          dimension={args.dimension}
          disabled={args.disabled}
          readOnly={args.readOnly}
          status={args.status}
          required={args.required}
          description={<span id={`${id}-description`}>Выберите нижнюю и верхнюю границы от 0 до 100 ₽.</span>}
        >
          <InputSliderRange
            {...args}
            role="group"
            aria-labelledby={`${id}-label`}
            lowerInputProps={{
              ...args.lowerInputProps,
              id: `${id}-lower`,
              'aria-label': 'Сумма от',
              'aria-describedby': `${id}-description`,
              prefix: 'От',
              suffix: '₽',
            }}
            upperInputProps={{
              ...args.upperInputProps,
              id: `${id}-upper`,
              'aria-label': 'Сумма до',
              'aria-describedby': `${id}-description`,
              prefix: 'До',
              suffix: '₽',
            }}
          />
        </FormItem>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

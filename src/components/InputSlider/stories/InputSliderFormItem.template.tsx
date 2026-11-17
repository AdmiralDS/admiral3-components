import { useId } from 'react';

import { FormItem, InputSlider, type InputSliderProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const InputSliderFormItemTemplate = (args: InputSliderProps) => {
  const id = useId();
  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        FormItem добавляет подпись и пояснение снаружи InputSlider. Его размер, disabled и readOnly распространяются на
        обе части композиции. Статус и required передаются полю ввода.
      </StoryDemoDescription>
      <StoryDemoItem>
        <FormItem
          label={<span id={`${id}-label`}>Сумма</span>}
          htmlFor={id}
          dimension={args.dimension}
          disabled={args.disabled}
          readOnly={args.readOnly}
          status={args.status}
          required={args.required}
          description={<span id={`${id}-description`}>Выберите сумму от 0 до 100 ₽.</span>}
        >
          <InputSlider
            {...args}
            inputProps={{ ...args.inputProps, id, 'aria-describedby': `${id}-description`, suffix: '₽' }}
            sliderProps={{ nativeSliderProps: { 'aria-labelledby': `${id}-label` } }}
          />
        </FormItem>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

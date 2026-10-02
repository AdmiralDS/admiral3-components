import { FormItem, TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaWithFormItemTemplate = ({
  dimension,
  status,
  disabled,
  readOnly,
  required,
  maxLength = 100,
  ...args
}: TextAreaProps = {}) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Подпись, дополнительное пояснение и счётчик добавляются через <code>FormItem</code>. Пояснение под полем
      опционально. Свойство <code>maxLength</code> задаёт ограничение длины и включает счётчик. По умолчанию счётчик
      появляется при достижении 80% от максимального количества символов; порог настраивается через{' '}
      <code>counterThreshold</code>.
    </StoryDemoDescription>
    <StoryDemoItem>
      <FormItem
        htmlFor="text-area-message"
        label="Сообщение"
        description={`До ${maxLength} символов`}
        dimension={dimension}
        status={status}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
      >
        <TextArea
          defaultValue="Привет!"
          autoHeight
          minRows={2}
          maxRows={5}
          showClearIcon
          {...args}
          id="text-area-message"
          name="message"
        />
      </FormItem>
    </StoryDemoItem>
  </StoryDemoContainer>
);

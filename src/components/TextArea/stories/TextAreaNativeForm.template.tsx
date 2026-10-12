import { useState } from 'react';

import { Button, FormItem, TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaNativeFormTemplate = ({
  dimension,
  status,
  disabled,
  readOnly,
  required = true,
  maxLength = 30,
  ...args
}: TextAreaProps = {}) => {
  const [submitted, setSubmitted] = useState('');
  return (
    <StoryDemoContainer>
      <StoryDemoItem
        as="form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('message')));
        }}
      >
        <FormItem
          htmlFor="native-message"
          label="Сообщение"
          dimension={dimension}
          status={status}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          counterThreshold={0}
        >
          <TextArea defaultValue="Initial" showClearIcon {...args} id="native-message" name="message" />
        </FormItem>
        <Button type="submit">Отправить</Button>
        <Button type="reset" appearance="outline">
          Сбросить
        </Button>
        <output aria-label="Отправленный текст">{submitted}</output>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

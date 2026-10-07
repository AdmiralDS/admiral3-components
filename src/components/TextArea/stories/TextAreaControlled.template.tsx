import { useState } from 'react';

import { Button, FormItem, TextArea, type TextAreaProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoItem } from '../../stories/StoryContainers';

export const TextAreaControlledTemplate = ({
  dimension,
  status,
  disabled,
  readOnly,
  required,
  maxLength = 100,
  ...args
}: TextAreaProps = {}) => {
  const [value, setValue] = useState('Initial');
  return (
    <StoryDemoContainer>
      <StoryDemoItem>
        <FormItem
          htmlFor="controlled-message"
          label="Сообщение"
          dimension={dimension}
          status={status}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          counterThreshold={0}
        >
          <TextArea
            autoHeight
            minRows={2}
            maxRows={4}
            showClearIcon
            {...args}
            id="controlled-message"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormItem>
        <Button type="button" onClick={() => setValue('One\nTwo\nThree')}>
          Задать текст
        </Button>
      </StoryDemoItem>
    </StoryDemoContainer>
  );
};

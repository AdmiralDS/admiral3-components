import { useId } from 'react';

import styled from 'styled-components';

import { FormItem, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const NativeTextarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  font: inherit;
  resize: vertical;
`;

export const FormItemNativeTextareaTemplate = (args: FormItemProps) => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const hasDescription = hasSlotContent(args.description);

  return (
    <StoryDemoContainer $direction="column" $gap="24px">
      <StoryDemoDescription>
        Нативным и сторонним контролам настройки передаются вручную; для ошибки укажите <code>aria-invalid</code>.
      </StoryDemoDescription>
      <FormItem
        {...args}
        htmlFor={id}
        description={hasDescription ? <span id={descriptionId}>{args.description}</span> : undefined}
      >
        <NativeTextarea
          id={id}
          name="comment"
          rows={3}
          required={args.required}
          disabled={args.disabled}
          readOnly={args.readOnly}
          aria-invalid={args.status === 'error' || undefined}
          aria-label={hasSlotContent(args.label) ? undefined : 'Комментарий'}
          aria-describedby={hasDescription ? descriptionId : undefined}
        />
      </FormItem>
    </StoryDemoContainer>
  );
};

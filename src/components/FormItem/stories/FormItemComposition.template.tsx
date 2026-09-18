import { useId } from 'react';

import styled from 'styled-components';

import { FormItem, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';

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
        aria-invalid={args.status === 'error' || undefined}
        aria-label={hasSlotContent(args.label) ? undefined : 'Комментарий'}
        aria-describedby={hasDescription ? descriptionId : undefined}
      />
    </FormItem>
  );
};

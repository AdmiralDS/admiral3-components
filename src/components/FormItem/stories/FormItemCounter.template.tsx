import { useState } from 'react';

import styled from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { cssToken } from '../../../theme/cssToken';
import { hasSlotContent } from '../../../utils/hasSlotContent';

const errorColor = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);

const CounterText = styled.span<{ $limitReached: boolean }>`
  color: ${({ $limitReached, theme }) => ($limitReached ? errorColor({ theme }) : 'inherit')};
`;

export const FormItemCounterTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  const maxLength = 20;
  const [value, setValue] = useState('Пример названия №1');
  const count = value.length;

  return (
    <FormItem
      {...args}
      htmlFor="form-item-counter-input"
      description={hasDescription ? <span id="form-item-counter-description">{args.description}</span> : undefined}
      counter={
        count >= maxLength * 0.8 ? (
          <CounterText $limitReached={count >= maxLength}>
            {count} / {maxLength}
          </CounterText>
        ) : null
      }
    >
      <Input
        id="form-item-counter-input"
        aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
        aria-describedby={hasDescription ? 'form-item-counter-description' : undefined}
        showClearIcon
        maxLength={maxLength}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </FormItem>
  );
};

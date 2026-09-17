import { useState } from 'react';

import styled from 'styled-components';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { cssToken } from '../../../theme/cssToken';
import { hasSlotContent } from '../../../utils/hasSlotContent';

const errorColor = cssToken('--admiral-color-error-text-1-rest', (theme) => theme.color.error.text._1.rest);

const CounterText = styled.span<{ $limitReached: boolean }>`
  color: ${({ $limitReached, theme }) => ($limitReached ? errorColor({ theme }) : 'inherit')};
`;

export const FormItemPlaygroundTemplate = (args: FormItemProps) => {
  const hasDescription = hasSlotContent(args.description);
  return (
    <FormItem
      {...args}
      htmlFor="form-item-playground-input"
      description={hasDescription ? <span id="form-item-playground-description">{args.description}</span> : undefined}
    >
      <Input
        id="form-item-playground-input"
        dimension={args.dimension}
        placeholder="Введите значение"
        status={args.status}
        required={args.required}
        disabled={args.disabled}
        aria-describedby={hasDescription ? 'form-item-playground-description' : undefined}
      />
    </FormItem>
  );
};

export const FormItemErrorTemplate = () => (
  <FormItem
    label="Электронная почта"
    htmlFor="form-item-error-email"
    status="error"
    description={<span id="form-item-error-email-message">Введите корректный адрес</span>}
    required
  >
    <Input
      id="form-item-error-email"
      type="email"
      name="email"
      status="error"
      defaultValue="invalid"
      aria-invalid
      required
      aria-describedby="form-item-error-email-message"
    />
  </FormItem>
);

export const FormItemSuccessTemplate = () => (
  <FormItem
    label="Электронная почта"
    htmlFor="form-item-success-email"
    status="success"
    description={<span id="form-item-success-email-message">Адрес подтверждён</span>}
  >
    <Input
      id="form-item-success-email"
      type="email"
      name="email"
      status="success"
      defaultValue="name@example.com"
      aria-describedby="form-item-success-email-message"
    />
  </FormItem>
);

export const FormItemXsTemplate = () => (
  <FormItem
    dimension="xs"
    label="Электронная почта"
    htmlFor="form-item-xs-email"
    description={<span id="form-item-xs-description">Укажите рабочий адрес</span>}
  >
    <Input
      id="form-item-xs-email"
      dimension="xs"
      type="email"
      name="email"
      aria-describedby="form-item-xs-description"
    />
  </FormItem>
);

export const FormItemCounterTemplate = () => {
  const maxLength = 20;
  const [value, setValue] = useState('');
  const count = value.length;

  return (
    <FormItem
      label="Название"
      htmlFor="form-item-counter-input"
      description={<span id="form-item-counter-description">Не более 20 символов</span>}
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
        aria-describedby="form-item-counter-description"
        maxLength={maxLength}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </FormItem>
  );
};

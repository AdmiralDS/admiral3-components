import { useId, useRef, useState } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';
import { useForm } from '@tanstack/react-form';
import styled from 'styled-components';

import {
  Button,
  CheckBox,
  FormItem,
  Input,
  InputSlider,
  InputSliderRange,
  InputIconPasswordButton,
  RadioButton,
  RadioGroup,
  Toggle,
  TextArea,
} from '@admiral-ds/admiral3-components';

type FormValues = {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  website: string;
  comment: string;
  amount: string;
  amountFrom: string;
  amountTo: string;
  delivery: string;
  agreement: boolean;
  notifications: boolean;
};

const defaultValues: FormValues = {
  name: '',
  password: '',
  confirmPassword: '',
  email: '',
  website: '',
  comment: '',
  amount: '10000.5',
  amountFrom: '10000.5',
  amountTo: '15000',
  delivery: 'courier',
  agreement: false,
  notifications: true,
};

const amountFormatter = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatAmount = (value: number) => amountFormatter.format(value);
const parseAmount = (text: string) => Number(text.replace(/\s/g, '').replace(',', '.'));

const Page = styled.div`
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 100%;
  padding: 32px;
  background-color: var(--admiral-color-neutral-base-2-rest);
`;

const Form = styled.form`
  inline-size: min(100%, 560px);
  margin: 0 auto;
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 16px;
  background-color: var(--admiral-color-neutral-base-1-rest);
`;

const Title = styled.h2`
  ${textStyles.subtitle.subtitle3}
  margin: 0;
  color: var(--admiral-color-neutral-text-1-rest);
`;

const Description = styled.p`
  ${textStyles.body.body2Long}
  margin: -16px 0 0;
  color: var(--admiral-color-neutral-text-2-rest);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ErrorText = styled.span`
  ${textStyles.body.body2Long}
  color: var(--admiral-color-error-text-1-rest);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Result = styled.pre`
  ${textStyles.body.body2Long}
  box-sizing: border-box;
  max-inline-size: 100%;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border-radius: 8px;
  color: var(--admiral-color-neutral-text-1-rest);
  background-color: var(--admiral-color-neutral-base-2-rest);
`;

export const TanStackFormWithFormItemTemplate = () => {
  const idPrefix = useId();
  const amountId = `${idPrefix}-amount`;
  const amountInputRef = useRef<HTMLInputElement>(null);
  const rangeId = `${idPrefix}-amount-range`;
  const amountFromRef = useRef<HTMLInputElement>(null);
  const amountToRef = useRef<HTMLInputElement>(null);
  const validateAmount = (value: string) => {
    if (!value) return 'Введите сумму';
    return amountInputRef.current?.validationMessage || undefined;
  };
  const nameId = `${idPrefix}-tanstack-name`;
  const passwordId = `${idPrefix}-tanstack-password`;
  const confirmPasswordId = `${idPrefix}-tanstack-confirm-password`;
  const emailId = `${idPrefix}-tanstack-email`;
  const websiteId = `${idPrefix}-tanstack-website`;
  const commentId = `${idPrefix}-tanstack-comment`;
  const agreementErrorId = `${idPrefix}-tanstack-agreement-error`;
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => setSubmittedValues(value),
    onSubmitInvalid: ({ formApi }) => {
      if (formApi.getFieldMeta('amount')?.errors.length) amountInputRef.current?.focus();
      else if (formApi.getFieldMeta('amountFrom')?.errors.length) amountFromRef.current?.focus();
      else if (formApi.getFieldMeta('amountTo')?.errors.length) amountToRef.current?.focus();
    },
  });

  const handleReset = () => {
    form.reset();
    amountInputRef.current?.form?.reset();
    setSubmittedValues(null);
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
  };

  return (
    <Page>
      <Form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <Title>Регистрационная форма</Title>
        <Description>
          Пример интеграции компонентов Admiral 3 с TanStack Form. Поля подключены через form.Field, значения и
          обработчики передаются явно, включая поле со счётчиком. InputSlider хранит сумму без форматирования. Его
          нативная валидность связана с валидатором TanStack, а сброс библиотеки — со сбросом нативной формы.
          InputSliderRange подключён к двум form.Field: amountFrom и amountTo — отдельные строки и в библиотеке, и в
          FormData. Обе границы проверяются после ввода и blur, даже если исходное значение не изменилось.
        </Description>

        <form.Field name="name" validators={{ onChange: ({ value }) => (value.trim() ? undefined : 'Введите имя') }}>
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            return (
              <FormItem
                label="Имя"
                htmlFor={nameId}
                required
                status={error ? 'error' : undefined}
                description={error ? <span id={`${nameId}-error`}>{error}</span> : undefined}
              >
                <Input
                  aria-required
                  id={nameId}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  type="text"
                  showClearIcon
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  status={error ? 'error' : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${nameId}-error` : undefined}
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Введите пароль' : value.length < 8 ? 'Пароль должен содержать не менее 8 символов' : undefined,
          }}
        >
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            const success = !error && field.state.value.length >= 8 ? 'Пароль соответствует требованиям' : undefined;
            return (
              <FormItem
                label="Пароль"
                htmlFor={passwordId}
                required
                status={error ? 'error' : success ? 'success' : undefined}
                description={
                  error ? (
                    <span id={`${passwordId}-error`}>{error}</span>
                  ) : success ? (
                    <span id={`${passwordId}-success`}>{success}</span>
                  ) : undefined
                }
              >
                <Input
                  aria-required
                  id={passwordId}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  type={passwordVisible ? 'text' : 'password'}
                  showClearIcon
                  iconsAfter={
                    <InputIconPasswordButton
                      visible={passwordVisible}
                      onVisibleChange={setPasswordVisible}
                      preventFocus={false}
                    />
                  }
                  placeholder="Не менее 8 символов"
                  autoComplete="new-password"
                  status={error ? 'error' : success ? 'success' : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${passwordId}-error` : success ? `${passwordId}-success` : undefined}
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) =>
              !value
                ? 'Повторите пароль'
                : value !== fieldApi.form.getFieldValue('password')
                  ? 'Пароли не совпадают'
                  : undefined,
          }}
        >
          {(field) => {
            const error = field.state.meta.isTouched ? field.state.meta.errors.join(', ') || undefined : undefined;
            const success =
              !error && field.state.value.length >= 8 && field.state.value === form.getFieldValue('password')
                ? 'Пароли совпадают'
                : undefined;
            return (
              <FormItem
                label="Повторите пароль"
                htmlFor={confirmPasswordId}
                required
                status={error ? 'error' : success ? 'success' : undefined}
                description={
                  error ? (
                    <span id={`${confirmPasswordId}-error`}>{error}</span>
                  ) : success ? (
                    <span id={`${confirmPasswordId}-success`}>{success}</span>
                  ) : undefined
                }
              >
                <Input
                  aria-required
                  id={confirmPasswordId}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  showClearIcon
                  iconsAfter={
                    <InputIconPasswordButton
                      visible={confirmPasswordVisible}
                      onVisibleChange={setConfirmPasswordVisible}
                      preventFocus={false}
                    />
                  }
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                  status={error ? 'error' : success ? 'success' : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? `${confirmPasswordId}-error` : success ? `${confirmPasswordId}-success` : undefined
                  }
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Введите электронную почту'
                : /^\S+@\S+\.\S+$/.test(value)
                  ? undefined
                  : 'Введите корректный адрес электронной почты',
          }}
        >
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            return (
              <FormItem
                label="Электронная почта"
                htmlFor={emailId}
                required
                status={error ? 'error' : undefined}
                description={error ? <span id={`${emailId}-error`}>{error}</span> : undefined}
              >
                <Input
                  aria-required
                  id={emailId}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  type="email"
                  showClearIcon
                  placeholder="name@example.com"
                  autoComplete="email"
                  status={error ? 'error' : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${emailId}-error` : undefined}
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="website"
          validators={{
            onChange: ({ value }) =>
              !value || /^https?:\/\/.+/.test(value) ? undefined : 'Адрес должен начинаться с http:// или https://',
          }}
        >
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            return (
              <FormItem
                label="Сайт"
                htmlFor={websiteId}
                status={error ? 'error' : undefined}
                description={error ? <span id={`${websiteId}-error`}>{error}</span> : undefined}
              >
                <Input
                  id={websiteId}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  type="url"
                  showClearIcon
                  placeholder="https://example.com"
                  autoComplete="url"
                  status={error ? 'error' : undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${websiteId}-error` : undefined}
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="amount"
          validators={{
            onChange: ({ value }) => validateAmount(value),
          }}
        >
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            return (
              <FormItem
                label={<span id={`${amountId}-label`}>Сумма</span>}
                htmlFor={amountId}
                required
                status={error ? 'error' : undefined}
                description={error ? <span id={`${amountId}-error`}>{error}</span> : undefined}
              >
                <InputSlider
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  onBlur={() => {
                    field.handleBlur();
                    void field.validate('change');
                  }}
                  nativeInputRef={amountInputRef}
                  required
                  min={0}
                  max={20_000}
                  step={0.01}
                  formatValue={formatAmount}
                  parseValue={parseAmount}
                  status={error ? 'error' : undefined}
                  inputProps={{
                    id: amountId,
                    'aria-labelledby': `${amountId}-label`,
                    inputMode: 'decimal',
                    suffix: '₽',
                    showClearIcon: true,
                    'aria-describedby': error ? `${amountId}-error` : undefined,
                    onInput: () => {
                      field.setMeta((meta) => ({ ...meta, isTouched: true }));
                      void field.validate('change');
                    },
                  }}
                />
              </FormItem>
            );
          }}
        </form.Field>

        <form.Field
          name="amountFrom"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Введите нижнюю сумму' : amountFromRef.current?.validationMessage || undefined,
          }}
        >
          {(fromField) => (
            <form.Field
              name="amountTo"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Введите верхнюю сумму' : amountToRef.current?.validationMessage || undefined,
              }}
            >
              {(toField) => {
                const rangeError =
                  [...fromField.state.meta.errors, ...toField.state.meta.errors].join(', ') || undefined;
                const validateRange = () => {
                  void fromField.validate('change');
                  void toField.validate('change');
                };
                const handleRangeChange = ([from, to]: [string, string]) => {
                  if (from !== fromField.state.value) fromField.handleChange(from);
                  if (to !== toField.state.value) toField.handleChange(to);
                  validateRange();
                };
                return (
                  <FormItem
                    label={<span id={`${rangeId}-label`}>Диапазон суммы</span>}
                    htmlFor={`${rangeId}-from`}
                    required
                    status={rangeError ? 'error' : undefined}
                    description={rangeError ? <span id={`${rangeId}-error`}>{rangeError}</span> : undefined}
                  >
                    <InputSliderRange
                      role="group"
                      aria-labelledby={`${rangeId}-label`}
                      lowerName={fromField.name}
                      upperName={toField.name}
                      value={[fromField.state.value, toField.state.value]}
                      onValueChange={handleRangeChange}
                      lowerNativeInputRef={amountFromRef}
                      upperNativeInputRef={amountToRef}
                      required
                      min={0}
                      max={20_000}
                      step={0.01}
                      formatValue={formatAmount}
                      parseValue={parseAmount}
                      status={rangeError ? 'error' : undefined}
                      lowerInputProps={{
                        id: `${rangeId}-from`,
                        'aria-label': 'Сумма от',
                        'aria-describedby': rangeError ? `${rangeId}-error` : undefined,
                        prefix: 'От',
                        suffix: '₽',
                        inputMode: 'decimal',
                        showClearIcon: true,
                        onInput: () => {
                          fromField.setMeta((meta) => ({ ...meta, isTouched: true }));
                          validateRange();
                        },
                        onBlur: () => {
                          fromField.handleBlur();
                          validateRange();
                        },
                      }}
                      upperInputProps={{
                        id: `${rangeId}-to`,
                        'aria-label': 'Сумма до',
                        'aria-describedby': rangeError ? `${rangeId}-error` : undefined,
                        prefix: 'До',
                        suffix: '₽',
                        inputMode: 'decimal',
                        showClearIcon: true,
                        onInput: () => {
                          toField.setMeta((meta) => ({ ...meta, isTouched: true }));
                          validateRange();
                        },
                        onBlur: () => {
                          toField.handleBlur();
                          validateRange();
                        },
                      }}
                      sliderProps={{
                        lowerNativeSliderProps: {
                          onBlur: () => {
                            fromField.handleBlur();
                            validateRange();
                          },
                        },
                        upperNativeSliderProps: {
                          onBlur: () => {
                            toField.handleBlur();
                            validateRange();
                          },
                        },
                      }}
                    />
                  </FormItem>
                );
              }}
            </form.Field>
          )}
        </form.Field>

        <form.Field name="comment">
          {(field) => (
            <FormItem label="Комментарий" htmlFor={commentId} maxLength={50} counterThreshold={0}>
              <TextArea
                id={commentId}
                name={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                maxLength={50}
                showClearIcon
                autoHeight
                minRows={2}
                maxRows={5}
                placeholder="Добавьте комментарий"
              />
            </FormItem>
          )}
        </form.Field>

        <form.Field name="delivery">
          {(field) => (
            <RadioGroup
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              legend="Способ доставки"
            >
              <RadioButton value="courier">Курьером</RadioButton>
              <RadioButton value="pickup">Самовывоз</RadioButton>
            </RadioGroup>
          )}
        </form.Field>

        <form.Field
          name="agreement"
          validators={{ onChange: ({ value }) => (value ? undefined : 'Необходимо принять условия') }}
        >
          {(field) => {
            const error = field.state.meta.errors.join(', ') || undefined;
            return (
              <Field>
                <CheckBox
                  name={field.name}
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                  onBlur={field.handleBlur}
                  error={Boolean(error)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? agreementErrorId : undefined}
                >
                  Я принимаю условия использования
                </CheckBox>
                {error && <ErrorText id={agreementErrorId}>{error}</ErrorText>}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="notifications">
          {(field) => (
            <Toggle
              name={field.name}
              checked={field.state.value}
              onChange={(event) => field.handleChange(event.target.checked)}
              onBlur={field.handleBlur}
            >
              Получать уведомления
            </Toggle>
          )}
        </form.Field>

        <Actions>
          <Button type="submit">Отправить</Button>
          <Button type="button" appearance="outline" onClick={handleReset}>
            Сбросить
          </Button>
        </Actions>

        {submittedValues && <Result aria-live="polite">{JSON.stringify(submittedValues, null, 2)}</Result>}
      </Form>
    </Page>
  );
};

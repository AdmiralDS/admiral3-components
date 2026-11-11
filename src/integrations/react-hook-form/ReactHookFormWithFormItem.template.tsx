import { useId, useRef, useState } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';
import { Controller, useController, useForm, useWatch } from 'react-hook-form';
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

export const ReactHookFormWithFormItemTemplate = () => {
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
  const nameId = `${idPrefix}-rhf-name`;
  const passwordId = `${idPrefix}-rhf-password`;
  const confirmPasswordId = `${idPrefix}-rhf-confirm-password`;
  const emailId = `${idPrefix}-rhf-email`;
  const websiteId = `${idPrefix}-rhf-website`;
  const commentId = `${idPrefix}-rhf-comment`;
  const agreementErrorId = `${idPrefix}-rhf-agreement-error`;
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    getFieldState,
    trigger,
    register,
    reset,
  } = useForm<FormValues>({ defaultValues });

  const { field: amountFromField, fieldState: amountFromState } = useController({
    control,
    name: 'amountFrom',
    rules: {
      validate: (value) => (!value ? 'Введите нижнюю сумму' : amountFromRef.current?.validationMessage || undefined),
    },
  });
  const { field: amountToField, fieldState: amountToState } = useController({
    control,
    name: 'amountTo',
    rules: {
      validate: (value) => (!value ? 'Введите верхнюю сумму' : amountToRef.current?.validationMessage || undefined),
    },
  });
  const rangeError = amountFromState.error?.message || amountToState.error?.message;
  const validateRange = () => {
    void trigger(['amountFrom', 'amountTo']);
  };
  const handleRangeChange = ([from, to]: [string, string]) => {
    if (from !== amountFromField.value) amountFromField.onChange(from);
    if (to !== amountToField.value) amountToField.onChange(to);
    validateRange();
  };

  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });
  const passwordSuccess = !errors.password && password.length >= 8 ? 'Пароль соответствует требованиям' : undefined;
  const confirmationSuccess = passwordSuccess && confirmPassword === password ? 'Пароли совпадают' : undefined;

  const handlePasswordChange = () => {
    void trigger('password');
    if (getValues('confirmPassword') || getFieldState('confirmPassword').isTouched || errors.confirmPassword) {
      void trigger('confirmPassword');
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    amountInputRef.current?.form?.reset();
    setSubmittedValues(null);
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
  };

  return (
    <Page>
      <Form noValidate onSubmit={handleSubmit(setSubmittedValues)}>
        <Title>Регистрационная форма</Title>
        <Description>
          Пример интеграции компонентов Admiral 3 с React Hook Form. Большинство Input подключены через register, поле
          со счётчиком и составные поля — через Controller. InputSlider хранит сумму без форматирования. Его нативная
          валидность связана с валидатором RHF, а сброс библиотеки — со сбросом нативной формы. InputSliderRange
          подключён через два useController: amountFrom и amountTo — отдельные строки и в RHF, и в FormData. Обе границы
          проверяются после ввода и blur, в том числе при неизменном исходном значении.
        </Description>

        <FormItem
          label="Имя"
          htmlFor={nameId}
          required
          status={errors.name ? 'error' : undefined}
          description={errors.name ? <span id={`${nameId}-error`}>{errors.name.message}</span> : undefined}
        >
          <Input
            aria-required
            id={nameId}
            type="text"
            showClearIcon
            placeholder="Иван Иванов"
            autoComplete="name"
            status={errors.name ? 'error' : undefined}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            {...register('name', { required: 'Введите имя' })}
          />
        </FormItem>

        <FormItem
          label="Пароль"
          htmlFor={passwordId}
          required
          status={errors.password ? 'error' : passwordSuccess ? 'success' : undefined}
          description={
            errors.password ? (
              <span id={`${passwordId}-error`}>{errors.password.message}</span>
            ) : passwordSuccess ? (
              <span id={`${passwordId}-success`}>{passwordSuccess}</span>
            ) : undefined
          }
        >
          <Input
            aria-required
            id={passwordId}
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
            status={errors.password ? 'error' : passwordSuccess ? 'success' : undefined}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? `${passwordId}-error` : passwordSuccess ? `${passwordId}-success` : undefined
            }
            {...register('password', {
              required: 'Введите пароль',
              onChange: handlePasswordChange,
              minLength: { value: 8, message: 'Пароль должен содержать не менее 8 символов' },
            })}
          />
        </FormItem>

        <FormItem
          label="Повторите пароль"
          htmlFor={confirmPasswordId}
          required
          status={errors.confirmPassword ? 'error' : confirmationSuccess ? 'success' : undefined}
          description={
            errors.confirmPassword ? (
              <span id={`${confirmPasswordId}-error`}>{errors.confirmPassword.message}</span>
            ) : confirmationSuccess ? (
              <span id={`${confirmPasswordId}-success`}>{confirmationSuccess}</span>
            ) : undefined
          }
        >
          <Input
            aria-required
            id={confirmPasswordId}
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
            status={errors.confirmPassword ? 'error' : confirmationSuccess ? 'success' : undefined}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? `${confirmPasswordId}-error`
                : confirmationSuccess
                  ? `${confirmPasswordId}-success`
                  : undefined
            }
            {...register('confirmPassword', {
              required: 'Повторите пароль',
              validate: (value) => value === getValues('password') || 'Пароли не совпадают',
              onChange: () => {
                void trigger('confirmPassword');
              },
            })}
          />
        </FormItem>

        <FormItem
          label="Электронная почта"
          htmlFor={emailId}
          required
          status={errors.email ? 'error' : undefined}
          description={errors.email ? <span id={`${emailId}-error`}>{errors.email.message}</span> : undefined}
        >
          <Input
            aria-required
            id={emailId}
            type="email"
            showClearIcon
            placeholder="name@example.com"
            autoComplete="email"
            status={errors.email ? 'error' : undefined}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            {...register('email', {
              required: 'Введите электронную почту',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Введите корректный адрес электронной почты' },
            })}
          />
        </FormItem>

        <FormItem
          label="Сайт"
          htmlFor={websiteId}
          status={errors.website ? 'error' : undefined}
          description={errors.website ? <span id={`${websiteId}-error`}>{errors.website.message}</span> : undefined}
        >
          <Input
            id={websiteId}
            type="url"
            showClearIcon
            placeholder="https://example.com"
            autoComplete="url"
            status={errors.website ? 'error' : undefined}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? `${websiteId}-error` : undefined}
            {...register('website', {
              pattern: { value: /^https?:\/\/.+/, message: 'Адрес должен начинаться с http:// или https://' },
            })}
          />
        </FormItem>

        <Controller
          name="amount"
          control={control}
          rules={{ validate: validateAmount }}
          render={({ field, fieldState }) => (
            <FormItem
              label={<span id={`${amountId}-label`}>Сумма</span>}
              htmlFor={amountId}
              required
              status={fieldState.error ? 'error' : undefined}
              description={
                fieldState.error ? <span id={`${amountId}-error`}>{fieldState.error.message}</span> : undefined
              }
            >
              <InputSlider
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  void trigger('amount');
                }}
                nativeInputRef={(node) => {
                  amountInputRef.current = node;
                  field.ref(node);
                }}
                required
                min={0}
                max={20_000}
                step={0.01}
                formatValue={formatAmount}
                parseValue={parseAmount}
                status={fieldState.error ? 'error' : undefined}
                inputProps={{
                  id: amountId,
                  'aria-labelledby': `${amountId}-label`,
                  inputMode: 'decimal',
                  suffix: '₽',
                  showClearIcon: true,
                  'aria-describedby': fieldState.error ? `${amountId}-error` : undefined,
                  onInput: () => {
                    void trigger('amount');
                  },
                }}
              />
            </FormItem>
          )}
        />

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
            lowerName={amountFromField.name}
            upperName={amountToField.name}
            value={[amountFromField.value, amountToField.value]}
            onValueChange={handleRangeChange}
            lowerNativeInputRef={(node) => {
              amountFromRef.current = node;
              amountFromField.ref(node);
            }}
            upperNativeInputRef={(node) => {
              amountToRef.current = node;
              amountToField.ref(node);
            }}
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
              onInput: validateRange,
              onBlur: () => {
                amountFromField.onBlur();
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
              onInput: validateRange,
              onBlur: () => {
                amountToField.onBlur();
                validateRange();
              },
            }}
            sliderProps={{
              lowerNativeSliderProps: {
                onBlur: () => {
                  amountFromField.onBlur();
                  validateRange();
                },
              },
              upperNativeSliderProps: {
                onBlur: () => {
                  amountToField.onBlur();
                  validateRange();
                },
              },
            }}
          />
        </FormItem>

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <FormItem label="Комментарий" htmlFor={commentId} maxLength={50} counterThreshold={0}>
              <TextArea
                {...field}
                id={commentId}
                maxLength={50}
                showClearIcon
                autoHeight
                minRows={2}
                maxRows={5}
                placeholder="Добавьте комментарий"
              />
            </FormItem>
          )}
        />

        <Controller
          name="delivery"
          control={control}
          rules={{ required: 'Выберите способ доставки' }}
          render={({ field }) => (
            <RadioGroup
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              legend="Способ доставки"
              error={Boolean(errors.delivery)}
            >
              <RadioButton value="courier">Курьером</RadioButton>
              <RadioButton value="pickup">Самовывоз</RadioButton>
            </RadioGroup>
          )}
        />

        <Controller
          name="agreement"
          control={control}
          rules={{ required: 'Необходимо принять условия' }}
          render={({ field }) => (
            <Field>
              <CheckBox
                ref={field.ref}
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.agreement)}
                aria-describedby={errors.agreement ? agreementErrorId : undefined}
              >
                Я принимаю условия использования
              </CheckBox>
              {errors.agreement && <ErrorText id={agreementErrorId}>{errors.agreement.message}</ErrorText>}
            </Field>
          )}
        />

        <Controller
          name="notifications"
          control={control}
          render={({ field }) => (
            <Toggle
              ref={field.ref}
              name={field.name}
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              Получать уведомления
            </Toggle>
          )}
        />

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

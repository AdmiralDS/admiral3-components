import { useId, useState } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';
import { Controller, useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import {
  Button,
  CheckBox,
  FormItem,
  Input,
  InputIconPasswordButton,
  RadioButton,
  RadioGroup,
  Toggle,
} from '@admiral-ds/admiral3-components';

type FormValues = {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  website: string;
  comment: string;
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
  delivery: 'courier',
  agreement: false,
  notifications: true,
};

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
    reset();
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
          со счётчиком и составные поля — через Controller.
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
          name="comment"
          control={control}
          render={({ field }) => (
            <FormItem label="Комментарий" htmlFor={commentId} maxLength={50} counterThreshold={0}>
              <Input
                {...field}
                id={commentId}
                type="text"
                maxLength={50}
                showClearIcon
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

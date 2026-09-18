import { useState, type ReactNode } from 'react';

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

const Label = styled.label`
  ${textStyles.body.body2Long}
  color: var(--admiral-color-neutral-text-1-rest);
`;

const ErrorText = styled.span`
  ${textStyles.body.body2Long}
  color: var(--admiral-color-error-text-1-rest);
`;

const SuccessText = styled.span`
  ${textStyles.body.body2Long}
  color: var(--admiral-color-success-text-1-rest);
`;

type InputFieldProps = {
  children: ReactNode;
  error?: string;
  success?: string;
  id: string;
  label: string;
  withFormItem: boolean;
  required?: boolean;
};

const InputField = ({ children, error, success, id, label, withFormItem, required = true }: InputFieldProps) =>
  withFormItem ? (
    <FormItem
      label={label}
      htmlFor={id}
      required={required}
      status={error ? 'error' : success ? 'success' : undefined}
      description={
        error ? (
          <span id={`${id}-error`}>{error}</span>
        ) : success ? (
          <span id={`${id}-success`}>{success}</span>
        ) : undefined
      }
    >
      {children}
    </FormItem>
  ) : (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <ErrorText id={`${id}-error`}>{error}</ErrorText>
      ) : success ? (
        <SuccessText id={`${id}-success`}>{success}</SuccessText>
      ) : null}
    </Field>
  );

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

export const ReactHookFormTemplate = ({ withFormItem = false }: { withFormItem?: boolean }) => {
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
          Пример интеграции компонентов Admiral 3 с React Hook Form. Input подключены через register, составные поля —
          через Controller.
        </Description>

        <InputField id="rhf-name" label="Имя" error={errors.name?.message} withFormItem={withFormItem}>
          <Input
            aria-required
            id="rhf-name"
            type="text"
            showClearIcon
            placeholder="Иван Иванов"
            autoComplete="name"
            status={errors.name ? 'error' : undefined}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'rhf-name-error' : undefined}
            {...register('name', { required: 'Введите имя' })}
          />
        </InputField>

        <InputField
          id="rhf-password"
          label="Пароль"
          error={errors.password?.message}
          success={passwordSuccess}
          withFormItem={withFormItem}
        >
          <Input
            aria-required
            id="rhf-password"
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
              errors.password ? 'rhf-password-error' : passwordSuccess ? 'rhf-password-success' : undefined
            }
            {...register('password', {
              required: 'Введите пароль',
              onChange: handlePasswordChange,
              minLength: { value: 8, message: 'Пароль должен содержать не менее 8 символов' },
            })}
          />
        </InputField>

        <InputField
          id="rhf-confirm-password"
          label="Повторите пароль"
          error={errors.confirmPassword?.message}
          success={confirmationSuccess}
          withFormItem={withFormItem}
        >
          <Input
            aria-required
            id="rhf-confirm-password"
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
                ? 'rhf-confirm-password-error'
                : confirmationSuccess
                  ? 'rhf-confirm-password-success'
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
        </InputField>

        <InputField id="rhf-email" label="Электронная почта" error={errors.email?.message} withFormItem={withFormItem}>
          <Input
            aria-required
            id="rhf-email"
            type="email"
            showClearIcon
            placeholder="name@example.com"
            autoComplete="email"
            status={errors.email ? 'error' : undefined}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'rhf-email-error' : undefined}
            {...register('email', {
              required: 'Введите электронную почту',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Введите корректный адрес электронной почты' },
            })}
          />
        </InputField>

        <InputField
          id="rhf-website"
          label="Сайт"
          required={false}
          error={errors.website?.message}
          withFormItem={withFormItem}
        >
          <Input
            id="rhf-website"
            type="url"
            showClearIcon
            placeholder="https://example.com"
            autoComplete="url"
            status={errors.website ? 'error' : undefined}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? 'rhf-website-error' : undefined}
            {...register('website', {
              pattern: { value: /^https?:\/\/.+/, message: 'Адрес должен начинаться с http:// или https://' },
            })}
          />
        </InputField>

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
                aria-describedby={errors.agreement ? 'rhf-agreement-error' : undefined}
              >
                Я принимаю условия использования
              </CheckBox>
              {errors.agreement && <ErrorText id="rhf-agreement-error">{errors.agreement.message}</ErrorText>}
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

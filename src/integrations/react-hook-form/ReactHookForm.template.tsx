import { useState } from 'react';

import { textStyles } from '@admiral-ds/admiral3-tokens';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import {
  Button,
  CheckBox,
  Input,
  InputIconPasswordButton,
  RadioButton,
  RadioGroup,
  Toggle,
} from '@admiral-ds/admiral3-components';

type FormValues = {
  name: string;
  password: string;
  email: string;
  website: string;
  delivery: string;
  agreement: boolean;
  notifications: boolean;
};

const defaultValues: FormValues = {
  name: '',
  password: '',
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

export const ReactHookFormTemplate = () => {
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormValues>({ defaultValues });

  const handleReset = () => {
    reset();
    setSubmittedValues(null);
    setPasswordVisible(false);
  };

  return (
    <Page>
      <Form noValidate onSubmit={handleSubmit(setSubmittedValues)}>
        <Title>Регистрационная форма</Title>
        <Description>
          Пример интеграции компонентов Admiral 3 с React Hook Form. Input подключены через register, составные поля —
          через Controller.
        </Description>

        <Field>
          <Label htmlFor="rhf-name">Имя</Label>
          <Input
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
          {errors.name && <ErrorText id="rhf-name-error">{errors.name.message}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="rhf-password">Пароль</Label>
          <Input
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
            status={errors.password ? 'error' : undefined}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'rhf-password-error' : undefined}
            {...register('password', {
              required: 'Введите пароль',
              minLength: { value: 8, message: 'Пароль должен содержать не менее 8 символов' },
            })}
          />
          {errors.password && <ErrorText id="rhf-password-error">{errors.password.message}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="rhf-email">Электронная почта</Label>
          <Input
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
          {errors.email && <ErrorText id="rhf-email-error">{errors.email.message}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="rhf-website">Сайт</Label>
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
              required: 'Введите адрес сайта',
              pattern: { value: /^https?:\/\/.+/, message: 'Адрес должен начинаться с http:// или https://' },
            })}
          />
          {errors.website && <ErrorText id="rhf-website-error">{errors.website.message}</ErrorText>}
        </Field>

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

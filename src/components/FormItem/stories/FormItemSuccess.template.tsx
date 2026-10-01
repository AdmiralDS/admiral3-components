import { FormItem, Input } from '@admiral-ds/admiral3-components';

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
      defaultValue="name@example.com"
      aria-describedby="form-item-success-email-message"
    />
  </FormItem>
);

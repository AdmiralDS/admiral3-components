import { FormItem, Input } from '@admiral-ds/admiral3-components';

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
      defaultValue="invalid"
      aria-describedby="form-item-error-email-message"
    />
  </FormItem>
);

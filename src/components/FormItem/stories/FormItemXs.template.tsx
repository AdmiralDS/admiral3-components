import { FormItem, Input } from '@admiral-ds/admiral3-components';

export const FormItemXsTemplate = () => (
  <FormItem
    dimension="xs"
    label="Электронная почта"
    htmlFor="form-item-xs-email"
    maxLength={20}
    description={<span id="form-item-xs-description">Укажите рабочий адрес</span>}
  >
    <Input
      id="form-item-xs-email"
      type="email"
      name="email"
      aria-describedby="form-item-xs-description"
      defaultValue="example1@mail.ru"
    />
  </FormItem>
);

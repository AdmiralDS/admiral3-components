import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

test('FormItem links the label explicitly and leaves input attributes unchanged', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/default'));

  const input = page.getByRole('textbox', { name: 'Электронная почта' });
  const description = page.getByText('Укажите рабочий адрес');
  await expect(input).toBeVisible();
  await expect(description).toBeVisible();
  await expect(input).toHaveAttribute('id', 'form-item-playground-input');
  await expect(page.locator('label[for="form-item-playground-input"]')).toBeVisible();
  await expect(input).toHaveAttribute('aria-describedby', 'form-item-playground-description');

  await page.goto(getPlaygroundScenarioPath('form-item/error'));
  const errorInput = page.getByRole('textbox', { name: 'Электронная почта' });
  const error = page.getByText('Введите корректный адрес');
  await expect(errorInput).toHaveAttribute('aria-invalid', 'true');
  await expect(error).toBeVisible();
  await expect(errorInput).toHaveAttribute('aria-describedby', 'form-item-error-email-message');

  await page.goto(getPlaygroundScenarioPath('form-item/success'));
  const successInput = page.getByRole('textbox', { name: 'Электронная почта' });
  const success = page.getByText('Адрес подтверждён');
  await expect(success).toBeVisible();
  await expect(successInput).toHaveAttribute('aria-describedby', 'form-item-success-email-message');
  await expect(page.locator('div[data-status="success"]').filter({ has: success })).toHaveCount(1);
});

test('FormItem places the counter below an input with a native character limit', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/counter'));

  const input = page.getByRole('textbox', { name: 'Название' });
  await expect(input).toHaveAttribute('maxlength', '20');
  await input.fill('123456789012345');
  await expect(page.getByText('15 / 20')).toHaveCount(0);
  await input.fill('1234567890123456');
  await expect(page.getByText('16 / 20')).toBeVisible();
  await input.fill('12345678901234567890');
  await expect(page.getByText('20 / 20')).toBeVisible();
});

test('FormItem uses the master Input typography and spacing for m and xs', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/default'));
  const mItem = page
    .locator('div[data-dimension="m"]')
    .filter({ has: page.getByRole('textbox', { name: 'Электронная почта' }) })
    .first();
  await expect(mItem).toHaveCSS('gap', '8px');
  await expect(mItem.locator('label')).toHaveCSS('font-size', '14px');
  await expect(mItem.locator('label')).toHaveCSS('line-height', '16px');

  await page.goto(getPlaygroundScenarioPath('form-item/xs'));
  const xsItem = page
    .locator('div[data-dimension="xs"]')
    .filter({ has: page.getByRole('textbox', { name: 'Электронная почта' }) })
    .first();
  await expect(xsItem).toHaveCSS('gap', '6px');
  await expect(xsItem.locator('label')).toHaveCSS('font-size', '12px');
  await expect(xsItem.locator('label')).toHaveCSS('line-height', '16px');
});

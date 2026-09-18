import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test('FormItem keeps long labels and descriptions within a narrow container', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/long-text'));

  const input = page.locator('#form-item-long-text');
  const item = page.locator('div[data-dimension]').filter({ has: input }).first();
  await expect(item).toHaveCSS('width', '240px');
  await expect.poll(() => item.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);

  const label = page.locator('label[for="form-item-long-text"]');
  await expect.poll(() => label.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(16);
  const additionalLabel = item.getByText('ОченьДлиннаяДополнительнаяПодписьБезПробелов');
  await expect
    .poll(() => additionalLabel.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThan(16);
  const description = page.locator('#form-item-long-description-message');
  const counter = page.getByText('16 / 20');
  const descriptionBox = await description.boundingBox();
  const counterBox = await counter.boundingBox();
  expect(descriptionBox).not.toBeNull();
  expect(counterBox).not.toBeNull();
  if (!descriptionBox || !counterBox) return;
  expect(descriptionBox.x + descriptionBox.width).toBeLessThanOrEqual(counterBox.x);
  await expect(counter).toHaveCSS('white-space', 'nowrap');
  await expect(input).toHaveAccessibleDescription(await description.innerText());
});

test('FormItem starts with the control when the label is omitted', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/without-label'));

  const input = page.getByRole('textbox', { name: 'Название' });
  const item = page.locator('div[data-dimension]').filter({ has: input }).first();
  await expect(item.locator('label')).toHaveCount(0);
  await expect(input).toHaveAccessibleDescription('Пояснение');
  await expect(input).toHaveAttribute('required', '');
  expect(
    await item.evaluate(
      (element) => element.firstElementChild!.getBoundingClientRect().top - element.getBoundingClientRect().top,
    ),
  ).toBe(0);
});

test('FormItem keeps disabled text colors with required and status combinations', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/disabled-states'));

  const disabledColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-disable-rest');
  const errorColor = await resolveCssColorToken(page, '--admiral-color-error-text-1-rest');
  for (const status of ['default', 'error', 'success']) {
    const input = page.locator(`#form-item-disabled-${status}`);
    const item = page.locator('div[data-disabled][data-dimension]').filter({ has: input });
    const label = item.locator('label');
    await expect(input).toBeDisabled();
    await expect(input).toHaveAttribute('required', '');
    await expect(input).toHaveAccessibleName('Подпись');
    await expect(input).toHaveAccessibleDescription('Пояснение');
    await expect(label).toHaveCSS('color', disabledColor);
    await expect(item.getByText('Дополнение')).toHaveCSS('color', disabledColor);
    await expect(item.getByText('Пояснение')).toHaveCSS('color', disabledColor);
    await expect(item.getByText('16 / 20')).toHaveCSS('color', disabledColor);
    await expect.poll(() => label.evaluate((element) => getComputedStyle(element, '::after').color)).toBe(errorColor);
  }
});

test('FormItem renders the required marker with the Pixso error text token', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/states'));

  const label = page.locator('label[for="form-item-state-required"]');
  const errorColor = await resolveCssColorToken(page, '--admiral-color-error-text-1-rest');
  const secondaryColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-2-rest');
  await expect(label).toHaveCSS('color', secondaryColor);
  await expect.poll(() => label.evaluate((element) => getComputedStyle(element, '::after').color)).toBe(errorColor);
  expect(await label.evaluate((element) => getComputedStyle(element, '::after').content)).toContain('*');
  expect(
    await page
      .locator('label[for="form-item-state-default"]')
      .evaluate((element) => getComputedStyle(element, '::after').content),
  ).toBe('none');
  await expect(page.locator('#form-item-state-required')).toHaveAccessibleName('Подпись');
});

test('FormItem uses the Pixso label row gaps for every dimension', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/sizes'));

  for (const [dimension, gap] of [
    ['l', '8px'],
    ['m', '8px'],
    ['s', '6px'],
    ['xs', '6px'],
  ]) {
    const label = page.locator(`label[for="form-item-size-${dimension}"]`);
    await expect(label.locator('..')).toHaveCSS('gap', gap);
  }
});

test('FormItem uses the Pixso disabled text token for labels and description', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/states'));

  const input = page.locator('#form-item-state-disabled');
  const item = page.locator('div[data-disabled][data-dimension]').filter({ has: input });
  const disabledColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-disable-rest');
  await expect(input).toBeDisabled();
  await expect(item.locator('label')).toHaveCSS('color', disabledColor);
  await expect(item.locator('label')).toHaveCSS('cursor', 'not-allowed');
  await expect(item.getByText('Дополнение')).toHaveCSS('color', disabledColor);
  await expect(item.getByText('Пояснение')).toHaveCSS('color', disabledColor);
});

test('FormItem links the label explicitly and leaves input attributes unchanged', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('form-item/default'));

  const input = page.getByRole('textbox', { name: 'Электронная почта' });
  const description = page.getByText('Укажите рабочий адрес');
  await expect(input).toBeVisible();
  await expect(description).toBeVisible();
  await expect(page.getByText('Электронная почта', { exact: true })).toHaveAttribute(
    'for',
    (await input.getAttribute('id'))!,
  );
  await expect(input).toHaveAttribute('aria-describedby', (await description.getAttribute('id'))!);
  await page.getByText('Электронная почта', { exact: true }).click();
  await expect(input).toBeFocused();

  await page.goto(getPlaygroundScenarioPath('form-item/error'));
  const errorInput = page.getByRole('textbox', { name: 'Электронная почта' });
  const error = page.getByText('Введите корректный адрес');
  await expect(errorInput).toHaveAttribute('aria-invalid', 'true');
  await expect(errorInput).toHaveAttribute('required', '');
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
  await expect(input).toHaveValue('Пример названия №1');
  await expect(page.getByText('18 / 20')).toBeVisible();
  await page.getByRole('button', { name: 'Очистить' }).click();
  await expect(input).toHaveValue('');
  await expect(page.getByText('18 / 20')).toHaveCount(0);
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
  await expect(xsItem.getByText('16 / 20').locator('..')).toHaveCSS('gap', '6px');
  await expect(xsItem.locator('label')).toHaveCSS('font-size', '12px');
  await expect(xsItem.locator('label')).toHaveCSS('line-height', '16px');
  await expect(page.locator('#form-item-xs-email')).toHaveAccessibleDescription('Укажите рабочий адрес');
});

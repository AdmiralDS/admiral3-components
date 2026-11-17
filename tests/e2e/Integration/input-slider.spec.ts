import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

for (const scenario of [
  'integration/rhf',
  'integration/rhf-form-item',
  'integration/tanstack',
  'integration/tanstack-form-item',
]) {
  test(`${scenario}: canonical submission, validation, error focus and reset`, async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(scenario));
    const input = page.getByRole('textbox', { name: 'Сумма', exact: true });
    const slider = page.getByRole('slider', { name: 'Сумма', exact: true });
    const form = page.locator('form');
    const result = page.locator('pre').filter({ hasText: '"amount"' });
    const fillRequiredFields = async () => {
      await page.getByLabel('Имя', { exact: true }).fill('Иван');
      await page.getByLabel('Пароль', { exact: true }).fill('password1');
      await page.getByLabel('Повторите пароль', { exact: true }).fill('password1');
      await page.getByLabel('Электронная почта', { exact: true }).fill('ivan@example.com');
      await page.getByRole('checkbox', { name: 'Я принимаю условия использования' }).check();
    };

    await fillRequiredFields();
    await input.fill('-');
    await input.blur();
    await expect(page.getByText('Введите число.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(input).toBeFocused();
    await expect(result).toHaveCount(0);
    expect(await form.evaluate((element: HTMLFormElement) => new FormData(element).get('amount'))).toBe('');

    await page.getByRole('button', { name: 'Сбросить' }).click();
    await expect(input).toHaveValue('10\u00a0000,50');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Введите число.', { exact: true })).toHaveCount(0);

    await fillRequiredFields();
    await input.fill('12 345,67');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(result).toContainText('"amount": "12345.67"');
    expect(await form.evaluate((element: HTMLFormElement) => new FormData(element).getAll('amount'))).toEqual([
      '12345.67',
    ]);

    await input.locator('..').getByRole('button', { name: 'Очистить поле' }).click();
    await expect(page.getByText('Введите сумму', { exact: true })).toBeVisible();
    await slider.focus();
    await slider.press('ArrowRight');
    await expect(page.getByText('Введите сумму', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(result).toContainText('"amount": "12345.68"');
    await slider.focus();
    await slider.press('End');
    await input.fill('30000');
    await expect(page.getByText('Введите число от 0 до 20000.', { exact: true })).toBeVisible();
    await input.blur();
    await expect(input).toHaveValue('20\u00a0000,00');
    await expect(page.getByText('Введите число от 0 до 20000.', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(result).toContainText('"amount": "20000"');
  });
}

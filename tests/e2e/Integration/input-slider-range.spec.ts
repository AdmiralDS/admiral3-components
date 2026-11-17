import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

for (const scenario of [
  'integration/rhf',
  'integration/rhf-form-item',
  'integration/tanstack',
  'integration/tanstack-form-item',
]) {
  test(`${scenario}: independent range fields, upper error focus and reset`, async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(scenario));
    const from = page.getByRole('textbox', { name: 'Сумма от', exact: true });
    const to = page.getByRole('textbox', { name: 'Сумма до', exact: true });
    const form = page.locator('form');
    const result = page.locator('pre').filter({ hasText: '"amountFrom"' });
    await page.getByLabel('Имя', { exact: true }).fill('Иван');
    await page.getByLabel('Пароль', { exact: true }).fill('password1');
    await page.getByLabel('Повторите пароль', { exact: true }).fill('password1');
    await page.getByLabel('Электронная почта', { exact: true }).fill('ivan@example.com');
    await page.getByRole('checkbox', { name: 'Я принимаю условия использования' }).check();

    await to.fill('-');
    await to.blur();
    await expect(page.getByText('Введите число.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(to).toBeFocused();
    await expect(result).toHaveCount(0);
    expect(await form.evaluate((element: HTMLFormElement) => new FormData(element).get('amountTo'))).toBe('');

    await to.fill('15 000,00');
    await expect(page.getByText('Введите число.', { exact: true })).toHaveCount(0);
    await from.fill('12 345,67');
    await to.fill('16 789,01');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(result).toContainText('"amountFrom": "12345.67"');
    await expect(result).toContainText('"amountTo": "16789.01"');
    const values = await form.evaluate((element: HTMLFormElement) => {
      const data = new FormData(element);
      return [data.getAll('amountFrom'), data.getAll('amountTo')];
    });
    expect(values).toEqual([['12345.67'], ['16789.01']]);

    await to.fill('');
    await expect(page.getByText('Введите верхнюю сумму', { exact: true })).toBeVisible();
    await page.getByRole('slider', { name: 'Сумма до', exact: true }).press('ArrowRight');
    await expect(page.getByText('Введите верхнюю сумму', { exact: true })).toHaveCount(0);

    await from.fill('-');
    await to.fill('-');
    await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
    await expect(from).toHaveValue('10\u00a0000,50');
    await expect(to).toHaveValue('15\u00a0000,00');
    await expect(from).not.toHaveAttribute('aria-invalid', 'true');
    await expect(to).not.toHaveAttribute('aria-invalid', 'true');
    await expect(result).toHaveCount(0);
    expect(
      await form.evaluate((element: HTMLFormElement) => {
        const data = new FormData(element);
        return { amountFrom: data.get('amountFrom'), amountTo: data.get('amountTo') };
      }),
    ).toEqual({ amountFrom: '10000.5', amountTo: '15000' });
  });
}

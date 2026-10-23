import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

test('Button opens its tooltip on hover and focus and keeps it open under the pointer', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('button/tooltip'));
  const button = page.getByRole('button', { name: 'Поделиться', exact: true }).first();
  const tooltip = page.getByRole('tooltip');

  await button.hover();
  await expect(tooltip).toHaveText('Открыть варианты отправки');
  await expect(button).toHaveAccessibleDescription('Открыть варианты отправки');
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);

  await button.focus();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await expect(button).toBeFocused();
  await expect(button).toHaveAccessibleName('Поделиться');

  await page.locator('#playground-theme').focus();
  await button.focus();
  await expect(tooltip).toBeVisible();
  await page.locator('#playground-theme').focus();
  await expect(tooltip).toHaveCount(0);
});

import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

test('ButtonGroup moves focus and tooltips between icon buttons without extra wrappers', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('button-group/tooltip'));
  const group = page.getByRole('toolbar', { name: 'Быстрые действия' });
  const first = group.getByRole('button', { name: 'Подтвердить', exact: true });
  const second = group.getByRole('button', { name: 'Поделиться', exact: true });
  const tooltip = page.getByRole('tooltip');

  await first.focus();
  await expect(tooltip).toHaveText('Подтвердить документ');
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();
  await expect(tooltip).toHaveText('Открыть варианты отправки');
  await expect(second).toHaveAccessibleDescription('Открыть варианты отправки');
  await expect(group.locator(':scope > button')).toHaveCount(3);

  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await expect(second).toBeFocused();
  await page.locator('#playground-theme').focus();
  await second.hover();
  await expect(tooltip).toBeVisible();
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});

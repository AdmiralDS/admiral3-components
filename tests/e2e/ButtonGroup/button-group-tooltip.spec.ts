import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

test('ButtonGroup moves focus and tooltips between icon buttons without extra wrappers', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('button-group/tooltip'));
  const group = page.getByRole('group', { name: 'Быстрые действия' });
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

  await page.keyboard.press('ArrowLeft');
  await expect(first).toBeFocused();
  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toHaveText('Подтвердить документ');
});

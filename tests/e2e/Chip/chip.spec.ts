import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

test('shows a Tooltip for truncated Chip content on hover and focus', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('chip/tooltip'));
  const chips = page.getByTestId('chip');
  await expect(chips).toHaveCount(4);
  const [defaultChip, customChip, disabledTooltipChip, shortChip] = await chips.all();
  const tooltip = page.getByRole('tooltip');

  await defaultChip.hover();
  await expect(tooltip).toHaveText('Длинное название категории, которое не помещается в чипс');
  await customChip.hover();
  await expect(tooltip).toHaveText('Дополнительная информация о категории');
  await disabledTooltipChip.hover();
  await expect(tooltip).toHaveCount(0);
  await shortChip.hover();
  await expect(tooltip).toHaveCount(0);

  await defaultChip.focus();
  await expect(tooltip).toHaveText('Длинное название категории, которое не помещается в чипс');
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
});

test('allows Tab focus and preserves the text color and default cursor on hover', async ({ page }) => {
  await page.goto(getPlaygroundScenarioPath('chip/tooltip'));
  const chip = page.getByTestId('chip').first();

  await page.getByRole('button', { name: 'Hide menu' }).click();
  await page.getByRole('button', { name: 'Show menu' }).focus();
  await page.keyboard.press('Tab');
  await expect(chip).toBeFocused();
  await expect(chip).toHaveCSS('outline-width', '2px');
  await expect(chip).not.toHaveAttribute('role');
  await expect(chip).not.toHaveAttribute('aria-pressed');

  const textColor = await chip.evaluate((element) => getComputedStyle(element).color);
  await chip.hover();
  await expect(chip).toHaveCSS('cursor', 'default');
  await expect(chip).toHaveCSS('color', textColor);
});

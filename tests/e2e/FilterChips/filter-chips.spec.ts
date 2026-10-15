import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('FilterChips playground', () => {
  test('mounts without runtime errors and keeps multiple and exclusive selection independent', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(getPlaygroundScenarioPath('chips/filter'));
    const multiple = page.getByRole('group', { name: 'Планеты: множественный выбор' });
    const exclusive = page.getByRole('group', { name: 'Планеты: одиночный выбор' });
    const multipleMars = multiple.getByRole('button', { name: 'Марс' });
    const exclusiveMars = exclusive.getByRole('button', { name: 'Марс' });

    await expect(multipleMars).toHaveAttribute('aria-pressed', 'true');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'true');
    await multipleMars.click();
    await expect(multipleMars).toHaveAttribute('aria-pressed', 'false');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'true');
    await exclusiveMars.focus();
    await page.keyboard.press('Enter');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'false');
    await expect(multipleMars).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Space');
    await expect(exclusiveMars).toHaveAttribute('aria-pressed', 'true');
    await expect(multipleMars).toHaveAttribute('aria-pressed', 'false');
    expect(errors).toEqual([]);
  });

  test('keeps one Tab stop per group, navigates cyclically and selects only with Space', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/filter'));
    const multiple = page.getByRole('group', { name: 'Планеты: множественный выбор' });
    const first = multiple.getByRole('button', { name: 'Марс' });
    const second = multiple.getByRole('button', { name: 'Венера' });
    const last = multiple.getByRole('button', { name: 'Юпитер' });

    await page.getByRole('button', { name: 'Hide menu' }).click();
    await page.getByRole('button', { name: 'Show menu' }).focus();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await expect(first).toHaveCSS('outline-width', '2px');
    await page.keyboard.press('ArrowLeft');
    await expect(last).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(first).toBeFocused();
    await page.keyboard.press('End');
    await expect(last).toBeFocused();
    await page.keyboard.press('Home');
    await expect(first).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('tabindex', '0');
    await expect(first).toHaveAttribute('tabindex', '-1');
    await expect(last).toHaveAttribute('tabindex', '-1');
    await expect(second).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space');
    await expect(second).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('group', { name: 'Планеты: одиночный выбор' }).getByRole('button', { name: 'Марс' }),
    ).toBeFocused();
    await expect(first).toHaveAttribute('tabindex', '0');
    await expect(second).toHaveAttribute('tabindex', '-1');
    await page.keyboard.press('Shift+Tab');
    await expect(first).toBeFocused();
  });

  for (const state of ['disabled', 'readonly']) {
    test(`blocks pointer and keyboard selection when ${state}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(`chips/filter-${state}`));
      const chip = page.getByRole('button', { name: 'Марс' });
      await expect(chip).toHaveAttribute('aria-disabled', 'true');
      await expect(chip).toHaveAttribute('tabindex', state === 'disabled' ? '-1' : '0');
      await expect(chip).toHaveAttribute('aria-pressed', 'true');
      const bounds = await chip.boundingBox();
      expect(bounds).not.toBeNull();
      await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
      await chip.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      await expect(chip).toHaveAttribute('aria-pressed', 'true');
      if (state === 'readonly') {
        await page.keyboard.press('ArrowRight');
        await expect(page.getByRole('button', { name: 'Венера' })).toBeFocused();
      }
    });
  }

  test('keeps standalone SelectableChip outside Item navigation and supports its own selection', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/filter-regular-chips'));
    const group = page.getByRole('group', { name: 'Планеты: самостоятельное управление' });
    const mars = group.getByRole('button', { name: 'Марс' });
    const venus = group.getByRole('button', { name: 'Венера' });

    await expect(mars).toHaveAttribute('aria-pressed', 'true');
    await expect(mars).toHaveAttribute('tabindex', '0');
    await expect(venus).toHaveAttribute('tabindex', '0');
    await mars.focus();
    await page.keyboard.press('ArrowRight');
    await expect(mars).toBeFocused();
    await page.keyboard.press('Space');
    await expect(mars).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(mars).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await expect(venus).toBeFocused();
  });

  test('inherits SelectableChip hover and press colors on the Item root', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/filter'));
    const group = page.getByRole('group', { name: 'Планеты: множественный выбор' });
    const chip = group.getByRole('button', { name: 'Юпитер' });
    const hover = await resolveCssColorToken(page, '--admiral-color-primary-base-3-hover');
    const press = await resolveCssColorToken(page, '--admiral-color-primary-base-3-press');

    await chip.hover();
    await expect(chip).toHaveCSS('background-color', hover);
    await page.mouse.down();
    try {
      await expect(chip).toHaveCSS('background-color', press);
    } finally {
      await page.mouse.up();
    }
  });
});

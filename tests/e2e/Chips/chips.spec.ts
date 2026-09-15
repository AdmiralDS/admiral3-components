import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('Chips playground', () => {
  for (const key of ['Enter', 'Space']) {
    test(`removes a chip with ${key} from the main chip button`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('chips/removable'));
      const chip = page.getByTestId('chips').filter({ hasText: 'Марс' });
      const action = chip.getByRole('button', { name: 'Марс', exact: true });
      const close = chip.getByRole('button', { name: '', exact: true });
      await action.focus();
      await expect(close).toHaveAttribute('tabindex', '-1');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Венера', exact: true })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(action).toBeFocused();
      await page.keyboard.press(key);
      await expect(page.getByTestId('chips')).toHaveCount(3);
      await expect(close).toHaveCount(0);
    });
  }
  test('mounts the default scenario without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(getPlaygroundScenarioPath('chips/default'));
    await expect(page.getByTestId('chips').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('renders all three sizes with computed heights', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/sizes'));
    for (const [dimension, height] of [
      ['s', 20],
      ['m', 24],
      ['l', 32],
    ] as const) {
      await expect(page.getByTestId('chips').filter({ hasText: 'Chip ' + dimension.toUpperCase() })).toHaveCSS(
        'height',
        height + 'px',
      );
    }
  });

  test('resolves both color modes in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/appearances'));
    for (const theme of ['light', 'dark']) {
      await page.locator('#playground-theme').selectOption(theme);
      for (const mode of ['colored', 'neutral']) {
        const text = await resolveCssColorToken(
          page,
          mode === 'colored' ? '--admiral-color-primary-text-1-rest' : '--admiral-color-neutral-text-1-rest',
        );
        const background = await resolveCssColorToken(
          page,
          mode === 'colored' ? '--admiral-color-primary-base-3-rest' : '--admiral-color-neutral-base-opacity-rest',
        );
        await expect(page.getByTestId('chips').filter({ hasText: 'flat / ' + mode })).toHaveCSS(
          'background-color',
          background,
        );
        await expect(page.getByTestId('chips').filter({ hasText: 'flat / ' + mode })).toHaveCSS('color', text);
        await expect(page.getByTestId('chips').filter({ hasText: 'outlined / ' + mode })).toHaveCSS('color', text);
      }
    }
  });

  test('selects a chip with keyboard and exposes its focus ring', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/selection'));
    const chip = page.getByTestId('chips');
    await chip.getByRole('button', { name: 'Только избранное' }).focus();
    await page.keyboard.press('Enter');
    await expect(chip.getByRole('button', { name: 'Только избранное' })).toHaveAttribute('aria-pressed', 'true');
    expect(await chip.evaluate((element) => getComputedStyle(element, '::before').borderTopWidth)).toBe('2px');
    await page.keyboard.press('Space');
    await expect(chip.getByRole('button', { name: 'Только избранное' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('removes only the chip whose close button was clicked', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/removable'));
    await page.getByTestId('chips').filter({ hasText: 'Марс' }).getByRole('button', { name: '', exact: true }).click();
    await expect(page.getByTestId('chips')).toHaveCount(3);
    await expect(page.getByTestId('chips').filter({ hasText: 'Марс' })).toHaveCount(0);
  });

  test('lets the consumer control activation for disabled and readOnly states', async ({ page }) => {
    for (const state of ['filter-disabled', 'filter-readonly', 'filter']) {
      await page.goto(getPlaygroundScenarioPath('chips/' + state));
      const chip = page.getByTestId('chips').filter({ hasText: 'Марс' }).first();
      const background = await chip.evaluate((element) => getComputedStyle(element).backgroundColor);
      const bounds = await chip.boundingBox();
      expect(bounds).not.toBeNull();
      await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
      await page.mouse.move(0, 0);
      if (state === 'filter') {
        await expect(chip).not.toHaveCSS('background-color', background);
      } else {
        await chip.getByRole('button').focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Space');
        await expect(chip).toHaveCSS('background-color', background);
      }
    }
  });

  test('applies hover and press only to close when a close button is present', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/removable'));
    const chip = page.getByTestId('chips').filter({ hasText: 'Марс' });
    const close = chip.getByRole('button', { name: '', exact: true });
    const background = await resolveCssColorToken(page, '--admiral-color-primary-base-3-rest');
    const hoverColor = await resolveCssColorToken(page, '--admiral-color-primary-text-1-hover');
    const pressColor = await resolveCssColorToken(page, '--admiral-color-primary-text-1-press');
    await chip.hover({ position: { x: 8, y: 8 } });
    await expect(chip).toHaveCSS('background-color', background);
    await page.mouse.down();
    try {
      await expect(chip).toHaveCSS('background-color', background);
    } finally {
      await page.mouse.up();
    }
    await close.hover();
    await expect(close.locator('path')).toHaveCSS('fill', hoverColor);
    await expect.soft(chip).toHaveCSS('background-color', background, { timeout: 1000 });
    await page.mouse.down();
    try {
      await expect(close.locator('path')).toHaveCSS('fill', pressColor);
      await expect.soft(chip).toHaveCSS('background-color', background, { timeout: 1000 });
    } finally {
      await page.mouse.up();
    }
  });

  test('applies hover and press to the chip when there is no close button', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('chips/filter'));
    const chip = page.getByTestId('chips').filter({ hasText: 'Марс' }).first();
    const hoverBackground = await resolveCssColorToken(page, '--admiral-color-primary-base-3-hover');
    const pressBackground = await resolveCssColorToken(page, '--admiral-color-primary-base-3-press');
    await expect(chip.getByRole('button', { name: '', exact: true })).toHaveCount(0);
    await chip.hover();
    await expect(chip).toHaveCSS('background-color', hoverBackground);
    await page.mouse.down();
    try {
      await expect(chip).toHaveCSS('background-color', pressBackground);
    } finally {
      await page.mouse.up();
    }
  });
});

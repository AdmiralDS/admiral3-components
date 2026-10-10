import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('RemovableChip playground', () => {
  test('mounts without runtime errors and only the close icon removes with a pointer', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(getPlaygroundScenarioPath('removable-chip/default'));
    const chips = page.getByTestId('removable-chip');
    const mars = chips.filter({ hasText: 'Марс' });
    const close = mars.getByLabel('Удалить чипс');

    await expect(chips).toHaveCount(3);
    await expect(mars).toHaveAttribute('role', 'button');
    await expect(mars).not.toHaveAttribute('aria-pressed');
    await expect(close).not.toHaveAttribute('tabindex');
    await mars.getByText('Марс').click();
    await expect(chips).toHaveCount(3);
    await close.click();
    await expect(chips).toHaveCount(2);
    await expect(mars).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const key of ['Enter', 'Space', 'Backspace']) {
    test(`skips the close icon with Tab and removes the focused chip with ${key}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('removable-chip/default'));
      const chips = page.getByTestId('removable-chip');
      const mars = chips.filter({ hasText: 'Марс' });
      const venus = chips.filter({ hasText: 'Венера' });
      await mars.focus();
      await expect(mars).toHaveCSS('outline-width', '2px');
      await page.keyboard.press('Tab');
      await expect(venus).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(mars).toBeFocused();
      await page.keyboard.press(key);
      await expect(chips).toHaveCount(2);
      await expect(mars).toHaveCount(0);
    });
  }

  for (const state of ['disabled', 'readonly']) {
    test(`blocks removal when ${state}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(`removable-chip/${state}`));
      const chips = page.getByTestId('removable-chip');
      const chip = chips.first();
      const close = chip.getByLabel('Удалить чипс');
      await expect(chip).toHaveAttribute('aria-disabled', 'true');
      await expect(chip).toHaveAttribute('tabindex', state === 'disabled' ? '-1' : '0');
      if (state === 'readonly') await expect(chip).toHaveCSS('user-select', 'text');
      if (state === 'disabled') await expect(close).toHaveCount(1);
      else await expect(close).toHaveCount(0);
      const bounds = await chip.boundingBox();
      expect(bounds).not.toBeNull();
      await page.mouse.click(bounds!.x + bounds!.width - 8, bounds!.y + bounds!.height / 2);
      await chip.focus();
      // Backspace on an inactive element navigates back in WebKit; its blocked callback is covered by unit tests.
      for (const key of ['Enter', 'Space']) await page.keyboard.press(key);
      await expect(chips).toHaveCount(3);
    });
  }

  for (const mode of ['colored', 'neutral']) {
    test(`applies hover and press only to the close icon in ${mode} mode`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('removable-chip/appearances'));
      const chip = page.getByTestId('removable-chip').filter({ hasText: `flat / ${mode}` });
      const close = chip.getByLabel('Удалить чипс');
      const background = await resolveCssColorToken(
        page,
        mode === 'colored' ? '--admiral-color-primary-base-3-rest' : '--admiral-color-neutral-base-opacity-rest',
      );
      const hover = await resolveCssColorToken(page, '--admiral-color-neutral-text-2-hover');
      const press = await resolveCssColorToken(page, '--admiral-color-neutral-text-2-press');

      await chip.hover({ position: { x: 4, y: 4 } });
      await expect(chip).toHaveCSS('background-color', background);
      await close.hover();
      await expect(close.locator('path')).toHaveCSS('fill', hover);
      await expect(chip).toHaveCSS('background-color', background);
      await page.mouse.down();
      try {
        await expect(close.locator('path')).toHaveCSS('fill', press);
        await expect(chip).toHaveCSS('background-color', background);
      } finally {
        await page.mouse.up();
      }
    });
  }

  test('keeps the disabled close icon color on hover and press', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('removable-chip/disabled'));
    const chip = page.getByTestId('removable-chip').first();
    const close = chip.getByLabel('Удалить чипс');
    const color = await resolveCssColorToken(page, '--admiral-color-neutral-text-disable-rest');
    await close.hover({ force: true });
    await expect(close.locator('path')).toHaveCSS('fill', color);
    await page.mouse.down();
    try {
      await expect(close.locator('path')).toHaveCSS('fill', color);
    } finally {
      await page.mouse.up();
    }
    await expect(page.getByTestId('removable-chip')).toHaveCount(3);
  });
});

test.describe('RemovableChip presentation', () => {
  test('renders all three sizes with computed heights', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('removable-chip/sizes'));
    for (const [dimension, height] of [
      ['s', 20],
      ['m', 24],
      ['l', 32],
    ] as const) {
      await expect(page.getByTestId('removable-chip').filter({ hasText: 'Chip ' + dimension.toUpperCase() })).toHaveCSS(
        'height',
        height + 'px',
      );
    }
  });

  test('resolves appearance and colorMode tokens in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('removable-chip/appearances'));
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
        const border = await resolveCssColorToken(
          page,
          mode === 'colored' ? '--admiral-color-primary-stroke-1-rest' : '--admiral-color-neutral-stroke-2-rest',
        );
        const flat = page.getByTestId('removable-chip').filter({ hasText: 'flat / ' + mode });
        const outlined = page.getByTestId('removable-chip').filter({ hasText: 'outlined / ' + mode });

        await expect(flat).toHaveCSS('background-color', background);
        await expect(flat).toHaveCSS('border-top-style', 'none');
        await expect(flat).toHaveCSS('color', text);
        await expect(outlined).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(outlined).toHaveCSS('border-top-color', border);
        await expect(outlined).toHaveCSS('color', text);
      }
    }
  });

  test('shows native titles only for overflowing content with enabled tooltips', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('removable-chip/tooltip'));
    const chips = page.locator('[data-dimension][data-appearance][data-color-mode]');
    const auto = chips.nth(0);
    const custom = chips.nth(1);
    const disabled = chips.nth(2);
    const short = chips.nth(3);
    await expect(chips).toHaveCount(4);

    await expect(auto).not.toHaveAttribute('title');
    await auto.hover();
    await expect(auto).toHaveAttribute(
      'title',
      'Очень длинное название выбранного фильтра, которое не помещается в чипс',
    );
    await custom.hover();
    await expect(auto).not.toHaveAttribute('title');
    await expect(custom).toHaveAttribute('title', 'Собственное описание выбранного фильтра');
    await disabled.hover();
    await expect(custom).not.toHaveAttribute('title');
    await expect(disabled).not.toHaveAttribute('title');
    await short.hover();
    await expect(short).not.toHaveAttribute('title');
    await auto.focus();
    await expect(auto).toHaveAttribute(
      'title',
      'Очень длинное название выбранного фильтра, которое не помещается в чипс',
    );
  });
});

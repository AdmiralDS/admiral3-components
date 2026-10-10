import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('SelectableChip playground', () => {
  test('mounts without runtime errors and supports keyboard selection and focus', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(getPlaygroundScenarioPath('selectable-chip/default'));
    const chip = page.getByTestId('selectable-chip');

    await expect(chip).toHaveAttribute('role', 'button');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(chip.locator('button')).toHaveCount(0);
    await chip.focus();
    await page.keyboard.press('Enter');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(chip).toHaveAttribute('data-click-count', '1');
    await expect(chip).toHaveCSS('outline-width', '2px');
    await page.keyboard.press('Space');
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(chip).toHaveAttribute('data-click-count', '2');
    expect(errors).toEqual([]);
  });

  for (const state of ['disabled', 'readonly']) {
    test(`blocks pointer and keyboard selection when ${state}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(`selectable-chip/${state}`));
      const chip = page.getByTestId('selectable-chip');
      const background = await chip.evaluate((element) => getComputedStyle(element).backgroundColor);
      await expect(chip).toHaveAttribute('aria-disabled', 'true');
      await expect(chip).toHaveAttribute('tabindex', state === 'disabled' ? '-1' : '0');
      if (state === 'readonly') {
        await expect(chip).toHaveCSS('cursor', 'default');
        await expect(chip).toHaveCSS('user-select', 'text');
      }
      const bounds = await chip.boundingBox();
      expect(bounds).not.toBeNull();
      await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
      await chip.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      await expect(chip).toHaveAttribute('aria-pressed', 'false');
      await expect(chip).toHaveCSS('background-color', background);
    });
  }

  test('applies hover and press to the selectable surface', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('selectable-chip/default'));
    const chip = page.getByTestId('selectable-chip');
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

  test('preserves selected disabled background, border and icon color in every theme', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('visual/selectable-chip'));
    for (const theme of ['light', 'dark', 'lightNeutral', 'darkNeutral']) {
      await page.locator('#playground-theme').selectOption(theme);
      for (const mode of ['colored', 'neutral']) {
        const background = await resolveCssColorToken(
          page,
          mode === 'colored' ? '--admiral-color-primary-base-1-rest' : '--admiral-color-neutral-base-inverted-rest',
        );
        const border = await resolveCssColorToken(
          page,
          mode === 'colored' ? '--admiral-color-primary-stroke-1-rest' : '--admiral-color-neutral-base-inverted-rest',
        );
        const text = await resolveCssColorToken(
          page,
          mode === 'colored'
            ? '--admiral-color-neutral-text-static-white-3'
            : '--admiral-color-neutral-text-inverted-disable',
        );
        const chip = page.getByTestId(`selected-disabled-content-outlined-${mode}`);

        await expect(chip).toHaveCSS('background-color', background);
        await expect(chip).toHaveCSS('border-top-color', border);
        await expect(chip).toHaveCSS('border-top-style', 'solid');
        await expect(chip).toHaveCSS('border-top-width', '1px');
        await expect(chip).toHaveCSS('color', text);
        await expect(chip.locator('svg path').first()).toHaveCSS('fill', text);
        await chip.hover();
        await expect(chip).toHaveCSS('color', text);
        await expect(chip).toHaveCSS('border-top-color', border);
        await page.mouse.down();
        try {
          await expect(chip).toHaveCSS('background-color', background);
          await expect(chip).toHaveCSS('border-top-color', border);
          await expect(chip).toHaveCSS('color', text);
        } finally {
          await page.mouse.up();
        }
      }
    }
  });
});

test.describe('SelectableChip presentation', () => {
  test('sizes both decorative icon slots and keeps selection on the root', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('selectable-chip/content'));
    const chips = page.getByTestId('selectable-chip-content');
    await expect(chips).toHaveCount(3);

    for (const [dimension, size] of [
      ['s', 16],
      ['m', 16],
      ['l', 20],
    ] as const) {
      const root = page.locator(`[data-testid="selectable-chip-content"][data-dimension="${dimension}"]`);
      const icons = root.locator('svg');
      await expect(icons).toHaveCount(2);
      for (const icon of await icons.all()) {
        await expect(icon).toHaveCSS('width', `${size}px`);
        await expect(icon).toHaveCSS('height', `${size}px`);
        await expect(icon.locator('..')).toHaveAttribute('aria-hidden', 'true');
      }
      const after = icons.last();
      await expect(root.locator('[data-badge]')).toHaveText('5');
      expect(
        await after.evaluate((icon) => Boolean(icon.parentElement?.previousElementSibling?.hasAttribute('data-badge'))),
      ).toBe(true);
      await expect(root).toHaveAttribute('aria-pressed', 'false');
      await root.focus();
      await page.keyboard.press('Space');
      await expect(root).toHaveAttribute('aria-pressed', 'true');
      await after.click();
      await expect(root).toHaveAttribute('aria-pressed', 'false');
      await expect(root).toBeFocused();
    }
  });

  test('renders all three sizes with computed heights', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('selectable-chip/sizes'));
    for (const [dimension, height] of [
      ['s', 20],
      ['m', 24],
      ['l', 32],
    ] as const) {
      await expect(
        page.getByTestId('selectable-chip').filter({ hasText: 'Chip ' + dimension.toUpperCase() }),
      ).toHaveCSS('height', height + 'px');
    }
  });

  test('resolves appearance and colorMode tokens in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('selectable-chip/appearances'));
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
        const flat = page.getByTestId('selectable-chip').filter({ hasText: 'flat / ' + mode });
        const outlined = page.getByTestId('selectable-chip').filter({ hasText: 'outlined / ' + mode });

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
    await page.goto(getPlaygroundScenarioPath('selectable-chip/tooltip'));
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

import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, getTabKey, resolveCssColorToken } from '../utils';

const label = 'Документ согласован всеми участниками рабочего процесса';
const statuses = ['neutral', 'info', 'success', 'error', 'warning', 'attention'] as const;

test.describe('TagDot playground', () => {
  test('renders its native semantics, geometry and theme colors', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/default'));
    const tag = page.getByTestId('tag-dot');

    await expect(tag).toBeVisible();
    await expect(tag).toHaveAccessibleName('Tag');
    await expect(tag).toHaveAttribute('type', 'button');
    await expect(tag).toHaveAttribute('tabindex', '-1');
    await expect(tag).toHaveCSS('height', '24px');
    await expect(tag).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest'),
    );

    await page.locator('#playground-theme').selectOption('dark');
    await expect(tag).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest'),
    );
  });

  test('renders every preset status with the intended palette', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/statuses'));

    for (const status of statuses) {
      const tag = page.getByRole('button', { name: status, exact: true });
      await expect(tag).toBeVisible();
      const dot = tag.locator('[data-appearance]');
      await expect(dot).toHaveAttribute('data-appearance', status);
      await expect(tag).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest'),
      );
      const dotToken =
        status === 'neutral'
          ? '--admiral-color-neutral-base-4-rest'
          : `--admiral-color-${status === 'info' ? 'primary' : status}-base-1-rest`;
      await expect(dot).toHaveCSS('background-color', await resolveCssColorToken(page, dotToken));
      await expect(tag).toHaveCSS(
        'border-top-color',
        await resolveCssColorToken(page, '--admiral-color-neutral-stroke-2-rest'),
      );
      await tag.hover();
      await expect(tag).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-hover'),
      );
      await page.mouse.down();
      try {
        await expect(tag).toHaveCSS(
          'background-color',
          await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-press'),
        );
      } finally {
        await page.mouse.up();
      }
      await page.mouse.move(0, 0);
    }
  });

  test('resolves the custom palette in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/custom-status'));
    const tag = page.getByTestId('tag-dot');

    for (const theme of ['light', 'dark']) {
      await page.locator('#playground-theme').selectOption(theme);
      await expect(tag).toHaveAttribute('data-status', 'custom');
      await expect(tag).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-magenta-base-3-rest'),
      );
      await expect(tag).toHaveCSS(
        'border-top-color',
        await resolveCssColorToken(page, '--admiral-color-magenta-stroke-2-rest'),
      );
      await expect(tag.locator('span').last()).toHaveCSS(
        'color',
        await resolveCssColorToken(page, '--admiral-color-magenta-text-1-rest'),
      );
      await expect(tag.locator('[data-appearance]')).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-magenta-base-1-rest'),
      );
      await tag.hover();
      await expect(tag).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-magenta-base-3-hover'),
      );
      await page.mouse.down();
      try {
        await expect(tag).toHaveCSS(
          'background-color',
          await resolveCssColorToken(page, '--admiral-color-magenta-base-3-press'),
        );
      } finally {
        await page.mouse.up();
      }
      await page.mouse.move(0, 0);
    }
  });

  test('supports Tab, visible focus and native Enter/Space activation', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('interactive-tag');
    const tabKey = getTabKey(browserName);

    await page.getByTestId('before-tag').focus();
    await page.keyboard.press(tabKey);
    await expect(tag).toBeFocused();
    await expect(tag).toHaveCSS('outline-style', 'solid');
    await expect(tag).toHaveCSS('outline-width', '2px');

    await page.keyboard.press('Enter');
    await expect(page.getByTestId('activation-count')).toHaveText('1');
    await page.keyboard.press('Space');
    await expect(page.getByTestId('activation-count')).toHaveText('2');

    await page.keyboard.press(tabKey);
    await expect(page.getByTestId('after-tag')).toBeFocused();
  });

  test('truncates the text while preserving its accessible name and dot size', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('interactive-tag');
    const text = tag.locator('span').last();

    await expect(tag).toHaveAccessibleName(label);
    await expect(text).toHaveCSS('text-overflow', 'ellipsis');
    expect(await text.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    const dot = tag.locator('[data-appearance]');
    const box = await dot.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeCloseTo(8, 1);
    expect(box!.height).toBeCloseTo(8, 1);
    await expect(dot).toHaveCSS('flex-shrink', '0');
  });

  test('uses hover and press tokens for the interactive background', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('interactive-tag');

    await tag.hover();
    await expect(tag).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-hover'),
    );
    await page.mouse.down();
    try {
      await expect(tag).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-press'),
      );
    } finally {
      await page.mouse.up();
    }
    await page.getByTestId('after-tag').hover();
    await expect(tag).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest'),
    );
  });

  test('keeps the tooltip hoverable without duplicating its text in the accessible description', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('interactive-tag');

    await tag.hover();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText(label);
    await expect(tag).toHaveAccessibleName(label);
    await expect(tag).not.toHaveAttribute('aria-describedby');
    await expect(tag).toHaveAccessibleDescription('');
    await tooltip.hover();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
    await expect(tag).not.toHaveAttribute('aria-describedby');
  });

  test('opens a tooltip when an overflowing tag receives keyboard focus', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('interactive-tag');
    await page.getByTestId('before-tag').focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(tag).toBeFocused();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tag).toHaveAccessibleName(label);
    await expect(tag).not.toHaveAttribute('aria-describedby');
    await expect(tag).toHaveAccessibleDescription('');

    await page.keyboard.press(getTabKey(browserName));
    await expect(page.getByTestId('after-tag')).toBeFocused();
    await expect(tooltip).toBeHidden();
    await expect(tag).not.toHaveAttribute('aria-describedby');
  });

  test('does not show a tooltip or hover feedback for a passive tag whose text fits', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('tag-dot/interaction'));
    const tag = page.getByTestId('passive-tag');

    await expect(tag).toHaveAttribute('tabindex', '-1');
    await expect(tag).toHaveCSS('cursor', 'default');
    await tag.hover();
    await expect(tag).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest'),
    );
    await expect(page.getByRole('tooltip')).toBeHidden();
    await tag.focus();
    await expect(page.getByRole('tooltip')).toBeHidden();
    await expect(tag).not.toHaveAttribute('aria-describedby');
  });
});

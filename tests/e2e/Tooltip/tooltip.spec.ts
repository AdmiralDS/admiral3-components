import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'tooltip/default';

test.describe('Tooltip playground', () => {
  test('opens on hover, links the target with aria-describedby and closes on Escape', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Наведи на меня' });
    const tooltip = page.getByRole('tooltip');

    await expect(tooltip).toHaveCount(0);
    await expect(target).not.toHaveAttribute('aria-describedby');

    await target.hover();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Tooltip');
    await expect(tooltip).toHaveAttribute('id', /.+/);
    expect(await target.getAttribute('aria-describedby')).toBe(await tooltip.getAttribute('id'));

    await page.keyboard.press('Escape');

    await expect(tooltip).toHaveCount(0);
    await expect(target).not.toHaveAttribute('aria-describedby');
  });

  test('opens immediately on keyboard focus and closes after focus leaves', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Наведи на меня' });
    const tooltip = page.getByRole('tooltip');

    await target.focus();
    await expect(tooltip).toBeVisible();

    await page.locator('#playground-theme').focus();
    await expect(tooltip).toHaveCount(0);
  });

  test('positions the portal below the target', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Наведи на меня' });
    await target.hover();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('xpath=../..')).toHaveCSS('flex-direction', 'column');

    const [targetBox, tooltipBox] = await Promise.all([target.boundingBox(), tooltip.boundingBox()]);
    expect(targetBox).not.toBeNull();
    expect(tooltipBox).not.toBeNull();
    expect(tooltipBox!.y).toBeGreaterThanOrEqual(targetBox!.y + targetBox!.height);
  });

  test('resolves theme token styles', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    await page.getByRole('button', { name: 'Наведи на меня' }).hover();

    const tooltip = page.getByRole('tooltip');
    const expectedBackground = await resolveCssColorToken(page, '--admiral-color-neutral-base-inverted-rest');
    const expectedText = await resolveCssColorToken(page, '--admiral-color-neutral-text-inverted-rest');

    await expect(tooltip).toHaveCSS('background-color', expectedBackground);
    await expect(tooltip).toHaveCSS('color', expectedText);
  });
});

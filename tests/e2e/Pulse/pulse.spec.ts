import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'pulse/default';
const infoBackgroundColorToken = '--admiral-color-primary-base-1-rest';

test.describe('Pulse playground', () => {
  test('resolves token color and layout size in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const pulse = page.getByTestId('pulse');
    const expectedBackgroundColor = await resolveCssColorToken(page, infoBackgroundColorToken);

    await expect(pulse).toBeVisible();
    await expect(pulse).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(pulse).toHaveCSS('width', '16px');
    await expect(pulse).toHaveCSS('height', '16px');

    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');

    const expectedDarkBackgroundColor = await resolveCssColorToken(page, infoBackgroundColorToken);

    await expect(pulse).toHaveCSS('background-color', expectedDarkBackgroundColor);
  });

  test('disables wave animation when reduced motion is preferred', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const animationName = await page.getByTestId('pulse').evaluate((element) => {
      return getComputedStyle(element, '::before').animationName;
    });

    expect(animationName).toBe('none');
  });
});

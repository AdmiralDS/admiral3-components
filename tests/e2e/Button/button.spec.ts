import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'button/default';
const solidScenarioId = 'button/styling/solid';
const customColorsScenarioId = 'button/styling/colorConfig';
const loadingScenarioId = 'button/state/loading';
const customIconsScenarioId = 'button/content/custom-icons';
const inactiveScenarioId = 'button/state/inactive';
const fallbackScenarioId = 'button/fallback';
const solidBackgroundColorToken = '--admiral-color-primary-base-1-rest';
const invisibleBackgroundColorToken = '--admiral-color-neutral-base-invisible-rest';
const staticWhiteTextColorToken = '--admiral-color-neutral-text-static-white-1';
const customTextColorToken = '--admiral-color-error-text-1-rest';
const customBorderColorToken = '--admiral-color-error-stroke-1-rest';
const iconSizes = { l: 24, m: 24, s: 20, xs: 16 } as const;

test.describe('Button playground', () => {
  test('responds to click in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const button = page.getByTestId('button');

    await button.evaluate((element) => {
      element.addEventListener('click', () => element.setAttribute('data-clicked', 'true'), { once: true });
    });
    await button.click();
    await expect(button).toHaveAttribute('data-clicked', 'true');
  });

  test('responds to click in the browser when inactive', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(inactiveScenarioId));

    const button = page.getByTestId('button');

    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await button.evaluate((element) => {
      element.addEventListener('click', () => element.setAttribute('data-clicked', 'true'), { once: true });
    });
    await button.click({ force: true });
    await expect(button).toHaveAttribute('data-clicked', 'true');
  });

  test('resolves token colors and layout size in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(solidScenarioId));

    const button = page.getByTestId('button');
    const expectedBackgroundColor = await resolveCssColorToken(page, solidBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, staticWhiteTextColorToken);

    await expect(button).toBeVisible();
    await expect(button).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(button).toHaveCSS('color', expectedTextColor);
    await expect(button).toHaveCSS('height', '32px');

    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');

    const expectedDarkBackgroundColor = await resolveCssColorToken(page, solidBackgroundColorToken);

    await expect(button).toHaveCSS('background-color', expectedDarkBackgroundColor);
  });

  test('uses the corner radius selected in the playground', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const button = page.getByTestId('button');
    const playground = page.locator('[data-admiral-corner-radius]');

    await expect(button).toHaveCSS('border-radius', '4px');
    await page.locator('#playground-corner-radius').selectOption('8');
    await expect(playground).toHaveAttribute('data-admiral-corner-radius', '8');
    await expect(button).toHaveCSS('border-radius', '8px');

    await page.reload();
    await expect(page.locator('#playground-corner-radius')).toHaveValue('8');
    await expect(button).toHaveCSS('border-radius', '8px');
  });

  test('resolves custom color config in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customColorsScenarioId));

    const button = page.getByTestId('button');
    const expectedBackgroundColor = await resolveCssColorToken(page, invisibleBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, customTextColorToken);
    const expectedBorderColor = await resolveCssColorToken(page, customBorderColorToken);

    await expect(button).toHaveAttribute('data-appearance', 'custom');
    await expect(button).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(button).toHaveCSS('color', expectedTextColor);
    await expect(button).toHaveCSS('box-shadow', `${expectedBorderColor} 0px 0px 0px 1px inset`);
  });

  test('sets progress cursor and hides content when button state is loading', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(loadingScenarioId));

    const button = page.getByTestId('button');
    const content = button.locator('div').last();
    const spinner = button.locator('svg');
    const expectedSpinnerColor = await resolveCssColorToken(page, staticWhiteTextColorToken);

    await expect(button).toHaveCSS('cursor', 'progress');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(content).toHaveCSS('visibility', 'hidden');
    await expect(spinner).toHaveCSS('width', '24px');
    await expect(spinner).toHaveCSS('height', '24px');
    await expect(spinner).toHaveCSS('color', expectedSpinnerColor);
  });

  test('sizes custom icons according to button dimension', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customIconsScenarioId));

    for (const [dimension, size] of Object.entries(iconSizes)) {
      const icon = page.getByTestId(`button-custom-icon-${dimension}`);

      await expect(icon).toHaveCSS('width', `${size}px`);
      await expect(icon).toHaveCSS('height', `${size}px`);
    }
  });

  test('uses fallback colorMode="colored" if user sets incorrect prop modification', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(fallbackScenarioId));

    const button = page.getByTestId('button');
    const expectedBackgroundColor = await resolveCssColorToken(page, solidBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, staticWhiteTextColorToken);

    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('data-color-mode', 'colored');
    await expect(button).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(button).toHaveCSS('color', expectedTextColor);
  });
});

import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'progress-header/default';
const indeterminateScenarioId = 'progress-header/indeterminate';
const customErrorScenarioId = 'progress-header/custom-error';
const trackColorToken = '--admiral-color-neutral-stroke-subtle-rest';
const progressColorToken = '--admiral-color-primary-stroke-1-rest';
const customErrorColorToken = '--admiral-color-magenta-stroke-1-rest';

test.describe('ProgressHeader playground', () => {
  test('resolves determinate geometry, placement and theme colors in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('progress-header');
    const indicator = component.locator(':scope > div');
    const expectedTrackColor = await resolveCssColorToken(page, trackColorToken);
    const expectedProgressColor = await resolveCssColorToken(page, progressColorToken);

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('role', 'progressbar');
    await expect(component).toHaveAttribute('data-appearance', 'primary');
    await expect(component).toHaveAttribute('aria-valuenow', '35');
    await expect(component).toHaveCSS('position', 'fixed');
    await expect(component).toHaveCSS('pointer-events', 'none');
    await expect(component).toHaveCSS('background-color', expectedTrackColor);
    await expect(indicator).toHaveCSS('background-color', expectedProgressColor);

    const trackBox = await component.boundingBox();
    const indicatorBox = await indicator.boundingBox();

    expect(trackBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(trackBox!.x).toBeCloseTo(0, 1);
    expect(trackBox!.y).toBeCloseTo(0, 1);
    expect(trackBox!.height).toBeCloseTo(4, 1);
    expect(indicatorBox!.width / trackBox!.width).toBeCloseTo(0.35, 2);

    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');
    await expect(component).toHaveCSS('background-color', await resolveCssColorToken(page, trackColorToken));
    await expect(indicator).toHaveCSS('background-color', await resolveCssColorToken(page, progressColorToken));
  });

  test('renders indeterminate progress and respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(getPlaygroundScenarioPath(indeterminateScenarioId));

    const component = page.getByTestId('progress-header');
    const indicator = component.locator(':scope > div');

    await expect(component).not.toHaveAttribute('aria-valuenow');
    await expect(indicator).toHaveCSS('animation-name', 'none');

    const trackBox = await component.boundingBox();
    const indicatorBox = await indicator.boundingBox();

    expect(trackBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(indicatorBox!.width / trackBox!.width).toBeCloseTo(0.4, 2);
    expect(indicatorBox!.x + indicatorBox!.width / 2).toBeCloseTo(trackBox!.x + trackBox!.width / 2, 1);
  });

  test('resolves custom error color in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customErrorScenarioId));

    const component = page.getByTestId('progress-header');
    const indicator = component.locator(':scope > div');

    await expect(component).toHaveAttribute('data-appearance', 'custom');
    await expect(component).toHaveCSS('background-color', await resolveCssColorToken(page, trackColorToken));
    await expect(indicator).toHaveCSS('background-color', await resolveCssColorToken(page, customErrorColorToken));
  });
});

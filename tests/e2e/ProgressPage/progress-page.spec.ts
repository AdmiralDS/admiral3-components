import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'progress-page/default';
const indeterminateScenarioId = 'progress-page/indeterminate';
const customErrorScenarioId = 'progress-page/custom-error';
const labelsLayoutScenarioId = 'progress-page/labels-layout';
const trackColorToken = '--admiral-color-neutral-stroke-subtle-rest';
const progressColorToken = '--admiral-color-primary-stroke-1-rest';
const customErrorColorToken = '--admiral-color-magenta-stroke-1-rest';

test.describe('ProgressPage playground', () => {
  test('resolves determinate geometry and theme colors in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('progress-page');
    const track = component.getByRole('progressbar');
    const indicator = track.locator(':scope > div');
    const expectedTrackColor = await resolveCssColorToken(page, trackColorToken);
    const expectedProgressColor = await resolveCssColorToken(page, progressColorToken);

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('data-appearance', 'primary');
    await expect(track).toHaveAttribute('aria-valuenow', '35');
    await expect(component).toContainText('Загрузка данных');
    await expect(track).toHaveCSS('background-color', expectedTrackColor);
    await expect(indicator).toHaveCSS('background-color', expectedProgressColor);

    const trackBox = await track.boundingBox();
    const indicatorBox = await indicator.boundingBox();

    expect(trackBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(indicatorBox!.width / trackBox!.width).toBeCloseTo(0.35, 2);
    expect(indicatorBox!.height).toBeCloseTo(4, 1);

    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');
    await expect(track).toHaveCSS('background-color', await resolveCssColorToken(page, trackColorToken));
    await expect(indicator).toHaveCSS('background-color', await resolveCssColorToken(page, progressColorToken));
  });

  test('renders indeterminate progress and respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(getPlaygroundScenarioPath(indeterminateScenarioId));

    const track = page.getByTestId('progress-page').getByRole('progressbar');
    const indicator = track.locator(':scope > div');

    await expect(track).not.toHaveAttribute('aria-valuenow');
    await expect(indicator).toHaveCSS('animation-name', 'none');

    const trackBox = await track.boundingBox();
    const indicatorBox = await indicator.boundingBox();

    expect(trackBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(indicatorBox!.width / trackBox!.width).toBeCloseTo(0.4, 2);
    expect(indicatorBox!.x + indicatorBox!.width / 2).toBeCloseTo(trackBox!.x + trackBox!.width / 2, 1);
  });

  test('resolves custom error color in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customErrorScenarioId));

    const component = page.getByTestId('progress-page');
    const track = component.getByRole('progressbar');
    const indicator = track.locator(':scope > div');

    await expect(component).toHaveAttribute('data-appearance', 'custom');
    await expect(track).toHaveCSS('background-color', await resolveCssColorToken(page, trackColorToken));
    await expect(indicator).toHaveCSS('background-color', await resolveCssColorToken(page, customErrorColorToken));
  });

  test('wraps label while keeping valueLabel on one line', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(labelsLayoutScenarioId));

    const label = page.getByText('Загрузка большого количества данных');
    const valueLabel = page.getByText('35 из 100');
    const labelBox = await label.boundingBox();
    const valueLabelBox = await valueLabel.boundingBox();

    await expect(valueLabel).toHaveCSS('white-space', 'nowrap');
    expect(labelBox).not.toBeNull();
    expect(valueLabelBox).not.toBeNull();
    expect(labelBox!.height).toBeGreaterThan(valueLabelBox!.height);
  });
});

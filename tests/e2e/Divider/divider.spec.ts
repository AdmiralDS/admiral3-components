import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'divider/default';
const verticalScenarioId = 'divider/vertical';

test.describe('Divider playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('divider');

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('data-appearance', 'default');
    await expect(component).toHaveAttribute('data-dimension', 'm');
    await expect(component).toHaveAttribute('data-orientation', 'horizontal');
    await expect(component).toHaveCSS('height', '2px');
  });

  test('renders vertical divider with default length', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(verticalScenarioId));

    const component = page.getByTestId('divider');

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('data-orientation', 'vertical');
    await expect(component).toHaveCSS('width', '2px');
    await expect(component).toHaveCSS('height', '70px');
  });
});

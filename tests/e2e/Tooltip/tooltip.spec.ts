import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'tooltip/default';

test.describe('Tooltip playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('tooltip');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('Tooltip');
  });
});

import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'divider/default';

test.describe('Divider playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('divider');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('Divider');
  });
});

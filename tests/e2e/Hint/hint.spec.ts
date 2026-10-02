import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'hint/default';

test.describe('Hint playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('hint');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('Hint');
  });
});

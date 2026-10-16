import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'avatar/default';

test.describe('Avatar playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('avatar');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('Avatar');
  });
});

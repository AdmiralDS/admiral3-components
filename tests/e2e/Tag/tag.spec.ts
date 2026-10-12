import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'tag/default';

test.describe('Tag playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('tag');

    await expect(component).toBeVisible();
    await expect(component).toHaveText('Tag');
  });
});

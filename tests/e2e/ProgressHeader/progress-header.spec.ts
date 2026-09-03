import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'progress-header/default';

test.describe('ProgressHeader playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('progress-header');

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('role', 'progressbar');
    await expect(component).toHaveAttribute('aria-valuenow', '35');
  });
});

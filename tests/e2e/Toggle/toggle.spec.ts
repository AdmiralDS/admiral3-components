import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'toggle/default';

test.describe('Toggle playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('toggle');

    await expect(component).toBeVisible();
    await expect(page.getByText('Toggle text')).toBeVisible();
    await expect(component).not.toBeChecked();

    await component.press('Space');

    await expect(component).toBeChecked();
  });
});

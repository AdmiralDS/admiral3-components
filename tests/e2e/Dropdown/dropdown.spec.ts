import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'dropdown/default';

test.describe('Dropdown playground', () => {
  test('renders target-width Dropdown below its target', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Target' });
    const dropdown = page.getByTestId('dropdown');

    await expect(dropdown).toBeVisible();
    await expect(dropdown).toHaveText('Dropdown');

    const [targetBox, dropdownBox] = await Promise.all([target.boundingBox(), dropdown.boundingBox()]);

    expect(targetBox).not.toBeNull();
    expect(dropdownBox).not.toBeNull();
    expect(dropdownBox!.width).toBe(targetBox!.width);
    expect(dropdownBox!.y).toBeGreaterThanOrEqual(targetBox!.y + targetBox!.height);
  });

  test('uses the content width in content mode', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('dropdown/content-width'));

    const target = page.getByRole('button', { name: 'Target' });
    const dropdown = page.getByTestId('dropdown');
    await expect(dropdown).toBeVisible();

    const [targetBox, dropdownBox] = await Promise.all([target.boundingBox(), dropdown.boundingBox()]);
    expect(targetBox).not.toBeNull();
    expect(dropdownBox).not.toBeNull();
    expect(targetBox!.width).toBe(160);
    expect(dropdownBox!.width).toBe(280);
  });

  test('updates target width mode after the target is resized', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Target' });
    const dropdown = page.getByTestId('dropdown');
    await expect(dropdown).toBeVisible();

    await target.evaluate((element) => {
      element.style.width = '320px';
    });

    await expect
      .poll(async () => {
        const [targetBox, dropdownBox] = await Promise.all([target.boundingBox(), dropdown.boundingBox()]);
        return { targetWidth: targetBox?.width, dropdownWidth: dropdownBox?.width };
      })
      .toEqual({ targetWidth: 320, dropdownWidth: 320 });
  });

  test('opens above the target when there is not enough space below', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('dropdown/top'));

    const target = page.getByRole('button', { name: 'Target' });
    const dropdown = page.getByTestId('dropdown');
    await expect(dropdown).toBeVisible();

    const [targetBox, dropdownBox] = await Promise.all([target.boundingBox(), dropdown.boundingBox()]);
    expect(targetBox).not.toBeNull();
    expect(dropdownBox).not.toBeNull();
    expect(dropdownBox!.y + dropdownBox!.height).toBeLessThanOrEqual(targetBox!.y);
  });

  for (const align of ['start', 'center', 'end'] as const) {
    test(`uses ${align} horizontal alignment`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(`dropdown/align-${align}`));

      const target = page.getByRole('button', { name: 'Target' });
      const dropdown = page.getByTestId('dropdown');
      await expect(dropdown).toBeVisible();

      const [targetBox, dropdownBox] = await Promise.all([target.boundingBox(), dropdown.boundingBox()]);
      expect(targetBox).not.toBeNull();
      expect(dropdownBox).not.toBeNull();

      const targetCenter = targetBox!.x + targetBox!.width / 2;
      const dropdownCenter = dropdownBox!.x + dropdownBox!.width / 2;
      const targetEnd = targetBox!.x + targetBox!.width;
      const dropdownEnd = dropdownBox!.x + dropdownBox!.width;

      if (align === 'start') expect(dropdownBox!.x).toBeCloseTo(targetBox!.x, 0);
      if (align === 'center') expect(dropdownCenter).toBeCloseTo(targetCenter, 0);
      if (align === 'end') expect(dropdownEnd).toBeCloseTo(targetEnd, 0);
    });
  }
});

import { expect, test } from '@playwright/test';

import { checkAvatarKeyboardInteraction } from '../avatarUtils';
import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('ActivityAvatar playground', () => {
  test('renders the public component with an activity ring inside its reserved space', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('activity-avatar/default'));
    const avatar = page.getByTestId('activity-avatar');

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAccessibleName('Иван Иванов');
    await expect(avatar).toHaveText('ИИ');
    await expect(avatar).toHaveCSS('width', '48px');
    await expect(avatar).toHaveCSS('height', '48px');
    await expect(avatar.locator('svg')).toHaveAttribute('viewBox', '0 0 48 48');
    await expect(avatar.locator('svg > circle[fill="none"]')).toBeVisible();
  });

  test('supports keyboard activation, visible focus, descriptions and passive tab order', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('activity-avatar/interaction'));

    await checkAvatarKeyboardInteraction(page, browserName);
  });

  test('shares a mask between the loaded image and activity ring while keeping the status visible', async ({
    page,
  }) => {
    await page.goto(getPlaygroundScenarioPath('activity-avatar/image'));
    const avatar = page.getByTestId('activity-avatar');
    const image = avatar.locator('svg > image');
    const ring = avatar.locator('svg > circle[fill="none"]');

    await expect(image).toBeVisible();
    await expect(ring).toBeVisible();
    const maskId = await avatar.locator('mask').getAttribute('id');
    expect(maskId).toBeTruthy();
    await expect(image).toHaveAttribute('mask', `url(#${maskId})`);
    await expect(ring).toHaveAttribute('mask', `url(#${maskId})`);
    await expect(avatar.locator('svg > ellipse')).toBeVisible();
    await expect(avatar).toHaveAccessibleName('Иван Иванов');
    await expect(avatar).toHaveText('');
  });

  test('updates the computed activity ring color when the theme changes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('activity-avatar/default'));
    const ring = page.getByTestId('activity-avatar').locator('svg > circle[fill="none"]');

    await page.getByLabel('Theme', { exact: true }).selectOption('light');
    const lightColor = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest');
    await expect(ring).toHaveCSS('stroke', lightColor);

    await page.getByLabel('Theme', { exact: true }).selectOption('dark');
    const darkColor = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest');
    await expect(ring).toHaveCSS('stroke', darkColor);
  });
});

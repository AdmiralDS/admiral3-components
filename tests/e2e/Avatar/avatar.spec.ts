import { expect, test } from '@playwright/test';

import { checkAvatarKeyboardInteraction } from '../avatarUtils';
import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'avatar/default';

test.describe('Avatar playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('avatar');

    await expect(component).toBeVisible();
    await expect(component).toHaveAccessibleName('Иван Иванов');
    await expect(component).toHaveText('ИИ');
  });

  test('supports keyboard activation, visible focus, descriptions and passive tab order', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('avatar/interaction'));

    await checkAvatarKeyboardInteraction(page, browserName);
  });

  test('shows a tooltip on a passive avatar only while it is hovered', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('avatar/interaction'));

    await page.getByTestId('passive-avatar').hover();
    await expect(page.getByRole('tooltip')).toHaveText('Пётр Петров');
    await expect(page.getByTestId('passive-avatar')).not.toHaveAttribute('aria-describedby');

    await page.getByTestId('after-avatar').hover();

    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  test('activates by pointer without showing the keyboard focus ring', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('avatar/interaction'));
    const avatar = page.getByTestId('interactive-avatar');

    await avatar.click();

    await expect(page.getByTestId('activation-count')).toHaveText('1');
    await expect.poll(() => avatar.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
    await expect.poll(() => avatar.evaluate((element) => getComputedStyle(element, '::before').content)).toBe('none');
  });

  test('renders a loaded image with a status and keeps its accessible name', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('avatar/image'));
    const avatar = page.getByTestId('avatar');
    const image = avatar.locator('svg > image');

    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
    await expect(image).toHaveCSS('clip-path', 'circle()');
    await expect(avatar).toHaveAccessibleName('Иван Иванов');
    await expect(avatar).toHaveText('');
    await expect(avatar.locator('svg > ellipse')).toBeVisible();
  });

  test('updates the computed background color when the theme changes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));
    const background = page.getByTestId('avatar').locator('svg > circle');

    await page.getByLabel('Theme', { exact: true }).selectOption('light');
    const lightColor = await resolveCssColorToken(page, '--admiral-color-neutral-base-3-rest');
    await expect(background).toHaveCSS('fill', lightColor);

    await page.getByLabel('Theme', { exact: true }).selectOption('dark');
    const darkColor = await resolveCssColorToken(page, '--admiral-color-neutral-base-3-rest');
    expect(darkColor).not.toBe(lightColor);
    await expect(background).toHaveCSS('fill', darkColor);
  });
});

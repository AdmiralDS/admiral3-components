import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const infoScenarioId = 'pills/info';
const customColorsScenarioId = 'pills/custom-colors';
const truncatedScenarioId = 'pills/truncated';
const nestedScenarioId = 'pills/nested';
const dropdownScenarioId = 'pills/dropdown';
const keyboardNavigationScenarioId = 'pills/keyboard-navigation';
const infoBackgroundColorToken = '--admiral-color-primary-base-1-rest';
const customBackgroundColorToken = '--admiral-color-purple-base-1-rest';
const staticWhiteTextColorToken = '--admiral-color-neutral-text-static-white-1';

test.describe('Pills playground', () => {
  test('resolves token colors and compact geometry in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(infoScenarioId));

    const pills = page.getByTestId('pills');
    const expectedBackgroundColor = await resolveCssColorToken(page, infoBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, staticWhiteTextColorToken);

    await expect(pills).toBeVisible();
    await expect(pills).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(pills).toHaveCSS('color', expectedTextColor);
    await expect(pills).toHaveCSS('height', '16px');
    await expect(pills).toHaveCSS('padding-left', '4px');
    await expect(pills).toHaveCSS('padding-right', '4px');
    await expect(pills).toHaveCSS('cursor', 'pointer');

    const box = await pills.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.height).toBeCloseTo(16, 1);

    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');

    const expectedDarkBackgroundColor = await resolveCssColorToken(page, infoBackgroundColorToken);

    await expect(pills).toHaveCSS('background-color', expectedDarkBackgroundColor);
  });

  test('allows a standalone Pill to receive focus through Tab', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(infoScenarioId));

    await page.getByRole('navigation', { name: 'Playground scenarios' }).getByRole('link').last().focus();
    await page.keyboard.press('Tab');

    await expect(page.getByTestId('pills')).toBeFocused();
  });

  test('resolves custom colors in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customColorsScenarioId));

    const pills = page.getByTestId('pills');
    const expectedBackgroundColor = await resolveCssColorToken(page, customBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, staticWhiteTextColorToken);

    await expect(pills).toHaveAttribute('data-appearance', 'custom');
    await expect(pills).toHaveCSS('background-color', expectedBackgroundColor);
    await expect(pills).toHaveCSS('color', expectedTextColor);
  });

  test('truncates visible text without changing its accessible content', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(truncatedScenarioId));

    const pills = page.getByTestId('pills-truncated');
    const label = pills.locator('span').first();

    await expect(pills).toHaveText('Я три дня гналась за вами, чтобы сказать, как вы мне безразличны');
    await expect(pills).toHaveAttribute('title', 'Я три дня гналась за вами, чтобы сказать, как вы мне безразличны');
    await expect(label).toHaveCSS('text-overflow', 'ellipsis');
    await expect(label).toHaveCSS('overflow', 'hidden');
    expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  });

  test('joins nested Pills without gaps and keeps only outer corner radius', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(nestedScenarioId));

    const pills = page.getByTestId('pills-group').locator('[data-appearance]');
    await expect(pills).toHaveCount(8);

    const boxes = await pills.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().toJSON()),
    );

    for (let index = 1; index < boxes.length / 2; index += 1) {
      expect(boxes[index].left).toBeCloseTo(boxes[index - 1].right, 1);
    }

    await expect(pills.first()).not.toHaveCSS('border-top-left-radius', '0px');
    await expect(pills.first()).toHaveCSS('border-top-right-radius', '0px');
    await expect(pills.nth(1)).toHaveCSS('border-radius', '0px');
    await expect(pills.nth(2)).toHaveCSS('border-radius', '0px');
    await expect(pills.nth(3)).toHaveCSS('border-top-left-radius', '0px');
    await expect(pills.nth(3)).not.toHaveCSS('border-top-right-radius', '0px');

    for (let index = 5; index < boxes.length; index += 1) {
      expect(boxes[index].left).not.toBeCloseTo(boxes[index - 1].right, 1);
      await expect(pills.nth(index - 1)).toHaveCSS('border-radius', '4px');
    }
    await expect(pills.nth(7)).toHaveCSS('border-radius', '4px');
  });

  test('changes the displayed Pills through the native dropdown', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(dropdownScenarioId));

    const select = page.getByTestId('pills-dropdown-select');
    const pills = page.getByTestId('pills-dropdown-value');

    await expect(select).toHaveAccessibleName('Статус');
    await expect(pills).toHaveText('Info');
    await expect(pills).toHaveAttribute('data-appearance', 'info1');

    await select.selectOption('error');

    await expect(pills).toHaveText('Error');
    await expect(pills).toHaveAttribute('data-appearance', 'error1');
  });

  test('uses one Tab stop and moves focus between segments with navigation keys', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const firstSegment = page.getByTestId('pills-segment-0');
    const secondSegment = page.getByTestId('pills-segment-1');
    const lastSegment = page.getByTestId('pills-segment-4');

    await page.getByTestId('before-pills-group').focus();
    await page.keyboard.press('Tab');
    await expect(firstSegment).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('after-pills-group')).toBeFocused();

    await firstSegment.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(lastSegment).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(firstSegment).toBeFocused();

    await secondSegment.focus();
    await page.keyboard.press('End');
    await expect(lastSegment).toBeFocused();

    await page.keyboard.press('Home');
    await expect(firstSegment).toBeFocused();
  });

  test('opens a segment menu with Enter, Space, or ArrowDown only when a menu exists', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const plainSegment = page.getByTestId('pills-segment-1');
    const menuSegment = page.getByTestId('pills-segment-0');

    await plainSegment.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menu')).toHaveCount(0);

    for (const key of ['Enter', 'Space', 'ArrowDown']) {
      await menuSegment.focus();
      await page.keyboard.press(key);

      await expect(page.getByRole('menu')).toBeVisible();
      await expect(page.getByRole('menuitem').first()).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(page.getByRole('menu')).toHaveCount(0);
      await expect(menuSegment).toBeFocused();
    }
  });

  test('follows Dropdown Menu keyboard navigation and restores trigger focus', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const menuSegment = page.getByTestId('pills-segment-0');

    await menuSegment.focus();
    await page.keyboard.press('ArrowDown');

    const menuItems = page.getByRole('menuitem');
    await expect(menuItems.first()).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(menuItems.nth(1)).toBeFocused();

    await page.keyboard.press('End');
    await expect(menuItems.last()).toBeFocused();

    await page.keyboard.press('Home');
    await expect(menuItems.first()).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(menuItems.last()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(menuSegment).toBeFocused();
  });

  test('closes the segment menu after a pointer click outside', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    await page.getByTestId('pills-segment-0').click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.getByTestId('before-pills-group').click();
    await expect(page.getByRole('menu')).toHaveCount(0);
  });

  test('closes the segment menu after a second trigger click', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const menuSegment = page.getByTestId('pills-segment-0');

    await menuSegment.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(menuSegment).toHaveAttribute('aria-expanded', 'true');

    await menuSegment.click();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(menuSegment).toHaveAttribute('aria-expanded', 'false');
  });
});

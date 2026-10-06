import { expect, test } from '@playwright/test';

import { BUTTON_DIMENSION_PARAMETERS } from '#src/components/Button/constants';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'button-group/default';
const outlineScenarioId = 'button-group/styling/outline';
const customColorsScenarioId = 'button-group/styling/custom-colors';
const dimensionsScenarioId = 'button-group/styling/dimensions';
const statesScenarioId = 'button-group/states';
const keyboardScenarioId = 'button-group/keyboard-navigation';
const solidBackgroundColorToken = '--admiral-color-primary-base-1-rest';
const invisibleBackgroundColorToken = '--admiral-color-neutral-base-invisible-rest';
const customTextColorToken = '--admiral-color-error-text-1-rest';
const customBorderColorToken = '--admiral-color-error-stroke-1-rest';
const solidColoredFocusColorToken = '--admiral-color-neutral-stroke-static-white-1';
const solidColoredDisabledTextColorToken = '--admiral-color-neutral-text-static-white-3';
const dimensions = BUTTON_DIMENSION_PARAMETERS;

test.describe('ButtonGroup playground', () => {
  test('renders a labelled horizontal toolbar with uniform Button props', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const group = page.getByTestId('button-group');
    const buttons = group.getByRole('button');

    await expect(group).toHaveRole('toolbar');
    await expect(group).toHaveAccessibleName('Действия');
    await expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(group).toHaveAttribute('data-appearance', 'solid');
    await expect(group).toHaveAttribute('data-color-mode', 'colored');
    await expect(group).toHaveAttribute('data-dimension', 'm');
    await expect(buttons).toHaveCount(3);

    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute('data-appearance', 'solid');
      await expect(button).toHaveAttribute('data-color-mode', 'colored');
      await expect(button).toHaveAttribute('data-dimension', 'm');
    }
  });

  test('uses one Tab stop and supports circular keyboard navigation', async ({ page, browserName }) => {
    const tabKey = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
    await page.goto(getPlaygroundScenarioPath(keyboardScenarioId));

    const first = page.getByTestId('button-group-first');
    const disabled = page.getByTestId('button-group-disabled');
    const last = page.getByTestId('button-group-last');

    await page.getByTestId('before-button-group').focus();
    await page.keyboard.press(tabKey);
    await expect(first).toBeFocused();
    await expect(first).toHaveCSS('outline-style', 'solid');
    await expect(first).toHaveCSS('outline-width', '2px');
    await expect(first).toHaveCSS('outline-offset', '-4px');
    await expect(first).toHaveCSS('outline-color', await resolveCssColorToken(page, solidColoredFocusColorToken));

    await page.keyboard.press(tabKey);
    await expect(page.getByTestId('after-button-group')).toBeFocused();

    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(last).toBeFocused();
    await expect(disabled).not.toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(first).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(last).toBeFocused();

    await page.keyboard.press('Home');
    await expect(first).toBeFocused();

    await page.keyboard.press('End');
    await expect(last).toBeFocused();
  });

  test('applies the wrapper color config to every Button', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(customColorsScenarioId));

    const group = page.getByTestId('button-group');
    const buttons = group.getByRole('button');
    const expectedBackgroundColor = await resolveCssColorToken(page, invisibleBackgroundColorToken);
    const expectedTextColor = await resolveCssColorToken(page, customTextColorToken);
    const expectedBorderColor = await resolveCssColorToken(page, customBorderColorToken);

    await expect(group).toHaveAttribute('data-appearance', 'custom');
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute('data-appearance', 'custom');
      await expect(button).toHaveCSS('background-color', expectedBackgroundColor);
      await expect(button).toHaveCSS('color', expectedTextColor);
      await expect(button).toHaveCSS('box-shadow', `${expectedBorderColor} 0px 0px 0px 1px inset`);
    }
  });

  test('keeps native Enter and Space activation', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardScenarioId));

    const first = page.getByTestId('button-group-first');
    await first.evaluate((element) => {
      let clickCount = 0;
      element.addEventListener('click', () => {
        clickCount += 1;
        element.setAttribute('data-click-count', String(clickCount));
      });
    });

    await first.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');

    await expect(first).toHaveAttribute('data-click-count', '2');
  });

  test('connects solid Buttons with a one-pixel separator and only outer corner radii', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const buttons = page.getByTestId('button-group').getByRole('button');
    const boxes = await buttons.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().toJSON()),
    );

    expect(boxes[1].left).toBeCloseTo(boxes[0].right + 2, 1);
    expect(boxes[2].left).toBeCloseTo(boxes[1].right + 2, 1);
    await expect(buttons.first()).toHaveCSS('border-top-left-radius', '4px');
    await expect(buttons.first()).toHaveCSS('border-top-right-radius', '0px');
    await expect(buttons.nth(1)).toHaveCSS('border-radius', '0px');
    await expect(buttons.last()).toHaveCSS('border-top-left-radius', '0px');
    await expect(buttons.last()).toHaveCSS('border-top-right-radius', '4px');
  });

  test('overlaps outline borders without changing Button geometry during interaction', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(outlineScenarioId));

    const buttons = page.getByTestId('button-group').getByRole('button');
    const before = await buttons.nth(1).boundingBox();
    const boxes = await buttons.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().toJSON()),
    );

    expect(boxes[1].left).toBeCloseTo(boxes[0].right - 1, 1);
    expect(boxes[2].left).toBeCloseTo(boxes[1].right - 1, 1);

    await buttons.nth(1).hover();
    await page.mouse.down();
    expect(await buttons.nth(1).boundingBox()).toEqual(before);
    await page.mouse.up();

    await buttons.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(buttons.nth(1)).toBeFocused();
    expect(await buttons.nth(1).boundingBox()).toEqual(before);
  });

  test('uses Button heights for every group dimension', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(dimensionsScenarioId));

    for (const [dimension, height] of Object.entries(dimensions)) {
      const group = page.getByTestId(`button-group-${dimension}`);

      await expect(group).toHaveAttribute('data-dimension', dimension);
      for (const button of await group.getByRole('button').all()) {
        await expect(button).toHaveCSS('height', `${height}px`);
      }
    }
  });

  test('preserves individual disabled, inactive and loading behavior', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(statesScenarioId));

    const disabled = page.getByTestId('button-group-disabled');
    const inactive = page.getByTestId('button-group-inactive');
    const expectedBackground = await resolveCssColorToken(page, solidBackgroundColorToken);
    const expectedDisabledText = await resolveCssColorToken(page, solidColoredDisabledTextColorToken);

    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveAttribute('tabindex', '-1');
    await expect(disabled).toHaveCSS('background-color', expectedBackground);
    await expect(disabled).toHaveCSS('color', expectedDisabledText);
    await expect(inactive).toHaveAttribute('aria-disabled', 'true');
    await expect(inactive).toHaveCSS('background-color', expectedBackground);
    await expect(inactive).toHaveCSS('color', expectedDisabledText);
    await expect(page.getByTestId('button-group-loading')).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('button-group-loading')).toHaveCSS('cursor', 'progress');
  });

  test('updates Button colors and outer radius when playground settings change', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const first = page.getByTestId('button-group-first');
    const expectedBackground = await resolveCssColorToken(page, solidBackgroundColorToken);

    await expect(first).toHaveCSS('background-color', expectedBackground);
    await expect(first).toHaveCSS('border-top-left-radius', '4px');

    await page.locator('#playground-theme').selectOption('dark');
    const expectedDarkBackground = await resolveCssColorToken(page, solidBackgroundColorToken);
    await expect(first).toHaveCSS('background-color', expectedDarkBackground);

    await page.locator('#playground-corner-radius').selectOption('8');
    await expect(first).toHaveCSS('border-top-left-radius', '8px');
  });
});

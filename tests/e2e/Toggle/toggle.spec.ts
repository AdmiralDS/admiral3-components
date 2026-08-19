import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'toggle/default';
const statesScenarioId = 'toggle/states';

test.describe('Toggle playground', () => {
  test('supports mouse and keyboard interaction and resolves theme styles', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('toggle');
    const label = component.locator('xpath=..');
    const control = component.locator('xpath=following-sibling::span[1]');
    const selectedColor = await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest');

    await expect(component).toBeVisible();
    await expect(page.getByText('Toggle text')).toBeVisible();
    await expect(component).toHaveRole('switch');
    await expect(component).not.toBeChecked();
    await expect(label).toHaveAttribute('data-dimension', 'm');
    await expect(control).toHaveCSS('width', '36px');
    await expect(control).toHaveCSS('height', '20px');

    const [labelBox, inputBox] = await Promise.all([label.boundingBox(), component.boundingBox()]);
    expect(inputBox).toEqual(labelBox);

    await label.click();
    await page.mouse.move(0, 0);
    await expect(component).toBeChecked();
    await expect(control).toHaveCSS('background-color', selectedColor);

    await component.focus();
    await component.press('Space');
    await expect(component).not.toBeChecked();

    await page.locator('#playground-theme').selectOption('dark');
    const selectedDarkColor = await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest');

    await component.click();
    await page.mouse.move(0, 0);
    await expect(component).toBeChecked();
    await expect(control).toHaveCSS('background-color', selectedDarkColor);
  });

  test('renders disabled and readOnly states and prevents their changes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(statesScenarioId));

    const disabled = page.getByRole('switch', { name: 'Disabled', exact: true });
    const readOnlyInactive = page.getByRole('switch', { name: 'Read only', exact: true });
    const readOnly = page.getByRole('switch', { name: 'Read only active', exact: true });
    const disabledControl = disabled.locator('xpath=following-sibling::span[1]');
    const readOnlyInactiveThumb = readOnlyInactive.locator('xpath=following-sibling::span[1]/span');
    const readOnlyControl = readOnly.locator('xpath=following-sibling::span[1]');
    const readOnlyThumb = readOnlyControl.locator('span');
    const disabledBackground = await resolveCssColorToken(page, '--admiral-color-neutral-base-opacity-rest');
    const disabledThumb = await resolveCssColorToken(page, '--admiral-color-neutral-text-disable-rest');
    const selectedDisabled = await resolveCssColorToken(page, '--admiral-color-primary-base-1-disable');
    const disabledActiveThumb = await resolveCssColorToken(page, '--admiral-color-neutral-base-1-rest');

    await expect(disabled).toBeDisabled();
    await expect(disabled.locator('xpath=..')).toHaveCSS('cursor', 'not-allowed');
    await expect(disabledControl).toHaveCSS('background-color', disabledBackground);

    await expect(readOnlyInactiveThumb).toHaveCSS('background-color', disabledThumb);
    await expect(readOnly).toBeChecked();
    await expect(readOnly).toHaveAttribute('aria-readonly', 'true');
    await expect(readOnlyControl).toHaveCSS('background-color', selectedDisabled);
    await expect(readOnlyThumb).toHaveCSS('background-color', disabledActiveThumb);

    await readOnly.locator('xpath=..').click();
    await expect(readOnly).toBeChecked();

    await readOnly.focus();
    await page.keyboard.press('Space');
    await expect(readOnly).toBeChecked();
  });
});

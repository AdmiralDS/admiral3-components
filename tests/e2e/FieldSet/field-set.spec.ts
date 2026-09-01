import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'field-set/default';
const statesScenarioId = 'field-set/states';

test.describe('FieldSet playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('fieldset');

    await expect(component).toBeVisible();
    await expect(component.getByText('Данные пользователя')).toBeVisible();
    await expect(component.getByRole('textbox')).toHaveCount(3);
  });

  test('exposes required, error and native disabled states with theme-aware colors', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(statesScenarioId));

    const required = page.locator('fieldset[data-required]:not([aria-invalid])');
    const requiredLegend = required.locator('legend');
    const error = page.locator('fieldset[aria-invalid="true"]');
    const errorLegend = error.locator('legend');
    const disabled = page.locator('fieldset:disabled');
    const disabledLegend = disabled.locator('legend');
    const requiredMark = requiredLegend
      .locator('xpath=.')
      .evaluate((element) => getComputedStyle(element, '::after').content);
    const textColorToken = '--admiral-color-neutral-text-1-rest';
    const requiredColorToken = '--admiral-color-error-text-1-rest';
    const disabledColorToken = '--admiral-color-neutral-text-disable-rest';

    await expect(required).toHaveAttribute('data-required', '');
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(disabled).toHaveAttribute('disabled', '');
    await expect(disabled.getByRole('textbox')).toHaveCount(3);
    for (const input of await disabled.getByRole('textbox').all()) {
      await expect(input).toBeDisabled();
    }
    await expect(requiredMark).resolves.toBe('" *" / ""');

    for (const theme of ['light', 'dark'] as const) {
      await page.locator('#playground-theme').selectOption(theme);
      await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', theme);

      const [textColor, requiredColor, disabledColor] = await Promise.all([
        resolveCssColorToken(page, textColorToken),
        resolveCssColorToken(page, requiredColorToken),
        resolveCssColorToken(page, disabledColorToken),
      ]);

      await expect(requiredLegend).toHaveCSS('color', textColor);
      await expect(errorLegend).toHaveCSS('color', requiredColor);
      await expect(disabledLegend).toHaveCSS('color', disabledColor);
      await expect(requiredLegend).toHaveCSS('color', textColor);

      const requiredMarkColor = await requiredLegend.evaluate((element) => getComputedStyle(element, '::after').color);
      expect(requiredMarkColor).toBe(requiredColor);
    }
  });
});

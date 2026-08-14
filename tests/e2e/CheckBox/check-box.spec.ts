import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'check-box/default';
const statesScenarioId = 'check-box/states';
const tableSelectionScenarioId = 'check-box/table-selection';

test.describe('CheckBox playground', () => {
  test('supports mouse and keyboard interaction and resolves theme colors', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const input = page.getByTestId('check-box');
    const label = input.locator('xpath=..');
    const control = input.locator('xpath=following-sibling::span[1]');
    const expectedColor = await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest');
    const expectedHoverColor = await resolveCssColorToken(page, '--admiral-color-neutral-base-1-hover');

    await expect(label).toBeVisible();
    await expect(label).toHaveAttribute('data-dimension', 'm');
    await expect(control).toHaveCSS('width', '20px');
    await expect(control).toHaveCSS('height', '20px');
    await expect(control).toHaveCSS('transition-duration', '0.1s, 0.1s');
    await expect(control).toHaveCSS('transition-timing-function', 'cubic-bezier(0, 0, 1, 1), cubic-bezier(0, 0, 1, 1)');

    const [labelBox, inputBox] = await Promise.all([label.boundingBox(), input.boundingBox()]);
    expect(inputBox).toEqual(labelBox);

    await label.hover();
    await expect(control).toHaveCSS('background-color', expectedHoverColor);

    await input.click();
    await expect(input).toBeChecked();
    await page.mouse.move(0, 0);
    await expect(control).toHaveCSS('background-color', expectedColor);

    await input.focus();
    await page.keyboard.press('Space');
    await expect(input).not.toBeChecked();

    await page.locator('#playground-theme').selectOption('dark');
    const expectedDarkColor = await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest');

    await label.click();
    await page.mouse.move(0, 0);
    await expect(control).toHaveCSS('background-color', expectedDarkColor);
  });

  test('renders indeterminate, error, disabled and readOnly states', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(statesScenarioId));

    const tables = page.getByRole('table', { name: 'Состояния CheckBox по размерам' });
    const table = tables.first();
    const tableWithExtraText = tables.last();
    const indeterminate = table.getByRole('checkbox', { name: 'Indeterminate, размер M', exact: true });
    const error = table.getByRole('checkbox', { name: 'Error, размер M' });
    const disabled = table.getByRole('checkbox', { name: 'Disabled, размер M', exact: true });
    const readOnlyRest = table.getByRole('checkbox', { name: 'Read Only, размер M', exact: true });
    const readOnly = table.getByRole('checkbox', { name: 'Read Only Checked, размер M', exact: true });
    const disabledBorderColor = await resolveCssColorToken(page, '--admiral-color-neutral-stroke-1-rest');

    await expect(tables).toHaveCount(2);
    await expect(table).toBeVisible();
    await expect(table.getByRole('checkbox')).toHaveCount(30);
    await expect(tableWithExtraText.getByRole('checkbox')).toHaveCount(30);
    await expect(tableWithExtraText.getByText('Дополнительный текст')).toHaveCount(30);

    const dimensionGeometry = {
      M: { labelMargin: '2px', controlOffset: 0 },
      S: { labelMargin: '2px', controlOffset: 0 },
      XS: { labelMargin: '0px', controlOffset: 1 },
    };

    for (const [dimension, { labelMargin, controlOffset }] of Object.entries(dimensionGeometry)) {
      const input = table.getByRole('checkbox', { name: `Default, размер ${dimension}`, exact: true });
      const control = input.locator('xpath=following-sibling::span[1]');
      const label = input.locator('xpath=following-sibling::span[2]');
      const [controlBox, labelBox] = await Promise.all([control.boundingBox(), label.boundingBox()]);

      expect(controlBox && labelBox ? controlBox.y - labelBox.y : undefined).toBe(controlOffset);
      await expect(label).toHaveCSS('padding-top', '0px');
      await expect(label).toHaveCSS('margin-top', labelMargin);
      await expect(label).toHaveCSS('margin-bottom', labelMargin);
    }

    await expect(indeterminate).toHaveJSProperty('indeterminate', true);
    await expect(indeterminate).toHaveAttribute('aria-checked', 'mixed');
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveCSS('cursor', 'not-allowed');
    await expect(disabled.locator('xpath=..')).toHaveCSS('cursor', 'not-allowed');
    await expect(disabled.locator('xpath=following-sibling::span[1]')).toHaveCSS('border-color', disabledBorderColor);
    await expect(readOnlyRest.locator('xpath=following-sibling::span[1]')).toHaveCSS(
      'border-color',
      disabledBorderColor,
    );
    await expect(readOnly).toBeChecked();
    await expect(readOnly).toHaveAttribute('aria-readonly', 'true');

    await readOnly.locator('xpath=..').click();
    await expect(readOnly).toBeChecked();

    await readOnly.focus();
    await page.keyboard.press('Space');
    await expect(readOnly).toBeChecked();
  });

  test('keeps the intended success and minus icon placement in every dimension', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(statesScenarioId));

    const table = page.getByRole('table', { name: 'Состояния CheckBox по размерам' }).first();

    const expectedOffsets = {
      Checked: {
        M: { horizontal: 0.5, vertical: 0.5 },
        S: { horizontal: 0.6, vertical: -0.13 },
        XS: { horizontal: 0.4, vertical: -0.26 },
      },
      Indeterminate: {
        M: { horizontal: 0, vertical: 0 },
        S: { horizontal: 0, vertical: 0.6 },
        XS: { horizontal: 0.5, vertical: 0.4 },
      },
    } as const;

    for (const state of ['Checked', 'Indeterminate']) {
      const row = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: state, exact: true }) });

      for (const dimension of ['M', 'S', 'XS']) {
        const input = row.getByRole('checkbox', { name: `${state}, размер ${dimension}`, exact: true });
        const background = input.locator('xpath=following-sibling::span[1]');
        const path = background.locator('svg path');
        const offsets = await Promise.all([background.boundingBox(), path.boundingBox()]);
        const [backgroundBox, pathBox] = offsets;

        expect(backgroundBox).not.toBeNull();
        expect(pathBox).not.toBeNull();

        if (!backgroundBox || !pathBox) continue;

        const left = pathBox.x - backgroundBox.x;
        const right = backgroundBox.x + backgroundBox.width - pathBox.x - pathBox.width;
        const top = pathBox.y - backgroundBox.y;
        const bottom = backgroundBox.y + backgroundBox.height - pathBox.y - pathBox.height;
        const expectedOffset =
          expectedOffsets[state as keyof typeof expectedOffsets][
            dimension as keyof (typeof expectedOffsets)[keyof typeof expectedOffsets]
          ];

        expect(Math.abs(left - right - expectedOffset.horizontal)).toBeLessThanOrEqual(0.08);
        expect(Math.abs(top - bottom - expectedOffset.vertical)).toBeLessThanOrEqual(0.08);
      }
    }
  });

  test('selects individual and all table rows', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(tableSelectionScenarioId));

    const table = page.getByRole('table', { name: 'Документы' });
    const selectAll = table.getByRole('checkbox', { name: 'Выбрать все строки' });
    const firstRow = table.getByRole('checkbox', { name: 'Выбрать строку «Ежемесячный отчёт»' });
    const rowCheckBoxes = table.locator('tbody').getByRole('checkbox');

    await expect(rowCheckBoxes).toHaveCount(4);
    await firstRow.check();
    await expect(firstRow).toBeChecked();
    await expect(selectAll).toHaveJSProperty('indeterminate', true);

    await selectAll.check();
    for (let index = 0; index < 4; index += 1) {
      await expect(rowCheckBoxes.nth(index)).toBeChecked();
    }
    await expect(selectAll).toBeChecked();

    await selectAll.uncheck();
    for (let index = 0; index < 4; index += 1) {
      await expect(rowCheckBoxes.nth(index)).not.toBeChecked();
    }
  });
});

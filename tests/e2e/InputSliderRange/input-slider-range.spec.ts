import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, getTabKey } from '../utils';

test.describe('InputSliderRange playground', () => {
  for (const edge of ['min', 'max'] as const) {
    test(`submits valid canonical values after an edge fallback at ${edge}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
      const lowerField = page.getByRole('textbox', { name: 'От', exact: true });
      const upperField = page.getByRole('textbox', { name: 'До', exact: true });
      const lower = page.getByRole('slider', { name: 'От', exact: true });
      // Дробный сосед оставляет у края меньше места, чем default minValueDistance=step=1.
      await (edge === 'max' ? upperField : lowerField).fill(edge === 'max' ? '99.2' : '0.8');
      const box = await lower.locator('..').boundingBox();
      if (!box) throw new Error('Missing range track');
      const y = box.y + box.height / 2;
      await page.mouse.move(box.x + box.width * (edge === 'max' ? 0.25 : 0.75), y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * (edge === 'max' ? 1 : 0), y, { steps: 12 });
      await page.mouse.up();
      await expect(lowerField).toHaveValue(edge === 'max' ? '99' : '0');
      await expect(upperField).toHaveValue(edge === 'max' ? '100' : '1');
      expect(await lowerField.evaluate((input: HTMLInputElement) => input.form?.checkValidity())).toBe(true);
      await page.getByRole('button', { name: 'Отправить', exact: true }).click();
      await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText(
        edge === 'max' ? '{"lower":"99","upper":"100"}' : '{"lower":"0","upper":"1"}',
      );
    });
  }

  for (const swap of [false, true]) {
    test(`restores the default step gap and submits the corrected canonical pair, swap=${swap}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
      const lower = page.getByRole('slider', { name: 'От', exact: true });
      const upper = page.getByRole('slider', { name: 'До', exact: true });
      const box = await lower.locator('..').boundingBox();
      if (!box) throw new Error('Missing range track');
      const y = box.y + box.height / 2;
      await page.mouse.move(box.x + box.width * 0.25, y);
      await page.mouse.down();
      if (swap) await page.mouse.move(box.x + box.width * 0.9, y, { steps: 12 });
      await page.mouse.move(box.x + box.width * 0.75, y, { steps: 12 });
      await expect(lower).toHaveValue('75');
      await expect(upper).toHaveValue('75');
      await page.mouse.up();
      await expect(lower).toHaveValue(swap ? '75' : '74');
      await expect(upper).toHaveValue(swap ? '76' : '75');
      await page.getByRole('button', { name: 'Отправить', exact: true }).click();
      await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText(
        swap ? '{"lower":"75","upper":"76"}' : '{"lower":"74","upper":"75"}',
      );
    });
  }

  test('swaps dragged bounds and serializes the ordered pair through native form fields', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
    const lower = page.getByRole('slider', { name: 'От', exact: true });
    const upper = page.getByRole('slider', { name: 'До', exact: true });
    const box = await lower.locator('..').boundingBox();
    if (!box) throw new Error('Missing range track');
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.25, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.9, y, { steps: 12 });
    await expect(lower).toHaveValue('75');
    await expect(upper).toHaveValue('90');
    await expect(page.getByRole('textbox', { name: 'От', exact: true })).toHaveValue('75');
    await expect(page.getByRole('textbox', { name: 'До', exact: true })).toHaveValue('90');
    await page.mouse.up();
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{"lower":"75","upper":"90"}');
  });

  test('renders two equal-width fields and synchronizes keyboard selection', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/default'));
    const root = page.getByTestId('input-slider-range');
    const fields = root.getByRole('textbox');
    const lower = root.getByRole('slider', { name: 'От', exact: true });
    const upper = root.getByRole('slider', { name: 'До', exact: true });
    await expect(fields.nth(0)).toHaveValue('25');
    await expect(fields.nth(1)).toHaveValue('75');
    // Сравниваем поля целиком: ширина редактируемой части зависит от длины префикса «От» или «До».
    const boxes = await Promise.all([
      fields.nth(0).locator('..').boundingBox(),
      fields.nth(1).locator('..').boundingBox(),
    ]);
    expect(boxes[0]?.width).toBe(boxes[1]?.width);
    await lower.focus();
    await lower.press('ArrowRight');
    await expect(fields.nth(0)).toHaveValue('26');
    await upper.focus();
    await upper.press('ArrowLeft');
    await expect(fields.nth(1)).toHaveValue('74');
    await expect(lower).toHaveValue('26');
  });

  test('clamps crossing bounds on blur while retaining empty fields', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/controlled'));
    const lower = page.getByRole('textbox', { name: 'От', exact: true });
    const upper = page.getByRole('textbox', { name: 'До', exact: true });
    await lower.fill('90');
    await expect(lower).toHaveAttribute('aria-invalid', 'true');
    await lower.press(getTabKey(browserName));
    await expect(lower).toHaveValue('74');
    await upper.fill('10');
    await upper.press(getTabKey(browserName));
    await expect(upper).toHaveValue('75');
    await lower.fill('');
    await lower.press(getTabKey(browserName));
    await expect(lower).toHaveValue('');
    await expect(page.getByRole('slider', { name: 'От', exact: true })).toHaveValue('74');
    await expect(page.getByRole('status', { name: 'Исходный интервал' })).toHaveText('["","75"]');
    await page.getByRole('button', { name: 'Установить 10–90' }).click();
    await expect(lower).toHaveValue('10');
    await expect(upper).toHaveValue('90');
  });

  test('supports external currency masks and sends two unformatted strings', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/currency'));
    const lower = page.getByRole('textbox', { name: 'Сумма от', exact: true });
    const upper = page.getByRole('textbox', { name: 'Сумма до', exact: true });
    const lowerSlider = page.getByRole('slider', { name: 'Сумма от', exact: true });
    const upperSlider = page.getByRole('slider', { name: 'Сумма до', exact: true });
    await expect(lower).toHaveValue('10 000,50 руб');
    await expect(upper).toHaveValue('15 000,00 руб');
    await lower.fill('12345.67');
    await expect(lower).toHaveValue('12 345,67 руб');
    await expect(lowerSlider).toHaveValue('12345.67');
    await upperSlider.focus();
    await upperSlider.press('ArrowRight');
    await expect(upper).toHaveValue('15 000,01 руб');
    await expect(page.getByRole('tooltip')).toHaveText('15 000,01 руб');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText(
      '{"lower":"12345.67","upper":"15000.01"}',
    );
    await page.getByRole('button', { name: 'Очистить поле', exact: true }).first().click();
    await upperSlider.focus();
    await upperSlider.press('ArrowRight');
    await expect(lower).toHaveValue('');
    await expect(lowerSlider).toHaveValue('12345.67');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{"lower":"","upper":"15000.02"}');
  });

  test('blocks Enter and requestSubmit for invalid input, and normalizes before submission on blur', async ({
    page,
  }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
    const lower = page.getByRole('textbox', { name: 'От', exact: true });
    const upper = page.getByRole('textbox', { name: 'До', exact: true });
    const submitted = page.getByRole('status', { name: 'Отправлено' });
    await lower.fill('90');
    await lower.press('Enter');
    await expect(submitted).toBeEmpty();
    await lower.evaluate((input: HTMLInputElement) => input.form?.requestSubmit());
    await expect(submitted).toBeEmpty();
    const entries = await lower.evaluate((input: HTMLInputElement) => Object.fromEntries(new FormData(input.form!)));
    expect(entries).toEqual({ lower: '', upper: '75' });
    await upper.focus();
    await expect(lower).toHaveValue('74');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(submitted).toHaveText('{"lower":"74","upper":"75"}');
  });

  test('required applies to both fields, reset restores values and clears invalid drafts', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
    const lower = page.getByRole('textbox', { name: 'От', exact: true });
    const upper = page.getByRole('textbox', { name: 'До', exact: true });
    await lower.fill('');
    await upper.fill('');
    await page.getByRole('button', { name: 'Вызвать requestSubmit' }).click();
    await expect(lower).toBeFocused();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toBeEmpty();
    await lower.fill('30');
    await upper.fill('-');
    await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
    await expect(lower).toHaveValue('25');
    await expect(upper).toHaveValue('75');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{"lower":"25","upper":"75"}');
  });

  test('disabled fieldset omits both values, readOnly submits them and hides sliders', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/native-form'));
    await page.getByRole('button', { name: 'Переключить fieldset' }).click();
    for (const field of await page.getByRole('textbox').all()) await expect(field).toBeDisabled();
    for (const slider of await page.getByRole('slider').all()) await expect(slider).toBeDisabled();
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{}');
    await page.getByRole('button', { name: 'Переключить fieldset' }).click();
    await page.getByRole('button', { name: 'Переключить readOnly' }).click();
    await expect(page.getByRole('slider')).toHaveCount(0);
    for (const field of await page.getByRole('textbox').all()) await expect(field).toHaveAttribute('readonly');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{"lower":"25","upper":"75"}');
  });

  test('FormItem labels focus the first input and both bounds have distinct names', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider-range/form-item'));
    await page.getByText('Диапазон суммы', { exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Сумма от', exact: true })).toBeFocused();
    await expect(page.getByRole('textbox', { name: 'Сумма до', exact: true })).toHaveAttribute('required');
    await expect(page.getByRole('slider', { name: 'Сумма от', exact: true })).toHaveCount(1);
    await expect(page.getByRole('slider', { name: 'Сумма до', exact: true })).toHaveCount(1);
  });
});

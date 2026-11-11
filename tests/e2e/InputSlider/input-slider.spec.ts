import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, getTabKey } from '../utils';

test.describe('InputSlider playground', () => {
  test('composes external Maskito with parsing, Slider formatting, clearing and native submission', async ({
    page,
  }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/maskito'));
    const input = page.getByRole('textbox', { name: 'Сумма в рублях' });
    const slider = page.getByRole('slider', { name: 'Сумма в рублях' });
    await expect(input).toHaveValue('10 000,50 руб');
    await expect(slider).toHaveValue('10000.5');
    await input.fill('12345.67');
    await expect(input).toHaveValue('12 345,67 руб');
    await expect(slider).toHaveValue('12345.67');
    await slider.focus();
    await slider.press('ArrowRight');
    await expect(input).toHaveValue('12 345,68 руб');
    await expect(slider).toBeFocused();
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('12345.68');
    await page.getByRole('button', { name: 'Очистить поле' }).click();
    await expect(input).toHaveValue('');
    await expect(slider).toHaveValue('12345.68');
    await slider.focus();
    await slider.press('ArrowLeft');
    await expect(input).toHaveValue('12 345,67 руб');
  });

  test('preserves editing, clears and synchronizes keyboard and pointer changes', async ({ page, browserName }) => {
    const tabKey = getTabKey(browserName);
    await page.goto(getPlaygroundScenarioPath('input-slider/default'));
    const input = page.getByRole('textbox', { name: 'Сумма' });
    const slider = page.getByRole('slider', { name: 'Сумма' });
    await input.fill('120');
    await expect(input).toHaveValue('120');
    await expect(slider).toHaveValue('50');
    await input.press(tabKey);
    await expect(input).toHaveValue('100');
    await slider.focus();
    await slider.press('ArrowLeft');
    await expect(input).toHaveValue('99');
    await expect(slider).toBeFocused();
    await slider.press('Home');
    await expect(input).toHaveValue('0');
    const box = await slider.boundingBox();
    if (!box) throw new Error('Missing slider bounds');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(input).toHaveValue('50');
    await input.focus();
    await page.getByRole('button', { name: 'Очистить поле' }).click();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await input.fill('37');
    await input.press(tabKey);
    // Clear is the next focusable element when Input is populated.
    await expect(page.getByRole('button', { name: 'Очистить поле' })).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(slider).toBeFocused();
    await slider.press('ArrowRight');
    await expect(input).toHaveValue('38');
  });

  test('keeps controlled input editable and accepts external value updates', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/controlled'));
    const input = page.getByRole('textbox', { name: 'Значение' });
    await input.fill('075');
    await expect(input).toHaveValue('075');
    await expect(page.getByText('Выбрано: 75')).toBeVisible();
    await page.getByRole('button', { name: 'Установить 25' }).click();
    await expect(input).toHaveValue('25');
    await expect(page.getByRole('slider')).toHaveValue('25');
  });

  test('snaps to marks and supports their pointer selection', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/marks'));
    const input = page.getByRole('textbox', { name: 'Сумма вклада' });
    await input.fill('80');
    await expect(page.getByRole('slider', { name: 'Сумма вклада', exact: true })).toHaveValue('100');
    await input.press('Tab');
    await expect(input).toHaveValue('100');
    await input.fill('');
    await input.press('Tab');
    await expect(input).toHaveValue('');
    await expect(page.getByRole('slider', { name: 'Сумма вклада', exact: true })).toHaveValue('100');
    await page.getByRole('button', { name: '150 ₽' }).click();
    await expect(input).toHaveValue('150');
    await expect(page.getByRole('slider', { name: 'Сумма вклада', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(input).toHaveValue('100');
  });

  test('connects an external FormItem label and description and keeps both controls in Tab order', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/form-item'));
    const input = page.getByRole('textbox', { name: 'Сумма' });
    const slider = page.getByRole('slider', { name: 'Сумма' });
    await page.getByText('Сумма', { exact: true }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAccessibleDescription('Выберите сумму от 0 до 100 ₽.');
    await input.press('Tab');
    await expect(slider).toBeFocused();
    await expect(slider).toHaveAccessibleDescription('Выберите сумму от 0 до 100 ₽.');
    await slider.press('ArrowRight');
    await expect(input).toHaveValue('51');
  });

  test('submits one field per value and resets uncontrolled and external fields', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/native-form'));
    const input = page.getByRole('textbox', { name: 'Сумма', exact: true });
    const controlled = page.getByRole('textbox', { name: 'Controlled', exact: true });
    const external = page.getByRole('textbox', { name: 'Внешнее поле', exact: true });
    await input.fill('70');
    await controlled.fill('60');
    await external.fill('90');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText(
      '{"amount":"70","controlled":"60","external":"90"}',
    );
    await page.getByRole('button', { name: 'Сбросить' }).click();
    await expect(input).toHaveValue('20');
    await expect(controlled).toHaveValue('60');
    await expect(external).toHaveValue('10');
    await expect(page.getByRole('slider', { name: 'Сумма', exact: true })).toHaveValue('20');
    await expect(page.getByRole('slider', { name: 'Внешнее поле', exact: true })).toHaveValue('10');
  });

  test('validates required, unfinished and out-of-range text for all native submit paths', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/native-form'));
    const input = page.getByRole('textbox', { name: '\u0421\u0443\u043c\u043c\u0430', exact: true });
    const submitted = page.getByRole('status', {
      name: '\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e',
    });
    const form = page.locator('#input-slider-form');
    for (const invalid of ['', '-']) {
      await input.fill(invalid);
      await input.press('Enter');
      await expect(submitted).toBeEmpty();
      await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
      await expect(submitted).toBeEmpty();
      await page
        .getByRole('button', { name: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c', exact: true })
        .click();
      await expect(submitted).toBeEmpty();
      expect(await form.evaluate((element: HTMLFormElement) => new FormData(element).getAll('amount'))).toEqual(['']);
      await expect(input).toHaveValue(invalid);
    }
    await input.fill('120');
    await input.press('Enter');
    await expect(submitted).toBeEmpty();
    await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
    await expect(submitted).toBeEmpty();
    await input.blur();
    await expect(input).toHaveValue('100');
    expect(await form.evaluate((element: HTMLFormElement) => new FormData(element).getAll('amount'))).toEqual(['100']);
    for (const method of ['enter', 'click', 'requestSubmit']) {
      await input.fill(method === 'enter' ? '025' : method === 'click' ? '1.5' : '75');
      const numeric = String(Number(await input.inputValue()));
      if (method === 'enter') await input.press('Enter');
      else if (method === 'click')
        await page
          .getByRole('button', { name: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c', exact: true })
          .click();
      else await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
      await expect(submitted).toHaveText(JSON.stringify({ amount: numeric, controlled: '40', external: '10' }));
    }
  });

  test('keeps the last Slider position during unfinished text entry', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/default'));
    const input = page.getByRole('textbox', { name: '\u0421\u0443\u043c\u043c\u0430' });
    await input.fill('-');
    await expect(input).toHaveValue('-');
    await expect(page.getByRole('slider')).toHaveValue('50');
  });

  test('submits canonical values in readOnly and empty optional values without duplicate entries', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/native-form'));
    const input = page.getByRole('textbox', { name: 'Сумма', exact: true });
    const controlled = page.getByRole('textbox', { name: 'Controlled', exact: true });
    await input.fill('070');
    await controlled.fill('');
    await page.getByRole('button', { name: 'Переключить readOnly' }).click();
    await expect(input).toHaveAttribute('readonly');
    await expect(input).toHaveValue('70');
    await expect(page.getByRole('slider', { name: 'Сумма', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText(
      '{"amount":"70","controlled":"","external":"10"}',
    );
    expect(
      await page
        .locator('#input-slider-form')
        .evaluate((element: HTMLFormElement) => new FormData(element).getAll('amount')),
    ).toEqual(['70']);
  });

  test('respects disabled fieldset and resumes editing after enabling it', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('input-slider/native-form'));
    const input = page.getByRole('textbox', { name: 'Сумма', exact: true });
    const slider = page.getByRole('slider', { name: 'Сумма', exact: true });
    const toggle = page.getByRole('button', { name: 'Переключить fieldset' });
    await toggle.click();
    await expect(input).toBeDisabled();
    await expect(slider).toBeDisabled();
    await page.getByRole('button', { name: '100', exact: true }).first().click({ force: true });
    await expect(input).toHaveValue('20');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Отправлено' })).toHaveText('{"external":"10"}');
    await toggle.click();
    await slider.focus();
    await slider.press('ArrowRight');
    await expect(input).toHaveValue('21');
  });
});

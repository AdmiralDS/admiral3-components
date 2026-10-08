import { expect, test } from '@playwright/test';

import { getTabKey, getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

test.describe('TextArea playground', () => {
  for (const { name, label, token } of [
    { name: 'default', label: 'Без статуса', token: '--admiral-color-neutral-stroke-2-focus' },
    { name: 'error', label: 'Ошибка', token: '--admiral-color-error-stroke-1-rest' },
    { name: 'success', label: 'Успех', token: '--admiral-color-success-stroke-1-rest' },
  ]) {
    test(`shows the focus border for ${name} status and restores its width on blur`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('text-area/focus'));
      const control = page.getByRole('textbox', { name: label, exact: true });
      const border = control.locator('..').locator('[data-role="input-border"]');
      const expectedColor = await resolveCssColorToken(page, token);

      await expect(border).toHaveCSS('border-top-width', '1px');
      await control.click();
      await expect(control).toBeFocused();
      await expect(border).toHaveCSS('border-top-width', '2px');
      await expect(border).toHaveCSS('border-top-color', expectedColor);

      await control.blur();
      await expect(control).not.toBeFocused();
      await expect(border).toHaveCSS('border-top-width', '1px');
    });
  }

  test('uses a native textarea and clears with keyboard, restoring focus', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/default'));
    const control = page.getByRole('textbox', { name: 'Текст', exact: true });
    const clear = page.getByRole('button', { name: 'Очистить поле' });
    await expect(control).toHaveJSProperty('tagName', 'TEXTAREA');
    await expect(clear).toBeHidden();
    await control.fill('First\nSecond');
    await control.press(getTabKey(browserName));
    await expect(clear).toBeFocused();
    await clear.press('Enter');
    await expect(control).toHaveValue('');
    await expect(control).toBeFocused();
    await expect(clear).toBeHidden();
  });

  test('grows and shrinks with content and clamps height at maxRows', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/auto-height'));
    const control = page.getByRole('textbox', { name: 'Текст', exact: true });
    await expect(control).toHaveCSS('height', '64px');
    await control.fill('One\nTwo\nThree');
    await expect(control).toHaveCSS('height', '88px');
    await control.fill('One\nTwo\nThree\nFour\nFive\nSix');
    await expect(control).toHaveCSS('height', '112px');
    expect(await control.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    await page.getByRole('button', { name: 'Очистить поле' }).click();
    await expect(control).toHaveCSS('height', '64px');
    await expect(control).toHaveCSS('resize', 'none');
  });

  test('recalculates autoHeight on width changes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/auto-height'));
    const control = page.getByRole('textbox', { name: 'Текст', exact: true });
    await control.fill('Several words that wrap onto more lines when the available width decreases.');
    const initialHeight = await control.evaluate((element) => element.clientHeight);
    await control.evaluate((element) => {
      element.parentElement!.style.width = '180px';
    });
    await expect.poll(() => control.evaluate((element) => element.clientHeight)).toBeGreaterThan(initialHeight);
  });

  test('supports native vertical resize and its row limits', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/resize'));
    const control = page.getByRole('textbox', { name: 'Текст', exact: true });
    await expect(control).toHaveCSS('resize', 'vertical');
    await expect(control).toHaveCSS('min-height', '64px');
    await expect(control).toHaveCSS('max-height', '136px');
  });

  test('resizes vertically by dragging and clamps height at maxRows', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit' && process.platform === 'linux',
      'Native textarea resize drag does not work in Linux WebKit',
    );

    await page.goto(getPlaygroundScenarioPath('text-area/resize'));
    const control = page.getByRole('textbox', { name: 'Текст', exact: true });
    const box = (await control.boundingBox())!;
    await page.mouse.move(box.x + box.width - 3, box.y + box.height - 3);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 3, box.y + box.height + 150, { steps: 10 });
    await page.mouse.up();
    await expect(control).toHaveCSS('height', '136px');
    await expect(control).toHaveCSS('width', `${box.width}px`);
  });

  test('submits and resets through a native form with FormItem count and validation', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/native-form'));
    const control = page.getByRole('textbox', { name: 'Сообщение' });
    await control.fill('Message');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();
    await expect(page.getByLabel('Отправленный текст')).toHaveText('Message');
    await control.fill('Hi');
    await expect(page.getByText('2 / 30', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Сбросить' }).click();
    await expect(control).toHaveValue('Initial');
    await expect(page.getByText('7 / 30', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Очистить поле' }).click();
    expect(await control.evaluate((element: HTMLTextAreaElement) => element.checkValidity())).toBe(false);
  });

  test('updates height and count for externally changed controlled values and clear', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('text-area/controlled'));
    const control = page.getByRole('textbox', { name: 'Сообщение' });
    await page.getByRole('button', { name: 'Задать текст' }).click();
    await expect(control).toHaveValue('One\nTwo\nThree');
    await expect(control).toHaveCSS('height', '88px');
    await expect(page.getByText('13 / 100', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Очистить поле' }).click();
    await expect(control).toHaveValue('');
    await expect(control).toHaveCSS('height', '64px');
    await expect(page.getByText('0 / 100', { exact: true })).toBeVisible();
  });

  for (const activation of ['keyboard', 'click'] as const) {
    test(`copies readOnly text and shows success for two seconds using Tooltip via ${activation}`, async ({
      page,
      browserName,
    }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: async (text: string) => {
              document.documentElement.dataset.copiedText = text;
            },
          },
        });
      });
      await page.goto(getPlaygroundScenarioPath('text-area/copy'));
      const copy = page.getByRole('button', { name: 'Копировать текст' });
      await page.getByRole('textbox').focus();
      await page.getByRole('textbox').press(getTabKey(browserName));
      await expect(copy).toBeFocused();
      await expect(page.getByRole('tooltip')).toHaveText('Копировать текст');
      if (activation === 'keyboard') await copy.press('Enter');
      else await copy.click();
      await expect(copy).toBeFocused();
      await expect(page.getByRole('tooltip')).toHaveText('Скопировано');
      await expect(page.locator('html')).toHaveAttribute('data-copied-text', 'Текст для копирования');
      await expect(page.getByRole('textbox')).toHaveValue('Текст для копирования');
      await expect(page.getByRole('tooltip')).toHaveText('Копировать текст', { timeout: 4000 });
      await copy.press('Escape');
      await expect(page.getByRole('tooltip')).toBeHidden();
    });
  }
});

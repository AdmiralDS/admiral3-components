import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, getTabKey, resolveCssColorToken } from '../utils';

test.describe('StepperProgress playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('renders the default controlled playground', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/default'));
    const root = page.getByTestId('stepper-progress');
    await expect(root.getByRole('progressbar')).toHaveAccessibleName('Подтверждение заявки');
    await expect(root.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    await expect(root).toContainText('3 из 6 шагов');
    await page.getByRole('button', { name: 'Следующий шаг', exact: true }).click();
    await expect(root.getByRole('progressbar')).toHaveAccessibleName('Обработка заявки');
  });

  test('skips the entire indicator in both Tab directions without activation', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    const root = page.getByTestId('stepper-progress');
    const before = page.getByTestId('before-progress');
    const after = page.getByTestId('after-progress');
    await before.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(after).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(before).toBeFocused();
    await expect(root.locator('button, a, input, [tabindex]')).toHaveCount(0);

    await root.evaluate((element) => element.focus());
    await expect(before).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await expect(root.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Шаг 1 из 6');
    await expect(root.getByRole('progressbar')).not.toBeFocused();
  });

  test('updates names, values and fill together while preserving external focus', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    const root = page.getByTestId('stepper-progress');
    const track = root.getByRole('progressbar');
    const indicator = track.locator(':scope > div');
    const next = page.getByRole('button', { name: 'Далее', exact: true });
    await next.click();
    await expect(next).toBeFocused();
    await expect(track).toHaveAccessibleName('Проверка документов');
    await expect(track).toHaveAccessibleDescription('Этапы обработки заявки Далее — Подтверждение заявки');
    await expect(root).toContainText('2 из 6 шагов');
    await next.click();
    await expect(track).toHaveAttribute('aria-valuenow', '50');
    await expect(track).toHaveAttribute('aria-valuetext', 'Шаг 3 из 6');
    await expect
      .poll(async () => {
        const trackBox = await track.boundingBox();
        const indicatorBox = await indicator.boundingBox();
        return indicatorBox!.width / trackBox!.width;
      })
      .toBeCloseTo(0.5, 2);

    await page.getByRole('button', { name: 'Сменить формат', exact: true }).click();
    await expect(root).toContainText('50%');
    await expect(track).toHaveAttribute('aria-valuetext', 'Шаг 3 из 6, 50%');
    await page.getByRole('button', { name: 'Назад', exact: true }).click();
    await expect(root).toContainText('33%');
    await expect(track).toHaveAttribute('aria-valuetext', 'Шаг 2 из 6, 33%');
    await expect.poll(async () => Number(await track.getAttribute('aria-valuenow'))).toBeCloseTo(100 / 3, 8);
    await page.getByRole('button', { name: 'Последний шаг', exact: true }).click();
    await expect(track).toHaveAttribute('aria-valuenow', '100');
    await expect(track).toHaveAttribute('aria-valuetext', 'Шаг 6 из 6, 100%');
    await expect(root.getByText(/^Далее —/)).toHaveCount(0);
    await expect(track).toHaveAccessibleDescription('Этапы обработки заявки');
  });

  test('matches desktop geometry and themes using existing tokens', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    await page.evaluate(() => document.fonts.ready);
    const root = page.getByTestId('stepper-progress');
    const track = root.getByRole('progressbar');
    const indicator = track.locator(':scope > div');
    const current = root.getByText('Заполнение данных', { exact: true });
    const value = root.getByText('1 из 6 шагов', { exact: true });
    await expect(root).toHaveCSS('min-width', '388px');
    await expect(track).toHaveCSS('height', '4px');
    await expect(track).toHaveCSS('border-radius', '2px');
    await expect(current).toHaveCSS('font-size', '14px');
    await expect(current).toHaveCSS('line-height', '20px');
    await expect(root.getByText(/^Далее —/)).toHaveCSS('font-size', '12px');
    const currentBox = await current.boundingBox();
    const valueBox = await value.boundingBox();
    const trackBox = await track.boundingBox();
    const nextBox = await root.getByText(/^Далее —/).boundingBox();
    expect(currentBox!.y).toBeCloseTo(valueBox!.y, 1);
    expect(valueBox!.x).toBeGreaterThan(currentBox!.x);
    expect(trackBox!.y - currentBox!.y - currentBox!.height).toBeCloseTo(8, 1);
    expect(nextBox!.y - trackBox!.y - trackBox!.height).toBeCloseTo(8, 1);

    for (const theme of ['light', 'dark', 'lightNeutral', 'darkNeutral']) {
      await page.locator('#playground-theme').selectOption(theme);
      await expect(track).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-neutral-stroke-subtle-rest'),
      );
      await expect(indicator).toHaveCSS(
        'background-color',
        await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest'),
      );
      await expect(current).toHaveCSS('color', await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest'));
      await expect(value).toHaveCSS('color', await resolveCssColorToken(page, '--admiral-color-neutral-text-2-rest'));
    }
    await page.getByRole('button', { name: 'Сменить цвет', exact: true }).click();
    await expect(indicator).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-neutral-stroke-hardest-rest'),
    );
    await expect(indicator).toHaveCSS('transition-duration', '0s');
  });

  test('stacks mobile labels and wraps text between words without overflow after resizing', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    await page.getByRole('button', { name: 'Сменить компоновку', exact: true }).click();
    await page.getByRole('button', { name: 'Сменить ширину', exact: true }).click();
    const root = page.getByTestId('stepper-progress');
    await expect(root).toHaveCSS('min-width', '0px');
    await expect(root).toHaveCSS('width', '288px');
    const currentBox = await root.getByText('Заполнение данных', { exact: true }).boundingBox();
    const valueBox = await root.getByText('1 из 6 шагов', { exact: true }).boundingBox();
    expect(valueBox!.y).toBeCloseTo(currentBox!.y + currentBox!.height, 1);
    expect(valueBox!.x).toBeCloseTo(currentBox!.x, 1);

    await page.getByRole('button', { name: 'Длинные названия', exact: true }).click();
    await page.getByRole('button', { name: 'Далее', exact: true }).click();
    await expect(root.getByText(/^Далее —/)).toHaveText(
      'Далее — Подписание договора после проверки документов и согласования условий',
    );
    await expect(root).toHaveCSS('overflow-wrap', 'normal');
    await expect(root).toHaveCSS('word-break', 'normal');
    await expect(root).toHaveCSS('hyphens', 'none');
    const nextBox = await root.getByText(/^Далее —/).boundingBox();
    expect(nextBox!.height).toBeGreaterThan(16);
    for (const width of [288, 320, 388, 640]) {
      await page.getByTestId('stepper-progress-frame').evaluate((element, size) => {
        element.style.width = `${size}px`;
      }, width);
      await expect
        .poll(() => root.evaluate((element) => element.scrollWidth - element.clientWidth))
        .toBeLessThanOrEqual(1);
    }
    await page.getByTestId('stepper-progress-frame').evaluate((element) => {
      element.style.width = '288px';
    });
    const unscaledBox = await root.boundingBox();
    await root.evaluate((element) => {
      for (const label of element.querySelectorAll<HTMLElement>('span, [id]')) {
        const style = getComputedStyle(label);
        label.style.fontSize = `${parseFloat(style.fontSize) * 2}px`;
        label.style.lineHeight = `${parseFloat(style.lineHeight) * 2}px`;
      }
    });
    await expect
      .poll(() => root.evaluate((element) => element.scrollWidth - element.clientWidth))
      .toBeLessThanOrEqual(1);
    const scaledBox = await root.boundingBox();
    expect(scaledBox!.height).toBeGreaterThan(unscaledBox!.height);
  });

  test('removes the next-step row and its gap when hidden', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    const root = page.getByTestId('stepper-progress');
    const initial = await root.boundingBox();
    await page.getByRole('button', { name: 'Следующая подпись', exact: true }).click();
    await expect(root.getByText(/^Далее —/)).toHaveCount(0);
    const compact = await root.boundingBox();
    expect(initial!.height - compact!.height).toBeCloseTo(24, 1);
    await expect(root.getByRole('progressbar')).toHaveAccessibleDescription('Этапы обработки заявки');
  });

  test('handles collection changes without duplicate IDs or console errors', async ({ page, browserName }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      // Firefox отбрасывает повреждённую таблицу кернинга общего шрифта playground.
      const knownFontDiagnostic =
        browserName === 'firefox' &&
        text.includes('downloadable font:') &&
        text.includes('font-family: "VTB Group UI"') &&
        text.includes('/VTBGroupUI-SemiBold-') &&
        /kern: Too large subtable|Table discarded/.test(text);
      if (!knownFontDiagnostic) errors.push(text);
    });
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    await page.getByRole('button', { name: 'Последний шаг', exact: true }).click();
    await page.getByRole('button', { name: 'Один шаг', exact: true }).click();
    const root = page.getByTestId('stepper-progress');
    await expect(root.getByRole('progressbar')).toHaveAccessibleName('Единственный шаг');
    await expect(root.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    await page.getByRole('button', { name: 'Очистить шаги', exact: true }).click();
    await expect(root).toHaveCount(0);
    const restore = page.getByRole('button', { name: 'Восстановить шаги', exact: true });
    await restore.click();
    await expect(restore).toBeFocused();
    await expect(root.getByRole('progressbar')).toHaveAccessibleName('Выдача кредита');
    await expect(page.getByTestId('second-stepper-progress').getByRole('progressbar')).toHaveAccessibleName(
      'Проверка документов',
    );
    const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(errors).toEqual([]);
  });

  test('leaves form focus management to the application', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper-progress/form'));
    const root = page.getByTestId('stepper-progress');
    await page.getByRole('button', { name: 'Далее', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Проверка документов', exact: true })).toBeFocused();
    await expect(root.getByRole('progressbar')).toHaveAccessibleName('Проверка документов');
    await page.getByRole('button', { name: 'Назад', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Заполнение данных', exact: true })).toBeFocused();
  });

  test('keeps a visible track and fill in forced-colors mode', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Эмуляция forced-colors проверяется в Chromium.');
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(getPlaygroundScenarioPath('stepper-progress/dirty'));
    const track = page.getByTestId('stepper-progress').getByRole('progressbar');
    const indicator = track.locator(':scope > div');
    await expect(track).toHaveCSS('forced-color-adjust', 'none');
    await expect(track).toHaveCSS('outline-style', 'solid');
    await expect(track).toHaveCSS('outline-width', '1px');
    const background = await track.evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect(indicator).not.toHaveCSS('background-color', background);
    await expect(track).toHaveAccessibleName('Заполнение данных');
  });
});

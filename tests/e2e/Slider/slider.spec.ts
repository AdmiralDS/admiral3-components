import { expect, test } from '@playwright/test';

import { getSliderThumbBox, readSliderThumbColors } from '../sliderUtils';
import { getPlaygroundScenarioPath, getTabKey, resolveCssColorToken } from '../utils';

test.describe('Slider playground', () => {
  test('renders JSX content and preserves discrete interaction with null renderers', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/renderers'));
    const input = page.getByRole('slider');
    const root = page.getByTestId('slider');
    await expect(root.getByRole('button')).toHaveCount(2);
    await expect(page.getByRole('button', { name: '0' })).toHaveCount(0);
    await page.getByRole('button', { name: '75 ₽' }).click();
    await expect(input).toHaveValue('75');
    await expect(page.getByTestId('slider').locator('strong')).toHaveText('75 ₽');
    await input.press('ArrowLeft');
    await expect(page.getByRole('tooltip').locator('strong')).toHaveText('25 ₽');
    await expect(input).not.toHaveAttribute('aria-valuetext');
    await page.goto(getPlaygroundScenarioPath('slider/renderers-hidden'));
    await expect(root.getByRole('button')).toHaveCount(0);
    await input.press('ArrowRight');
    await expect(input).toHaveValue('75');
    await expect(page.getByRole('tooltip')).toHaveText('75');
    await expect(page.getByTestId('slider').getByText('75', { exact: true })).toHaveCount(0);
  });
  for (const scenario of ['default', 'restricted', 'disabled']) {
    test(`selects endpoints on the extended track edges: ${scenario}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(`slider/${scenario}`));
      const input = page.getByRole('slider');
      const box = await input.boundingBox();
      if (!box) throw new Error('Slider input is not visible');
      const y = box.y + box.height / 2;
      await page.mouse.click(box.x + 1, y);
      await expect(input).toHaveValue(scenario === 'disabled' ? '50' : '0');
      await page.mouse.click(box.x + box.width - 1, y);
      await expect(input).toHaveValue(scenario === 'disabled' ? '50' : '100');
    });
  }
  test('selects bottom labels by pointer and skips them in keyboard navigation', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('slider/form'));
    const input = page.getByRole('slider');
    const min = page.getByRole('button', { name: '0', exact: true });
    const max = page.getByRole('button', { name: '100', exact: true });
    await max.click();
    await expect(input).toHaveValue('100');
    await expect(input).toBeFocused();
    await expect(page.getByText(/Сохранено:/)).toHaveCount(0);
    await input.press(getTabKey(browserName));
    await expect(page.getByRole('button', { name: 'Отправить' })).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(input).toBeFocused();
    await min.click();
    await expect(input).toHaveValue('0');
    await expect(input).toBeFocused();
    await expect(page.getByText(/Сохранено:/)).toHaveCount(0);
  });
  test('navigates nonuniform marks by keyboard and pointer', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/restricted'));
    const input = page.getByRole('slider', { name: 'Шкала' });
    await input.press('ArrowRight');
    await expect(input).toHaveValue('70');
    await input.press('ArrowLeft');
    await expect(input).toHaveValue('40');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('70');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('40');
    await input.press('Home');
    await expect(input).toHaveValue('0');
    await page.getByRole('button', { name: '70', exact: true }).click();
    await expect(input).toHaveValue('70');
    await expect(input).toBeFocused();
    await input.press('Home');
    const box = await input.locator('..').boundingBox();
    if (!box) throw new Error('Slider track is not visible');
    await page.mouse.click(box.x + box.width * 0.6, box.y + box.height / 2);
    await expect(input).toHaveValue('70');
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.15, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(input).toHaveValue('10');
  });

  test('focuses the native input through its label', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/default'));
    await page.getByTestId('slider').getByText('Громкость', { exact: true }).click();
    await expect(page.getByRole('slider', { name: 'Громкость' })).toBeFocused();
  });
  test('submits and resets the native range and displayed value', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/form'));
    const input = page.getByRole('slider');
    await input.press('End');
    await expect(input).toHaveValue('100');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByText('Сохранено: 100')).toBeVisible();
    await page.getByRole('button', { name: 'Сбросить' }).click();
    await expect(input).toHaveValue('50');
    await expect(page.getByTestId('slider').getByText('50', { exact: true })).toBeVisible();
  });
  test('applies hover and press to the thumb without Tooltip', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('visual/slider'));
    const primary = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest');
    const hover = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-hover');
    const press = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-press');
    for (const appearance of ['stroke', 'filled']) {
      const section = page.getByRole('heading', { name: appearance, exact: true }).locator('..');
      for (const dimension of ['m', 's', 'xs']) {
        const input = section.getByRole('slider', { name: `middle ${dimension}`, exact: true });
        await expect.poll(async () => (await readSliderThumbColors(input))[primary] ?? 0).toBeGreaterThan(0);
        await input.hover();
        await expect(input).toHaveAttribute('data-thumb-hovered', '');
        await expect.poll(async () => (await readSliderThumbColors(input))[hover] ?? 0).toBeGreaterThan(0);
        const hovered = (await readSliderThumbColors(input))[hover] ?? 0;
        await page.mouse.down();
        await expect(input).toHaveAttribute('data-pressed', '');
        if (appearance === 'stroke') {
          await expect.poll(async () => (await readSliderThumbColors(input))[hover] ?? 0).toBeGreaterThan(hovered);
        } else {
          await expect.poll(async () => (await readSliderThumbColors(input))[press] ?? 0).toBeGreaterThan(0);
        }
        await page.mouse.up();
        await expect(input).not.toHaveAttribute('data-pressed', '');
        await page.mouse.move(0, 0);
        await expect(input).not.toHaveAttribute('data-thumb-hovered', '');
        await expect.poll(async () => (await readSliderThumbColors(input))[primary] ?? 0).toBeGreaterThan(0);
        const disabled = section.getByRole('slider', { name: `disabled middle ${dimension}`, exact: true });
        const before = await readSliderThumbColors(disabled);
        const box = await getSliderThumbBox(disabled);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await expect(disabled).not.toHaveAttribute('data-thumb-hovered', '');
        await expect(disabled).not.toHaveAttribute('data-pressed', '');
        expect(await readSliderThumbColors(disabled)).toEqual(before);
        await page.mouse.up();
      }
    }
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
  for (const theme of ['light', 'dark']) {
    test(`applies Rest, Hover and Press colors to selected, future and disabled step labels (${theme})`, async ({
      page,
    }) => {
      await page.addInitScript((mode) => localStorage.setItem('admiral-playground-theme', mode), theme);
      await page.goto(getPlaygroundScenarioPath('visual/slider'));
      const section = page.getByRole('heading', { name: 'stroke', exact: true }).locator('..');
      const steps = section.getByRole('heading', { name: 'steps5', exact: true }).locator('..');
      await expect(steps).toBeVisible();
      const hover = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-hover');
      const press = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-press');
      const text = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest');
      const future = await resolveCssColorToken(page, '--admiral-color-neutral-text-3-rest');
      for (const [value, rest] of [
        ['50', text],
        ['75', future],
      ]) {
        const label = steps.getByRole('button', { name: value, exact: true }).first();
        await expect(label).toHaveCSS('color', rest);
        await label.hover();
        await expect(label).toHaveCSS('color', hover);
        await page.mouse.down();
        await expect(label).toHaveCSS('color', press);
        // Отпускаем вне подписи, чтобы отменить клик и сохранить выбранное значение.
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await expect(label).toHaveCSS('color', rest);
      }
      const disabled = section.getByRole('heading', { name: 'steps disabled', exact: true }).locator('..');
      const disabledColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-disable-rest');
      for (const value of ['50', '75']) {
        const label = disabled.getByRole('button', { name: value, exact: true }).first();
        await expect(label).toBeDisabled();
        await label.scrollIntoViewIfNeeded();
        const box = await label.boundingBox();
        if (!box) throw new Error('Disabled step label is not visible');
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await expect(label).toHaveCSS('color', disabledColor);
        await page.mouse.up();
        await expect(label).toHaveCSS('color', disabledColor);
      }
      await page.goto(getPlaygroundScenarioPath('slider/keyboard-steps'));
      await page.mouse.move(0, 0);
      const input = page.getByRole('slider');
      const label = (value: string) => page.getByRole('button', { name: value, exact: true });
      await expect(label('0')).toHaveCSS('color', text);
      await expect(label('50')).toHaveCSS('color', text);
      await expect(label('75')).toHaveCSS('color', future);
      await input.press('ArrowRight');
      await expect(input).toHaveValue('75');
      await expect(label('75')).toHaveCSS('color', text);
      await expect(label('100')).toHaveCSS('color', future);
      await input.press('Home');
      await expect(input).toHaveValue('0');
      await expect(label('0')).toHaveCSS('color', text);
      await expect(label('25')).toHaveCSS('color', future);
      await expect(label('75')).toHaveCSS('color', future);
    });
  }
  test('fills the available container width on narrow viewports and after resizing', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/responsive'));
    let previousWidth = 0;
    for (const width of [360, 768]) {
      await page.setViewportSize({ width, height: 900 });
      const host = page.getByTestId('responsive-host');
      const hostBox = await host.boundingBox();
      if (!hostBox) throw new Error('Responsive host is not visible');
      expect(hostBox.width).toBeLessThanOrEqual(width);
      expect(hostBox.width).toBeGreaterThan(previousWidth);
      previousWidth = hostBox.width;
      for (const name of ['continuous', 'steps']) {
        const root = page.getByTestId(name);
        const box = await root.boundingBox();
        if (!box) throw new Error('Slider is not visible');
        expect(box.width).toBeCloseTo(hostBox.width, 0);
        for (const element of await root.getByRole('slider').all()) {
          const inputBox = await element.boundingBox();
          if (!inputBox) throw new Error('Slider input is not visible');
          expect(inputBox.x).toBeGreaterThanOrEqual(box.x - 1);
          expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(box.x + box.width + 1);
        }
      }
    }
  });
  test('selects a value by touch', async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true });
    try {
      const page = await context.newPage();
      await page.goto(getPlaygroundScenarioPath('slider/default'));
      const handle = page.getByTestId('slider').getByRole('slider');
      const box = await handle.locator('..').boundingBox();
      if (!box) throw new Error('Slider track is not visible');
      await page.touchscreen.tap(box.x + box.width * 0.25, box.y + box.height / 2);
      await expect(handle).toHaveValue('25');
    } finally {
      await context.close();
    }
  });
  test('supports native keyboard navigation and visible focus', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('slider/keyboard'));
    const root = page.getByTestId('slider');
    const handle = root.getByRole('slider', { name: 'Громкость' });
    await expect(handle).toHaveValue('50');
    await expect(handle).toHaveAttribute('type', 'range');
    await page.getByRole('button', { name: 'До слайдера' }).focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(handle).toBeFocused();
    await handle.press('ArrowRight');
    await expect(handle).toHaveValue('55');
    await handle.press('ArrowUp');
    await expect(handle).toHaveValue('60');
    await handle.press('ArrowLeft');
    await expect(handle).toHaveValue('55');
    await handle.press('ArrowDown');
    await expect(handle).toHaveValue('50');
    expect(await handle.evaluate((input) => input.matches(':focus-visible'))).toBe(true);
    await handle.press('End');
    await expect(handle).toHaveValue('100');
    await handle.press('Home');
    await expect(handle).toHaveValue('0');
    await handle.press(getTabKey(browserName));
    await expect(page.getByRole('button', { name: 'После слайдера' })).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(handle).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(page.getByRole('button', { name: 'До слайдера' })).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
  test('skips step labels in both keyboard directions', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('slider/keyboard-steps'));
    const handle = page.getByRole('slider');
    const before = page.getByRole('button', { name: 'До слайдера' });
    const after = page.getByRole('button', { name: 'После слайдера' });
    await before.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(handle).toBeFocused();
    await handle.press('ArrowRight');
    await expect(handle).toHaveValue('75');
    await handle.press(getTabKey(browserName));
    await expect(after).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(handle).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(before).toBeFocused();
  });
  test('clicks the track and drags natively beyond its bounds', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/default'));
    const handle = page.getByTestId('slider').getByRole('slider');
    const track = handle.locator('..');
    const box = await track.boundingBox();
    if (!box) throw new Error('Slider track is not visible');
    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
    await expect(handle).toHaveValue('75');
    await expect(handle).toBeFocused();
    expect(await handle.evaluate((input) => input.matches(':focus-visible'))).toBe(false);
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
    await page.mouse.down();
    await expect(handle).toHaveValue('75');
    await page.mouse.move(box.x + box.width + 30, box.y - 40);
    await expect(handle).toHaveValue('100');
    await page.mouse.move(box.x - 30, box.y + box.height + 40);
    await expect(handle).toHaveValue('0');
    await page.mouse.up();
    await expect(handle).not.toHaveAttribute('data-pressed', '');
  });
  test('updates controlled values', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/controlled'));
    const handle = page.getByTestId('slider').getByRole('slider');
    await handle.press('ArrowUp');
    await expect(handle).toHaveValue('51');
    await expect(page.getByText('Выбрано: 51')).toBeVisible();
  });
  test('shows Tooltip on hover, holds it during Press and briefly after keyboard changes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/tooltip'));
    const handle = page.getByTestId('slider').getByRole('slider');
    await handle.hover();
    await expect(page.getByRole('tooltip')).toHaveText('50');
    await page.mouse.move(0, 0);
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 0);
    await expect(page.getByRole('tooltip')).toHaveText(await handle.inputValue());
    await page.mouse.up();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await handle.press('ArrowRight');
    await expect(page.getByRole('tooltip')).toHaveText(await handle.inputValue());
    await expect(page.getByRole('tooltip')).toHaveCount(0, { timeout: 4000 });
  });
  test('hides Tooltip inside a disabled fieldset and restores it when enabled', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/tooltip'));
    await page.getByTestId('slider').evaluate((element) => {
      const fieldset = document.createElement('fieldset');
      fieldset.disabled = true;
      element.before(fieldset);
      fieldset.append(element);
    });
    const input = page.getByRole('slider');
    await expect(input).toBeDisabled();
    const box = await getSliderThumbBox(input);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await page.mouse.down();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await page.mouse.up();
    await expect(input).toHaveValue('50');
    await page.locator('fieldset').evaluate((element) => element.removeAttribute('disabled'));
    await expect(input).toBeEnabled();
    await page.mouse.move(0, 0);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole('tooltip')).toHaveText('50');
  });
  test('blocks disabled pointer interaction and skips the slider in both Tab directions', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('slider/keyboard-disabled'));
    const handle = page.getByTestId('slider').getByRole('slider');
    const before = page.getByRole('button', { name: 'До слайдера' });
    const after = page.getByRole('button', { name: 'После слайдера' });
    await expect(handle).toBeDisabled();
    await expect(handle).toHaveAttribute('tabindex', '-1');
    await expect(handle).toHaveCSS('cursor', 'not-allowed');
    await before.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(after).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(before).toBeFocused();
    const box = await handle.boundingBox();
    if (!box) throw new Error('Slider input is not visible');
    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
    await expect(handle).not.toBeFocused();
    await expect(handle).toHaveValue('50');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
  test('snaps touch selection to marks', async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true });
    try {
      const page = await context.newPage();
      await page.goto(getPlaygroundScenarioPath('slider/restricted'));
      const input = page.getByRole('slider', { name: 'Шкала' });
      const box = await input.locator('..').boundingBox();
      if (!box) throw new Error('Slider track is not visible');
      await page.touchscreen.tap(box.x + box.width * 0.6, box.y + box.height / 2);
      await expect(input).toHaveValue('70');
    } finally {
      await context.close();
    }
  });
});

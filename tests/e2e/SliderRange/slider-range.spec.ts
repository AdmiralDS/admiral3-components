import { expect, test } from '@playwright/test';

import { getSliderThumbBox, readSliderThumbColors } from '../sliderUtils';
import { getPlaygroundScenarioPath, getTabKey, resolveCssColorToken } from '../utils';

test.describe('SliderRange playground', () => {
  test('fills the range container on narrow viewports and after resizing', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider/responsive'));
    let previousWidth = 0;
    for (const width of [360, 768]) {
      await page.setViewportSize({ width, height: 900 });
      const host = await page.getByTestId('responsive-host').boundingBox();
      const root = page.getByTestId('range');
      const box = await root.boundingBox();
      if (!host || !box) throw new Error('Responsive range is not visible');
      expect(host.width).toBeLessThanOrEqual(width);
      expect(box.width).toBeGreaterThan(previousWidth);
      expect(box.width).toBeCloseTo(host.width, 0);
      previousWidth = box.width;
      for (const input of await root.getByRole('slider').all()) {
        const inputBox = await input.boundingBox();
        if (!inputBox) throw new Error('Range input is not visible');
        expect(inputBox.x).toBeGreaterThanOrEqual(box.x - 1);
        expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(box.x + box.width + 1);
      }
    }
  });
  for (const appearance of ['stroke', 'filled']) {
    test(`renders Hover and Press colors of both thumbs and preserves Disabled (${appearance})`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('visual/slider-range'));
      const section = page.getByRole('heading', { name: appearance, exact: true }).locator('..');
      const middle = section.getByRole('heading', { name: 'middle', exact: true }).locator('..');
      const disabledGroup = section.getByRole('heading', { name: 'disabled', exact: true }).locator('..');
      const primary = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest');
      const hover = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-hover');
      const press = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-press');
      for (const name of ['Minimum value', 'Maximum value']) {
        const input = middle.getByRole('slider', { name }).first();
        await expect.poll(async () => (await readSliderThumbColors(input))[primary] ?? 0).toBeGreaterThan(0);
        const box = await getSliderThumbBox(input);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await expect(input).toHaveAttribute('data-thumb-hovered', '');
        await expect.poll(async () => (await readSliderThumbColors(input))[hover] ?? 0).toBeGreaterThan(0);
        const hovered = (await readSliderThumbColors(input))[hover] ?? 0;
        await page.mouse.down();
        if (appearance === 'stroke') {
          await expect.poll(async () => (await readSliderThumbColors(input))[hover] ?? 0).toBeGreaterThan(hovered);
        } else {
          await expect.poll(async () => (await readSliderThumbColors(input))[press] ?? 0).toBeGreaterThan(0);
        }
        await page.mouse.up();
        await page.mouse.move(0, 0);
        await expect(input).not.toHaveAttribute('data-thumb-hovered', '');
        await expect(input).not.toHaveAttribute('data-pressed', '');
        await expect.poll(async () => (await readSliderThumbColors(input))[primary] ?? 0).toBeGreaterThan(0);
        const disabled = disabledGroup.getByRole('slider', { name }).first();
        const before = await readSliderThumbColors(disabled);
        const disabledBox = await getSliderThumbBox(disabled);
        await page.mouse.move(disabledBox.x + disabledBox.width / 2, disabledBox.y + disabledBox.height / 2);
        await page.mouse.down();
        expect(await readSliderThumbColors(disabled)).toEqual(before);
        await expect(disabled).not.toHaveAttribute('data-thumb-hovered', '');
        await expect(disabled).not.toHaveAttribute('data-pressed', '');
        await page.mouse.up();
      }
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });
  }
  test('blocks disabled pointer interaction and skips both bounds in both Tab directions', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/keyboard-disabled'));
    const before = page.getByRole('button', { name: 'До слайдера' });
    const after = page.getByRole('button', { name: 'После слайдера' });
    const inputs = page.getByTestId('slider-range').getByRole('slider');
    await before.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(after).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(before).toBeFocused();
    for (const [index, value] of [
      [0, '20'],
      [1, '40'],
    ] as const) {
      const input = inputs.nth(index);
      await expect(input).toBeDisabled();
      await expect(input).toHaveAttribute('tabindex', '-1');
      const box = await getSliderThumbBox(input);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + 50, box.y + box.height / 2, { steps: 3 });
      await page.mouse.up();
      await expect(input).toHaveValue(value);
      await expect(input).not.toBeFocused();
    }
    const box = await inputs.first().locator('..').boundingBox();
    if (!box) throw new Error('Disabled track is not visible');
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
    await expect(inputs.nth(0)).toHaveValue('20');
    await expect(inputs.nth(1)).toHaveValue('40');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
  for (const name of ['Минимальная сумма', 'Максимальная сумма']) {
    test(`shows Tooltip on hover and holds it during Press for ${name}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('slider-range/renderers'));
      const input = page.getByRole('slider', { name });
      const box = await input.locator('..').boundingBox();
      if (!box) throw new Error('Range track is not visible');
      const position = Number(await input.inputValue()) / 100;
      await page.mouse.move(box.x + box.width * position, box.y + box.height / 2);
      await expect(page.getByRole('tooltip')).toHaveText(`${await input.inputValue()} ₽`);
      await page.mouse.move(0, 0);
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.mouse.move(box.x + box.width * position, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 30, box.y - 40);
      await expect(page.getByRole('tooltip')).toHaveText(`${await input.inputValue()} ₽`);
      await page.mouse.up();
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });
  }
  test('enters the lower bound by Tab and returns through distinct bounds by Shift+Tab', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/keyboard'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    const before = page.getByRole('button', { name: 'До слайдера' });
    await expect(lower).toHaveValue('20');
    await expect(upper).toHaveValue('40');
    await before.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(lower).toBeFocused();
    await page.keyboard.press(getTabKey(browserName));
    await expect(upper).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(lower).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(before).toBeFocused();
  });
  test('changes each bound by the numeric step in all arrow directions', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/keyboard'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    for (const [input, initial] of [
      [lower, 20],
      [upper, 40],
    ] as const) {
      await input.press('ArrowRight');
      await expect(input).toHaveValue(String(initial + 5));
      await input.press('ArrowUp');
      await expect(input).toHaveValue(String(initial + 10));
      await input.press('ArrowLeft');
      await expect(input).toHaveValue(String(initial + 5));
      await input.press('ArrowDown');
      await expect(input).toHaveValue(String(initial));
    }
    await expect(lower).toHaveValue('20');
    await expect(upper).toHaveValue('40');
  });
  test('stops repeated ArrowRight at the upper bound without crossing', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/keyboard'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    for (const value of [25, 30, 35, 40]) {
      await lower.press('ArrowRight');
      await expect(lower).toHaveValue(String(value));
      await expect(upper).toHaveValue('40');
    }
    await lower.press('ArrowRight');
    await expect(lower).toHaveValue('40');
    await expect(upper).toHaveValue('40');
    await expect(lower).toBeFocused();
  });
  test('renders JSX content for bounds and omits rows hidden by null renderers', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/renderers'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    const root = page.getByTestId('slider-range');
    await expect(root.getByRole('button')).toHaveCount(1);
    await expect(page.getByRole('button', { name: '100 ₽' })).toBeVisible();
    await lower.press('ArrowRight');
    await expect(page.getByRole('tooltip').locator('strong')).toHaveText('26 ₽');
    await expect(lower).not.toHaveAttribute('aria-valuetext');
    await page.goto(getPlaygroundScenarioPath('slider-range/renderers-hidden'));
    await expect(root.getByRole('button')).toHaveCount(0);
    await upper.press('ArrowRight');
    await expect(upper).toHaveValue('76');
    await expect(page.getByRole('tooltip')).toHaveText('76');
    await expect(page.getByTestId('slider-range').locator('strong')).toHaveCount(0);
  });
  test('selects bounds on the extended track edges', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/default'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    const box = await lower.boundingBox();
    if (!box) throw new Error('SliderRange input is not visible');
    const y = box.y + box.height / 2;
    await page.mouse.click(box.x + 1, y);
    await expect(lower).toHaveValue('0');
    await page.mouse.click(box.x + box.width - 1, y);
    await expect(upper).toHaveValue('100');
  });
  test('keeps range keyboard bounds and tab order when thumbs coincide', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/form'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    await lower.press('End');
    await expect(lower).toHaveValue('75');
    await lower.press(getTabKey(browserName));
    await expect(upper).toBeFocused();
    await upper.press('Home');
    await expect(upper).toHaveValue('75');
    await upper.press(getTabKey(browserName, true));
    await expect(lower).toBeFocused();
    await lower.press(getTabKey(browserName));
    await expect(upper).toBeFocused();
    await upper.press(getTabKey(browserName));
    await expect(page.getByRole('button', { name: 'Отправить' })).toBeFocused();
    await page.keyboard.press(getTabKey(browserName, true));
    await expect(upper).toBeFocused();
    await upper.press('End');
    await expect(upper).toHaveValue('100');
    await lower.press('Home');
    await expect(lower).toHaveValue('0');
  });
  test('changes track values without focusing bounds until keyboard selection', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/keyboard'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    const before = page.getByRole('button', { name: 'До слайдера' });
    const box = await lower.locator('..').boundingBox();
    if (!box) throw new Error('Range track is not visible');
    for (const [position, value, next] of [
      [0.1, '10', '15'],
      [0.2, '20', '25'],
    ] as const) {
      // Первый клик — без фокуса; второй — после клавиатурного управления нижней границей.
      await page.mouse.click(box.x + box.width * position, box.y + box.height / 2);
      await expect(lower).toHaveValue(value);
      await expect(lower).not.toBeFocused();
      await expect(upper).not.toBeFocused();
      expect(await lower.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
      expect(await upper.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
      await page.keyboard.press('ArrowRight');
      await expect(lower).toHaveValue(value);
      await expect(upper).toHaveValue('40');
      await before.focus();
      await page.keyboard.press(getTabKey(browserName));
      await expect(lower).toBeFocused();
      expect(await lower.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
      await page.keyboard.press('ArrowRight');
      await expect(lower).toHaveValue(next);
    }
  });
  test('clicks the nearest range bound and drags both native thumbs', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/default'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    const box = await lower.locator('..').boundingBox();
    if (!box) throw new Error('Range track is not visible');
    const y = box.y + box.height / 2;
    await page.mouse.click(box.x + box.width * 0.1, y);
    await expect(lower).toHaveValue('10');
    await page.mouse.click(box.x + box.width * 0.9, y);
    await expect(upper).toHaveValue('90');
    await page.mouse.move(box.x + box.width * 0.1, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, y, { steps: 5 });
    await page.mouse.up();
    await expect(lower).toHaveValue('30');
    await page.mouse.move(box.x + box.width * 0.9, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, y, { steps: 5 });
    await page.mouse.up();
    await expect(upper).toHaveValue('60');
  });
  test('separates coincident thumbs after focus with custom focus handlers', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/default'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
    await lower.press('End');
    const lowerBox = await getSliderThumbBox(lower);
    const y = lowerBox.y + lowerBox.height / 2;
    await page.mouse.move(lowerBox.x + lowerBox.width / 2, y);
    await upper.focus();
    await lower.focus();
    await expect(lower).toHaveAttribute('data-focus-handled', 'true');
    await expect(lower).toBeFocused();
    await page.mouse.down();
    await page.mouse.move(lowerBox.x - 50, y, { steps: 5 });
    await page.mouse.up();
    expect(Number(await lower.inputValue())).toBeLessThan(75);
    await expect(upper).toHaveValue('75');
    await upper.press('Home');
    const coincident = await lower.inputValue();
    const upperBox = await getSliderThumbBox(upper);
    await page.mouse.move(upperBox.x + upperBox.width / 2, y);
    await lower.focus();
    await upper.focus();
    await expect(upper).toHaveAttribute('data-focus-handled', 'true');
    await expect(upper).toBeFocused();
    await page.mouse.down();
    await page.mouse.move(upperBox.x + upperBox.width + 50, y, { steps: 5 });
    await page.mouse.up();
    await expect(lower).toHaveValue(coincident);
    expect(Number(await upper.inputValue())).toBeGreaterThan(Number(coincident));
  });
  for (const direction of ['left', 'right'] as const) {
    test(`drags the last used coincident thumb back by mouse ${direction}`, async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath('slider-range/renderers'));
      const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
      const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
      const box = await lower.locator('..').boundingBox();
      if (!box) throw new Error('Range track is not visible');
      const y = box.y + box.height / 2;
      const position = direction === 'left' ? 0.75 : 0.25;
      const selected = direction === 'left' ? lower : upper;
      const other = direction === 'left' ? upper : lower;
      // Сводим границы обычным drag; фокус нужного input заранее не устанавливаем.
      await page.mouse.move(box.x + box.width * (1 - position), y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * position, y, { steps: 5 });
      await page.mouse.up();
      await expect(lower).toHaveValue(String(position * 100));
      await expect(upper).toHaveValue(String(position * 100));
      // Наведение на другую половину общего thumb не должно менять последний использованный input.
      const startX = box.x + box.width * position + (direction === 'left' ? 1 : -1);
      await page.mouse.move(startX, y);
      await page.mouse.down();
      const endX = direction === 'left' ? box.x - 30 : box.x + box.width + 30;
      await page.mouse.move(endX, y, { steps: 10 });
      await expect(selected).toHaveValue(direction === 'left' ? '0' : '100');
      await expect(other).toHaveValue(String(position * 100));
      await expect(selected).toBeFocused();
      expect(await selected.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
      await expect(selected).toHaveAttribute('data-pressed', '');
      await expect(other).not.toHaveAttribute('data-pressed', '');
      await expect(page.getByRole('tooltip')).toHaveText(`${await selected.inputValue()} ₽`);
      // Обратное движение в том же жесте не выбирает соседнюю границу и не пересекает её.
      await page.mouse.move(direction === 'left' ? box.x + box.width + 30 : box.x - 30, y, { steps: 10 });
      await expect(lower).toHaveValue(String(position * 100));
      await expect(upper).toHaveValue(String(position * 100));
      await page.mouse.move(endX, y, { steps: 5 });
      await page.mouse.up();
      await expect(selected).not.toHaveAttribute('data-pressed', '');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await selected.press(direction === 'left' ? 'ArrowRight' : 'ArrowLeft');
      await expect(selected).toHaveValue(direction === 'left' ? '1' : '99');
    });
  }
  test('blocks track changes and Tooltip inside a disabled fieldset and restores them when enabled', async ({
    page,
  }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/renderers'));
    const root = page.getByTestId('slider-range');
    // Проверяем именно нативное наследование disabled, без prop компонента.
    await root.evaluate((element) => {
      const fieldset = document.createElement('fieldset');
      fieldset.disabled = true;
      element.before(fieldset);
      fieldset.append(element);
    });
    const lower = root.getByRole('slider', { name: 'Минимальная сумма' });
    const upper = root.getByRole('slider', { name: 'Максимальная сумма' });
    await expect(lower).toBeDisabled();
    await expect(upper).toBeDisabled();
    for (const input of [lower, upper]) {
      const thumb = await getSliderThumbBox(input);
      await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.mouse.down();
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.mouse.up();
    }
    const box = await lower.locator('..').boundingBox();
    if (!box) throw new Error('Range track is not visible');
    const y = box.y + box.height / 2;
    await page.mouse.click(box.x + box.width * 0.1, y);
    await page.mouse.click(box.x + box.width * 0.9, y);
    await expect(lower).toHaveValue('25');
    await expect(upper).toHaveValue('75');
    await expect(lower).not.toBeFocused();
    await expect(upper).not.toBeFocused();
    await root.getByRole('button', { name: '100 ₽', exact: true }).click({ force: true });
    await expect(upper).toHaveValue('75');
    await page.locator('fieldset').evaluate((element) => {
      element.removeAttribute('disabled');
    });
    await page.mouse.click(box.x + box.width * 0.1, y);
    await expect(lower).toHaveValue('10');
    await page.mouse.click(box.x + box.width * 0.9, y);
    await expect(upper).toHaveValue('90');
    for (const input of [lower, upper]) {
      await page.mouse.move(0, 0);
      const thumb = await getSliderThumbBox(input);
      await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
      await expect(page.getByRole('tooltip')).toHaveText(`${await input.inputValue()} ₽`);
    }
  });
  for (const { scenario, formatValue, controlledOutput } of [
    { scenario: 'slider-range/renderers', formatValue: (value: string) => `${value} ₽`, controlledOutput: null },
    { scenario: 'slider-range/controlled-touch', formatValue: String, controlledOutput: 'Выбрано: 10 — 90' },
  ]) {
    test(`drags the last used coincident thumb back by touch: ${scenario}`, async ({ browser, browserName }) => {
      test.skip(browserName !== 'chromium', 'Реальный touch-drag выполняется через Chromium CDP.');
      const context = await browser.newContext({ hasTouch: true });
      try {
        const page = await context.newPage();
        await page.goto(getPlaygroundScenarioPath(scenario));
        const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
        const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
        const box = await lower.locator('..').boundingBox();
        if (!box) throw new Error('Range track is not visible');
        const session = await context.newCDPSession(page);
        const y = box.y + box.height / 2;
        // null оставляет касание активным для проверки состояния перед отменой.
        const drag = async (from: number, to: number, end: 'touchEnd' | 'touchCancel' | null = 'touchEnd') => {
          await session.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: box.x + box.width * from, y }],
          });
          for (let index = 1; index <= 10; index++) {
            await session.send('Input.dispatchTouchEvent', {
              type: 'touchMove',
              touchPoints: [{ x: box.x + box.width * (from + ((to - from) * index) / 10), y }],
            });
          }
          if (end) await session.send('Input.dispatchTouchEvent', { type: end, touchPoints: [] });
        };
        await drag(0.75, 0.25);
        await expect(lower).toHaveValue('25');
        await expect(upper).toHaveValue('25');
        await drag(0.25, 0.5, null);
        await expect(upper).toHaveAttribute('data-pressed', '');
        await expect(lower).not.toHaveAttribute('data-pressed', '');
        await expect(page.getByRole('tooltip')).toHaveText(formatValue(await upper.inputValue()));
        for (const input of [lower, upper]) {
          expect(await input.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
        }
        await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
        await expect(upper).not.toHaveAttribute('data-pressed', '');
        await expect(page.getByRole('tooltip')).toHaveCount(0);
        for (const input of [lower, upper]) {
          expect(await input.evaluate((element) => element.matches(':focus-visible'))).toBe(false);
        }
        await expect(lower).toHaveValue('25');
        await expect(upper).toHaveValue('50');
        await drag(0.25, 0.5);
        await expect(lower).toHaveValue('50');
        await expect(upper).toHaveValue('50');
        await drag(0.5, 0.1);
        await expect(lower).toHaveValue('10');
        await expect(upper).toHaveValue('50');
        // Другую границу можно выбрать нажатием по дорожке.
        await page.touchscreen.tap(box.x + box.width * 0.9, y);
        await expect(lower).toHaveValue('10');
        await expect(upper).toHaveValue('90');
        if (controlledOutput) await expect(page.getByText(controlledOutput)).toBeVisible();
      } finally {
        await context.close();
      }
    });
  }
  test('selects range bounds by touch including coincident endpoints', async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true });
    try {
      const page = await context.newPage();
      await page.goto(getPlaygroundScenarioPath('slider-range/default'));
      const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
      const upper = page.getByRole('slider', { name: 'Максимальная сумма' });
      const box = await lower.locator('..').boundingBox();
      if (!box) throw new Error('Range track is not visible');
      const y = box.y + box.height / 2;
      await page.touchscreen.tap(box.x + box.width * 0.1, y);
      await expect(lower).toHaveValue('10');
      await page.touchscreen.tap(box.x + box.width * 0.9, y);
      await expect(upper).toHaveValue('90');
      await lower.press('Home');
      await upper.press('Home');
      await page.touchscreen.tap(box.x + box.width * 0.25, y);
      await expect(lower).toHaveValue('0');
      await expect(upper).toHaveValue('25');
      await upper.press('End');
      await lower.press('End');
      await page.touchscreen.tap(box.x + box.width * 0.75, y);
      await expect(lower).toHaveValue('75');
      await expect(upper).toHaveValue('100');
    } finally {
      await context.close();
    }
  });
  test('selects nearest bounds through scale labels without submitting', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/form'));
    const [lower, upper] = await page.getByRole('slider').all();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await expect(lower).toHaveValue('0');
    await expect(lower).toBeFocused();
    const max = page.getByRole('button', { name: '100', exact: true });
    await max.click();
    await expect(upper).toHaveValue('100');
    await expect(upper).toBeFocused();
    await expect(page.getByText(/Сохранено:/)).toHaveCount(0);
  });
  test('submits native named bounds and resets the interval', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('slider-range/form'));
    const lower = page.getByRole('slider', { name: 'Минимальная сумма' });
    await lower.press('ArrowRight');
    await expect(lower).toHaveValue('26');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByText('Сохранено: 26 — 75')).toBeVisible();
    await page.getByRole('button', { name: 'Сбросить' }).click();
    await expect(lower).toHaveValue('25');
    await expect(page.getByText('25 — 75', { exact: true })).toBeVisible();
  });
});

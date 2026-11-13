import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, getTabKey, resolveCssColorToken } from '../utils';

test.describe('Stepper', () => {
  test('button stopPropagation preserves selection and preventDefault cancels it', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    const requests = page.getByLabel('Запросы перехода');
    await page.getByRole('button', { name: 'Остановка всплытия: нет' }).click();
    await root.getByRole('button', { name: 'one', exact: true }).click();
    await expect(requests).toHaveText('1');
    await expect(root.getByRole('button', { name: 'one', exact: true })).toHaveAttribute('aria-current', 'step');
    await page.getByRole('button', { name: 'Отмена событий: нет' }).click();
    await root.getByRole('button', { name: 'two', exact: true }).click();
    await expect(requests).toHaveText('1');
    await expect(root.getByRole('button', { name: 'one', exact: true })).toHaveAttribute('aria-current', 'step');
  });

  test('active playground supports entry, arrows and selection with aligned description', async ({
    page,
    browserName,
  }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/active'));
    const root = page.getByTestId('stepper');
    const description = root.locator('..').locator('..').locator(':scope > p');
    const descriptionBounds = await description.boundingBox();
    const bounds = await root.boundingBox();
    expect(descriptionBounds?.x).toBe(bounds?.x);
    const current = root.getByRole('button', { name: 'Адрес', exact: true });
    await root.focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(current).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(root.getByRole('button', { name: 'Данные', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(root.locator('[aria-current="step"]')).toContainText('Данные');
    await expect(root.getByRole('button', { name: 'Данные', exact: true })).toHaveAttribute('data-redo');
    await page.keyboard.press('ArrowRight');
    await expect(current).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(current).toHaveAttribute('aria-current', 'step');
    await expect(current).not.toHaveAttribute('data-redo');
  });

  test('static steps preserve list semantics and do not add tab stops', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/default'));
    const root = page.getByTestId('stepper');
    await expect(root.getByRole('listitem')).toHaveCount(4);
    await expect(root.getByRole('button')).toHaveCount(0);
    await expect(root.locator('[aria-current="step"]')).toHaveText(/Адрес/);
    await expect(root.locator('li').last().locator('[data-step-connector]')).toHaveCSS('visibility', 'hidden');
    await root.focus();
    await page.keyboard.press('Tab');
    await expect.poll(() => root.evaluate((element) => element.contains(document.activeElement))).toBe(false);
  });

  for (const orientation of ['horizontal', 'vertical'] as const) {
    test(`supports one tab stop and manual activation in ${orientation} layout`, async ({ page, browserName }) => {
      await page.goto(
        getPlaygroundScenarioPath(orientation === 'horizontal' ? 'stepper/navigation' : 'stepper/vertical'),
      );
      const group = page.getByRole('group', { name: 'Редактирование заказа' });
      const current = group.getByRole('button', { name: 'Оплата' });
      await page.getByTestId('before-stepper').focus();
      await page.keyboard.press(getTabKey(browserName));
      await expect(current).toBeFocused();
      await page.keyboard.press(getTabKey(browserName));
      await expect(page.getByTestId('after-stepper')).toBeFocused();
      await page.keyboard.press(getTabKey(browserName, true));
      await expect(current).toBeFocused();
      const state = page.getByTestId('navigation-state');
      await expect(state).toContainText('Сейчас открыт шаг 3 из 5: Оплата.');
      await expect(group.locator('[data-redo]')).toHaveCount(0);
      await page.keyboard.press(orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown');
      await expect(group.getByRole('button', { name: 'Данные' })).toBeFocused();
      await expect(group.locator('[aria-current="step"]')).toContainText('Оплата');
      await expect(state).toContainText('Сейчас открыт шаг 3 из 5: Оплата.');
      await page.keyboard.press(orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp');
      await expect(current).toBeFocused();
      await page.keyboard.press('Home');
      const first = group.getByRole('button', { name: 'Данные' });
      await expect(first).toBeFocused();
      await page.keyboard.press('End');
      await expect(current).toBeFocused();
      await page.keyboard.press('Home');
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('aria-current', 'step');
      await expect(first).toHaveAttribute('data-redo');
      await expect(group.locator('[data-redo]')).toHaveCount(1);
      await expect(state).toContainText('Сейчас открыт шаг 1 из 5: Данные.');
      await expect(state).toContainText('Повторное редактирование завершённого шага (redo).');
      await page.keyboard.press(orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown');
      const address = group.getByRole('button', { name: 'Адрес' });
      await expect(address).toBeFocused();
      await page.keyboard.press('Space');
      await expect(address).toHaveAttribute('aria-current', 'step');
      await expect(address).toHaveAttribute('data-redo');
      await expect(first).not.toHaveAttribute('data-redo');
      await expect(state).toContainText('Сейчас открыт шаг 2 из 5: Адрес.');
      await page.keyboard.press('End');
      await expect(current).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(current).toHaveAttribute('aria-current', 'step');
      await expect(group.locator('[data-redo]')).toHaveCount(0);
      await expect(group.locator('[aria-current="step"]')).toHaveCount(1);
      await expect(state).toContainText('Продолжение оформления, без redo.');
      await expect(group.getByRole('button', { name: 'Проверка' })).toHaveCount(0);
      await expect(group.getByRole('button', { name: 'Отправка' })).toHaveCount(0);
    });
  }

  test('does not submit a form when activating a step button', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/navigation'));
    const group = page.getByRole('group', { name: 'Редактирование заказа' });
    await group.evaluate((element) => {
      const form = document.createElement('form');
      element.before(form);
      form.appendChild(element);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.setAttribute('data-submitted', '');
      });
    });
    await group.getByRole('button', { name: 'Данные' }).click();
    await expect(page.locator('form[data-submitted]')).toHaveCount(0);
  });

  test('inactive story changes steps only through its external buttons', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/default'));
    const root = page.getByTestId('stepper');
    const next = page.getByRole('button', { name: 'Далее', exact: true });
    const back = page.getByRole('button', { name: 'Назад', exact: true });
    await next.click();
    await expect(root.locator('[aria-current="step"]')).toContainText('Оплата');
    await expect(next).toBeFocused();
    await back.click();
    await expect(root.locator('[aria-current="step"]')).toContainText('Адрес');
    await back.click();
    await expect(root.locator('[aria-current="step"]')).toContainText('Данные');
    await expect(back).toBeDisabled();
    await expect(root.locator('[data-state="completed"]').filter({ hasText: 'Адрес' })).toHaveCount(1);
    for (let index = 0; index < 3; index += 1) await next.click();
    await expect(next).toBeDisabled();
    await expect(root.getByRole('button')).toHaveCount(0);
  });

  test('cancels click and keyboard requests and ignores current activation', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    await root.getByRole('button', { name: 'two', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('0');
    await page.getByRole('button', { name: 'Отмена событий: нет' }).click();
    const first = root.getByRole('button', { name: 'one', exact: true });
    await first.click();
    await first.press('End');
    await expect(first).toBeFocused();
    await expect(root.locator('[aria-current="step"]')).toContainText('two');
    await expect(page.getByRole('status')).toHaveText('0');
  });

  test('recovers focus after removal and disabling, and preserves it across keyed reordering', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    const third = root.getByRole('button', { name: 'three', exact: true });
    await third.focus();
    await third.press('r');
    await expect(third).toBeFocused();
    await third.press('Delete');
    const current = root.getByRole('button', { name: 'two', exact: true });
    await expect(current).toBeFocused();
    await current.press('d');
    await expect(root.getByRole('button', { name: 'one', exact: true })).toBeFocused();
  });

  test('external changes do not take focus from external controls', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const external = page.getByRole('button', { name: 'Выбрать three извне' });
    await external.click();
    await expect(external).toBeFocused();
    await expect(page.getByTestId('dirty-stepper').locator('[aria-current="step"]')).toContainText('three');
    const toggle = page.getByRole('button', { name: 'Переключить интерактивность' });
    await toggle.click();
    await expect(toggle).toBeFocused();
    await expect(page.getByTestId('dirty-stepper').getByRole('button')).toHaveCount(0);
  });

  test('recovers from hidden steps and skips them on reentry and arrow navigation', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    const current = root.getByRole('button', { name: 'two', exact: true });
    await current.focus();
    await current.press('h');
    await expect(current).toBeHidden();
    const first = root.getByRole('button', { name: 'one', exact: true });
    await expect(first).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(root.getByRole('button', { name: 'three', exact: true })).toBeFocused();
    await page.getByTestId('before-stepper').focus();
    await page.keyboard.press(getTabKey(browserName));
    await expect(first).toBeFocused();
    await expect(root.locator('[tabindex="0"]')).toHaveCount(1);
  });

  test('does not take focus back after blur to the document body', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    const first = root.getByRole('button', { name: 'one', exact: true });
    await first.focus();
    await first.evaluate((button) => button.blur());
    // Нативный click без переноса фокуса вызывает обычное controlled-обновление.
    await page
      .getByRole('button', { name: 'Выбрать three извне' })
      .evaluate((button: HTMLButtonElement) => button.click());
    await expect(root.locator('[aria-current="step"]')).toContainText('three');
    await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true);
    await expect(root.getByRole('button', { name: 'three', exact: true })).toHaveAttribute('tabindex', '0');
  });

  test('application Next and Back actions focus the new content heading', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/form'));
    await page.getByRole('button', { name: 'Далее', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Доставка', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Назад', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Данные', exact: true })).toBeFocused();
    const group = page.getByRole('group', { name: 'Оформление заказа' });
    await expect(group.getByRole('button', { name: 'Данные', exact: true })).toHaveAttribute(
      'aria-controls',
      (await page.getByRole('region', { name: 'Данные', exact: true }).getAttribute('id')) ?? '',
    );
  });

  test('mobile scrolling aligns the new current step and preserves focus outside', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/mobile'));
    const root = page.getByTestId('mobile-stepper');
    await expect(root).toHaveCSS('scrollbar-width', 'none');
    await expect(root).toHaveCSS('overflow-x', 'auto');
    const next = page.getByRole('button', { name: 'Далее', exact: true });
    for (let index = 0; index < 3; index += 1) await next.click();
    await expect(next).toBeFocused();
    await expect
      .poll(() =>
        root.evaluate((element) => {
          const item = element.querySelector('[aria-current="step"]');
          return item ? item.getBoundingClientRect().left - element.getBoundingClientRect().left : 0;
        }),
      )
      .toBeCloseTo(16, 0);
    await expect.poll(() => root.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await root.evaluate((element) => {
      element.scrollLeft = 0;
    });
    await expect.poll(() => root.evaluate((element) => element.scrollLeft)).toBe(0);
    await next.click();
    await expect.poll(() => root.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await root.getByRole('button', { name: 'Этап 5', exact: true }).focus();
    await page.keyboard.press('Home');
    const first = root.getByRole('button', { name: 'Этап 1', exact: true });
    await expect(first).toBeFocused();
    const focusFits = await first.evaluate((button) => {
      const container = button.closest('[data-mobile]');
      if (!container) return false;
      const indicator = button.querySelector('[aria-hidden="true"] > span');
      if (!indicator) return false;
      const style = getComputedStyle(indicator);
      const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      const bounds = indicator.getBoundingClientRect();
      const viewport = container.getBoundingClientRect();
      return bounds.top - ring >= viewport.top && bounds.bottom + ring <= viewport.bottom;
    });
    expect(focusFits).toBe(true);
    await expect.poll(() => root.evaluate((element) => element.scrollLeft)).toBe(0);
    for (let index = 0; index < 3; index += 1) await next.click();
    await expect
      .poll(() =>
        root.evaluate((element) => Math.abs(element.scrollLeft - (element.scrollWidth - element.clientWidth))),
      )
      .toBeLessThan(1);
  });

  test('discloses only overflowing text on hover or focus and updates after resize', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/truncation'));
    const root = page.getByTestId('truncated-stepper');
    const current = root.getByRole('button', { name: 'Контактная информация получателя' });
    await current.hover();
    await expect(page.getByRole('tooltip')).toContainText('Укажите телефон');
    await page.mouse.move(0, 0);
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await current.focus();
    await expect(page.getByRole('tooltip')).toContainText('Контактная информация получателя');
    const resize = page.getByRole('button', { name: 'Изменить ширину' });
    await page.keyboard.press(getTabKey(browserName));
    await expect(resize).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await resize.press('Space');
    await current.focus();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(current).toHaveAccessibleDescription(
      'Укажите телефон и адрес электронной почты для уведомлений о заказе.',
    );
  });

  test('names a step by its description and shows only that description in the overflow tooltip', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/description-only'));
    const root = page.getByTestId('description-stepper');
    const current = root.getByRole('button', { name: 'Текущий шаг. Вторая строка.', exact: true });
    await current.focus();
    await expect(page.getByRole('tooltip')).toHaveText('Текущий шаг. Вторая строка.');
    await expect(current).toHaveAccessibleName('Текущий шаг. Вторая строка.');
    await expect(current).not.toHaveAttribute('aria-describedby');
    await expect(root.locator('[aria-current="step"]')).toHaveCount(1);
  });

  test('uses Pixso body typography without a heading in both dimensions and orientations', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('visual/stepper'));
    for (const orientation of ['horizontal', 'vertical']) {
      for (const dimension of ['m', 's']) {
        const root = page.locator(`[data-stepper-headless="${orientation}-${dimension}"]`);
        const text = root.getByText('Завершенный шаг. Вторая строка.', { exact: true });
        await expect(text).toHaveCSS('font-size', dimension === 'm' ? '16px' : '14px');
        await expect(text).toHaveCSS('line-height', dimension === 'm' ? '20px' : '16px');
        await expect(text).toHaveCSS('font-weight', '400');
        await expect(text).toHaveCSS('color', await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest'));
      }
    }
  });

  test('observes live text after switching interaction modes and resizing without a new hover', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/runtime'));
    const root = page.getByTestId('dirty-stepper');
    const toggle = page.getByRole('button', { name: 'Переключить интерактивность' });
    for (const interactive of [false, true]) {
      await toggle.click();
      await expect(root.getByRole('button')).toHaveCount(interactive ? 3 : 0);
      await root.evaluate((element) => {
        element.style.width = '120px';
      });
      const segment = root.locator('li').first().locator(':scope > button, :scope > div');
      await segment.hover();
      await expect(page.getByRole('tooltip')).toContainText('Описание one');
      await root.evaluate((element) => {
        element.style.width = '760px';
      });
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await page.mouse.move(0, 0);
    }
  });

  test('uses equal adaptive segment widths, exact indicators and live theme tokens', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('stepper/default'));
    const root = page.getByTestId('stepper');
    const items = root.getByRole('listitem');
    const widths = await items.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().width),
    );
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    const indicator = root.locator('[aria-current="step"] [aria-hidden="true"] > span').first();
    await expect(indicator).toHaveCSS('width', '24px');
    await expect(indicator).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest'),
    );
    await page.getByLabel('Theme', { exact: true }).selectOption('dark');
    await expect(indicator).toHaveCSS(
      'background-color',
      await resolveCssColorToken(page, '--admiral-color-primary-base-1-rest'),
    );
  });

  test('uses browser hover, press and focus-visible styles', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(getPlaygroundScenarioPath('stepper/navigation'));
    const button = page.getByRole('button', { name: 'Данные', exact: true });
    const indicator = button.locator('[aria-hidden="true"] > span').first();
    await button.hover();
    await expect(button).toHaveCSS('color', await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest'));
    await expect(indicator).toHaveCSS(
      'color',
      await resolveCssColorToken(page, '--admiral-color-primary-base-1-hover'),
    );
    await page.mouse.down();
    await expect(indicator).toHaveCSS(
      'color',
      await resolveCssColorToken(page, '--admiral-color-primary-base-1-press'),
    );
    await page.mouse.up();
    await page.keyboard.press('Tab');
    await button.focus();
    await expect(button).toHaveCSS('outline-style', 'none');
    await expect(indicator).toHaveCSS('outline-style', 'solid');
    await expect(indicator).toHaveCSS('outline-width', '2px');
    await expect(indicator).toHaveCSS('outline-offset', '2px');
    await expect(indicator).toHaveCSS(
      'outline-color',
      await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest'),
    );
    expect(
      await indicator.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          element.getBoundingClientRect().width + 2 * (parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset))
        );
      }),
    ).toBe(32);
  });

  test('uses the design colors and dash pattern in both orientations and color modes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('visual/stepper'));
    for (const orientation of ['horizontal', 'vertical']) {
      for (const dimension of ['m', 's']) {
        for (const colorMode of ['colored', 'neutral']) {
          const id = `${orientation}-${dimension}-${colorMode}`;
          const root = page.locator(`[data-stepper-visual="${id}"]`);
          const disabledConnector = root.locator('[data-state="disabled"] [data-step-connector]');
          const borderProperty = orientation === 'horizontal' ? 'border-top-color' : 'border-left-color';
          await expect(disabledConnector).toHaveCSS(
            borderProperty,
            await resolveCssColorToken(
              page,
              colorMode === 'colored'
                ? '--admiral-color-primary-base-1-disable'
                : '--admiral-color-neutral-stroke-1-rest',
            ),
          );
          const completedIndicator = root
            .getByRole('button', { name: 'Done', exact: true })
            .locator('[aria-hidden="true"] > span')
            .first();
          await expect(completedIndicator).toHaveCSS(
            'color',
            await resolveCssColorToken(
              page,
              colorMode === 'colored'
                ? '--admiral-color-primary-base-1-rest'
                : '--admiral-color-neutral-base-inverted-rest',
            ),
          );
          await expect(completedIndicator).toHaveCSS(
            'background-color',
            await resolveCssColorToken(
              page,
              colorMode === 'colored'
                ? '--admiral-color-neutral-text-static-white-1'
                : '--admiral-color-neutral-text-inverted-rest',
            ),
          );
          const disabledIndicator = root.locator('[data-state="disabled"] [aria-hidden="true"] > span').first();
          await expect(disabledIndicator).toHaveCSS(
            'background-color',
            await resolveCssColorToken(page, '--admiral-color-neutral-text-inverted-rest'),
          );
          for (const status of ['error', 'warning']) {
            const indicator = root.locator(`[data-state="${status}"] [aria-hidden="true"] > span`).first();
            await expect(indicator).toHaveCSS(
              'color',
              await resolveCssColorToken(page, `--admiral-color-${status}-base-1-rest`),
            );
          }
          const redoConnector = page.locator(`[data-stepper-redo="${id}"] [data-redo] [data-step-connector]`);
          await expect(redoConnector).toHaveCSS(
            'color',
            await resolveCssColorToken(
              page,
              colorMode === 'colored'
                ? '--admiral-color-primary-stroke-1-rest'
                : '--admiral-color-neutral-stroke-hardest-rest',
            ),
          );
          const pattern = await redoConnector.evaluate((element) => getComputedStyle(element).backgroundImage);
          expect(pattern).toContain('repeating-linear-gradient');
          expect(pattern).toContain('8px');
          expect(pattern).toContain('12px');
        }
      }
    }
    const verticalM = page.locator('[data-stepper-visual="vertical-m-colored"]');
    await verticalM.evaluate((element) => {
      element.style.setProperty('--admiral-color-error-text-1-rest', 'rgb(11, 22, 33)');
      element.style.setProperty('--admiral-color-warning-text-1-rest', 'rgb(44, 55, 66)');
    });
    await expect(verticalM.locator('[data-state="error"] [data-step-connector]')).toHaveCSS(
      'border-left-color',
      'rgb(11, 22, 33)',
    );
    await expect(verticalM.locator('[data-state="warning"] [data-step-connector]')).toHaveCSS(
      'border-left-color',
      'rgb(44, 55, 66)',
    );
  });
});

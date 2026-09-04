import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

const defaultScenarioId = 'input/default';
const clearIconScenarioId = 'input/clear-icon';
const cursorZonesScenarioId = 'input/cursor-zones';
const keyboardNavigationScenarioId = 'input/keyboard-navigation';
const currencyScenarioId = 'input/currency';
const highPrecisionNumbersScenarioId = 'input/high-precision-numbers';
const passwordReadOnlyScenarioId = 'input/password-read-only';
const readOnlyDataMaskingScenarioId = 'input/read-only-data-masking';

test.describe('Input playground', () => {
  test('renders default playground scenario', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const component = page.getByTestId('input');

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('placeholder', 'Input');
  });

  test('clears the value and returns focus to the input', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(clearIconScenarioId));

    const component = page.getByTestId('input');
    await page.getByRole('button', { name: 'Очистить поле' }).click();

    await expect(component).toHaveValue('');
    await expect(component).toBeFocused();
    await expect(page.getByRole('button', { name: 'Очистить поле' })).toBeHidden();
  });

  test('keeps the clear button in sync with native value changes and form reset', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(clearIconScenarioId));

    const component = page.getByTestId('input');
    const clearButton = page.getByRole('button', { name: 'Очистить поле' });

    await expect(clearButton).toBeVisible();

    await component.evaluate((input: HTMLInputElement) => {
      input.value = '';
    });
    await expect(clearButton).toBeHidden();

    await component.evaluate((input: HTMLInputElement) => {
      input.value = 'Native input';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(clearButton).toBeVisible();

    await component.evaluate((input: HTMLInputElement) => {
      input.value = '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(clearButton).toBeHidden();

    await component.evaluate((input: HTMLInputElement) => {
      const container = input.parentElement;
      const form = document.createElement('form');

      if (!container?.parentElement) return;
      container.parentElement.insertBefore(form, container);
      form.append(container);
      form.reset();
    });

    await expect(component).toHaveValue('Input value');
    await expect(clearButton).toBeVisible();
  });

  test('activates the clear button with Space and returns focus to the input', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath(clearIconScenarioId));

    const component = page.getByTestId('input');
    const clearButton = page.getByRole('button', { name: 'Очистить поле' });
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    await component.focus();
    await page.keyboard.press(tabKey);
    await expect(clearButton).toBeFocused();

    await page.keyboard.press('Space');

    await expect(component).toHaveValue('');
    await expect(component).toBeFocused();
    await expect(clearButton).toBeHidden();
  });

  test('includes the informer icon in the native Tab order', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const previousElement = page.getByTestId('before-input');
    const component = page.getByTestId('input');
    const clearButton = page.getByRole('button', { name: 'Очистить поле' });
    const informerIcon = page.getByTestId('informer-icon');
    const customButton = page.getByRole('button', { name: 'Пользовательское действие' });
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    const reverseTabKey = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';

    await previousElement.focus();

    await page.keyboard.press(tabKey);
    await expect(component).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(clearButton).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(informerIcon).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(customButton).toBeFocused();

    await page.keyboard.press(reverseTabKey);
    await expect(informerIcon).toBeFocused();

    await page.keyboard.press(reverseTabKey);
    await expect(clearButton).toBeFocused();

    await page.keyboard.press(reverseTabKey);
    await expect(component).toBeFocused();

    await page.keyboard.press(reverseTabKey);
    await expect(previousElement).toBeFocused();

    await informerIcon.click();
    await expect(component).not.toBeFocused();
  });

  test('selects readOnly text and skips a disabled input during Tab navigation', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath(keyboardNavigationScenarioId));

    const customButton = page.getByRole('button', { name: 'Пользовательское действие' });
    const readOnlyInput = page.getByTestId('read-only-input');
    const disabledInput = page.getByTestId('disabled-input');
    const nextElement = page.getByTestId('after-input-states');
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    await customButton.focus();
    await page.keyboard.press(tabKey);

    await expect(readOnlyInput).toBeFocused();
    await expect(readOnlyInput).toHaveJSProperty('selectionStart', 0);
    await expect(readOnlyInput).toHaveJSProperty('selectionEnd', 'Read only value'.length);

    await page.keyboard.press(tabKey);

    await expect(disabledInput).not.toBeFocused();
    await expect(nextElement).toBeFocused();
  });

  test('shows the text cursor only over the full-height native input zone', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const defaultInput = page.getByTestId('input');
    const defaultContainer = defaultInput.locator('..');
    const [defaultInputBox, defaultContainerBox] = await Promise.all([
      defaultInput.boundingBox(),
      defaultContainer.boundingBox(),
    ]);

    expect(defaultInputBox).toEqual(defaultContainerBox);
    await expect(defaultInput).toHaveCSS('padding-left', '16px');
    await expect(defaultInput).toHaveCSS('padding-right', '16px');

    await page.goto(getPlaygroundScenarioPath(cursorZonesScenarioId));

    const component = page.getByTestId('input');
    const container = component.locator('..');
    const [componentBox, containerBox] = await Promise.all([component.boundingBox(), container.boundingBox()]);

    expect(componentBox?.y).toBe(containerBox?.y);
    expect(componentBox?.height).toBe(containerBox?.height);
    await expect(component).toHaveCSS('cursor', 'text');
    await expect(component).toHaveCSS('padding-left', '0px');
    await expect(component).toHaveCSS('padding-right', '0px');
    await expect(container).toHaveCSS('cursor', 'default');
    await expect(page.getByTestId('prefix')).toHaveCSS('cursor', 'default');
    await expect(page.getByTestId('prefix').locator('..')).toHaveCSS('padding-left', '16px');
    await expect(page.getByTestId('before-icon')).toHaveCSS('cursor', 'default');
    await expect(page.getByTestId('after-icon')).toHaveCSS('cursor', 'pointer');
    await expect(page.getByTestId('suffix')).toHaveCSS('cursor', 'default');
    await expect(page.getByTestId('suffix').locator('..')).toHaveCSS('padding-right', '16px');
  });

  test('focuses the input on icon pointer press and keeps native keyboard focus', async ({ page, browserName }) => {
    await page.goto(getPlaygroundScenarioPath(cursorZonesScenarioId));

    const component = page.getByTestId('input');
    const border = component.locator('..').locator('[data-role="input-border"]');
    const iconButton = page.getByRole('button', { name: 'Действие с полем' });
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    await component.click();
    await page.keyboard.press(tabKey);

    await expect(iconButton).toBeFocused();
    await expect(component).not.toBeFocused();
    await expect(border).toHaveCSS('border-top-width', '2px');
    await expect(iconButton).toHaveCSS('outline-width', '2px');
    await expect(iconButton).toHaveCSS('outline-style', 'solid');

    await page.keyboard.press('Enter');
    await expect(iconButton).toBeFocused();
    await expect(component).not.toBeFocused();

    await component.click();
    await iconButton.click();

    await expect(component).toBeFocused();
    await expect(iconButton).not.toBeFocused();
    await expect(border).toHaveCSS('border-top-width', '2px');
  });

  test.describe('currency input', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(currencyScenarioId));
    });

    test('replaces the fractional digit to the right of the caret', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Сумма в рублях' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) => input.setSelectionRange(7, 7));
      await page.keyboard.type('7');

      await expect(component).toHaveValue('25 000,70');
      await expect(component).toHaveJSProperty('selectionStart', 8);
    });

    test('rejects a third fractional digit and allows deleting the second one', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Сумма в рублях' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) =>
        input.setSelectionRange(input.value.length, input.value.length),
      );
      await page.keyboard.type('7');

      await expect(component).toHaveValue('25 000,50');

      await page.keyboard.press('Backspace');

      await expect(component).toHaveValue('25 000,5');
    });

    test('pads a single fractional digit with zero on blur', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Сумма в рублях' });

      await component.focus();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type('25000,5');
      await component.blur();

      await expect(component).toHaveValue('25 000,50');
    });

    test('joins fractional digits to the integer when deleting the decimal separator', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Сумма в рублях' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) => input.setSelectionRange(7, 7));
      await page.keyboard.press('Backspace');

      await expect(component).toHaveValue('2 500 050');
    });

    test('places the fixed currency after the value and renders the range limits', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Сумма в рублях' });
      const lowerBound = page.getByRole('textbox', { name: 'Нижняя граница суммы' });
      const upperBound = page.getByRole('textbox', { name: 'Верхняя граница суммы' });

      await expect(component.locator('..').getByText('RUB', { exact: true })).toBeVisible();
      await expect(component.locator('..').locator('[data-orientation="vertical"]')).toHaveCount(0);
      await expect(lowerBound).toHaveValue('1 000');
      await expect(lowerBound.locator('..')).toContainText('От');
      await expect(lowerBound.locator('..').locator('[data-orientation="vertical"]')).toHaveCount(0);
      await expect(upperBound).toHaveValue('100 000');
      await expect(upperBound.locator('..')).toContainText('До');
      await expect(upperBound.locator('..').locator('[data-orientation="vertical"]')).toHaveCount(0);
    });
  });

  test.describe('high precision numbers input', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(getPlaygroundScenarioPath(highPrecisionNumbersScenarioId));
    });

    test('groups integer digits and replaces a dot with the decimal comma', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Число с динамической дробной частью' });

      await component.fill('10200300.1234567890123456789012345');

      await expect(component).toHaveValue('10 200 300,1234567890123456789012345');
    });

    test('adds zero when the decimal separator is entered first', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Число с динамической дробной частью' });

      await component.pressSequentially(',1');

      await expect(component).toHaveValue('0,1');
    });

    test('replaces a fractional digit when maximum precision is reached', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Число с четырьмя знаками после запятой' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) => input.setSelectionRange(13, 13));
      await page.keyboard.type('0');

      await expect(component).toHaveValue('10 200 300,1204');
    });

    test('joins fractional digits to the integer when the decimal comma is deleted', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Число с четырьмя знаками после запятой' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) => input.setSelectionRange(11, 11));
      await page.keyboard.press('Backspace');

      await expect(component).toHaveValue('102 003 001 234');
    });

    test('limits percentages to 100 and two fractional digits', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Процент с двумя знаками после запятой' });

      await component.fill('99,999');

      await expect(component).toHaveValue('99,99 %');
      await component.fill('101');
      await expect(component).not.toHaveValue('101');
    });

    test('keeps units inside the numeric mask', async ({ page }) => {
      const percentage = page.getByRole('textbox', { name: 'Процент с двумя знаками после запятой' });
      const distance = page.getByRole('textbox', {
        name: 'Расстояние с двумя десятичными знаками по умолчанию',
      });

      await expect(percentage).toHaveValue('50,25 %');
      await percentage.focus();
      await page.keyboard.press('End');
      await page.keyboard.press('Backspace');
      await expect(percentage).toHaveValue(/ %$/);
      await expect(distance).toHaveValue('50,00 км');
    });

    test('enables negative values only for the dedicated example', async ({ page }) => {
      const unsignedComponent = page.getByRole('textbox', { name: 'Число с динамической дробной частью' });
      const signedComponent = page.getByRole('textbox', { name: 'Отрицательное число' });

      await unsignedComponent.fill('-25');
      await signedComponent.fill('-25');

      await expect(unsignedComponent).toHaveValue('25');
      await expect(signedComponent).toHaveValue('-25');
    });

    test('limits CVC to three integer digits', async ({ page }) => {
      const component = page.getByRole('textbox', { name: 'Введите CVC код' });

      await component.focus();
      await component.evaluate((input: HTMLInputElement) =>
        input.setSelectionRange(input.value.length, input.value.length),
      );
      await page.keyboard.type('45.6-');

      await expect(component).toHaveValue('234');
    });
  });

  test('shows a readOnly password as plain text without the visibility action', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(passwordReadOnlyScenarioId));

    const component = page.getByRole('textbox', { name: 'Пароль' });

    await expect(component).toHaveAttribute('type', 'text');
    await expect(component).toHaveValue('123456');
    await expect(page.getByRole('button', { name: /пароль/i })).toHaveCount(0);
  });

  test('reveals readOnly data by click, focus and an external group action', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(readOnlyDataMaskingScenarioId));

    const clickInput = page.getByTestId('read-only-click-input');
    const focusInput = page.getByTestId('read-only-focus-input');
    const groupCard = page.getByTestId('read-only-group-card');

    await expect(clickInput).toHaveValue('a••••@mail.ru');
    await clickInput.click();
    await expect(clickInput).toHaveValue('apollon13@mail.ru');

    await expect(focusInput).toHaveValue('08.05.••••');
    await focusInput.focus();
    await expect(focusInput).toHaveValue('08.05.1992');
    await focusInput.blur();
    await expect(focusInput).toHaveValue('08.05.••••');

    await expect(groupCard).toHaveValue('•••• •••• •••• 548');
    await page.getByRole('button', { name: 'Показать реквизиты' }).click();
    await expect(groupCard).toHaveValue('5543 9764 3143 2548');
  });
});

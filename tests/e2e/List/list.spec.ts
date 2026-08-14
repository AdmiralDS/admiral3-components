import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const getMarkerStyle = (item: HTMLElement) => {
  const style = getComputedStyle(item, '::before');
  return {
    color: style.color,
    content: style.content,
    fontSize: style.fontSize,
    height: style.height,
    marginInlineEnd: style.marginInlineEnd,
  };
};

test.describe('List default', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/default'));
  });

  test('renders an ordered list with semantic items', async ({ page }) => {
    const list = page.getByTestId('ordered-list');
    const items = list.getByRole('listitem');

    await expect(list).toBeVisible();
    await expect(items).toHaveCount(4);
    await expect(items.first()).toHaveText('Текст строки');
  });

  test('applies the default dimension and layout', async ({ page }) => {
    const list = page.getByTestId('ordered-list');

    await expect(list).toHaveCSS('display', 'flex');
    await expect(list).toHaveCSS('gap', '8px');
  });

  test('applies the default number marker', async ({ page }) => {
    const marker = await page.getByTestId('ordered-list').getByRole('listitem').first().evaluate(getMarkerStyle);

    expect(marker).toMatchObject({
      content: 'counters(admiral-list-counter, ".") "."',
      height: '24px',
      marginInlineEnd: '8px',
    });
  });
});

test.describe('List variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/variants'));
  });

  test('applies the small dimension and custom gap to an ordered list', async ({ page }) => {
    const list = page.getByTestId('ordered-variant');

    await expect(list).toHaveCSS('gap', '12px');
    await expect(list.getByRole('listitem').first()).toHaveCSS('font-size', '14px');

    const marker = await list.getByRole('listitem').first().evaluate(getMarkerStyle);
    expect(marker).toMatchObject({ height: '20px', marginInlineEnd: '6px' });
  });

  test('applies the extra-small dimension to an unordered list', async ({ page }) => {
    const list = page.getByTestId('unordered-custom');

    await expect(list.getByRole('listitem').first()).toHaveCSS('font-size', '12px');
  });

  test('applies a custom marker mixin', async ({ page }) => {
    const marker = await page.getByTestId('unordered-custom').getByRole('listitem').first().evaluate(getMarkerStyle);

    expect(marker).toMatchObject({
      color: 'rgb(0, 128, 0)',
      content: '"✓"',
      height: '16px',
      marginInlineEnd: '6px',
    });
  });
});

test.describe('List marker types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/markers'));
  });

  const markerCases = [
    ['ordered-numbers', 'counters(admiral-list-counter, ".") "."'],
    ['ordered-lower-letters', 'counter(admiral-list-counter, lower-cyrillic) ")"'],
    ['ordered-upper-letters', 'counter(admiral-list-counter, upper-cyrillic) ")"'],
    ['unordered-bullet', '"•"'],
    ['unordered-virgule', '"—"'],
    ['unordered-icon', 'none'],
  ] as const;

  for (const [testId, content] of markerCases) {
    test(`applies the ${testId} marker`, async ({ page }) => {
      const marker = await page.getByTestId(testId).getByRole('listitem').first().evaluate(getMarkerStyle);

      expect(marker.content).toBe(content);
    });
  }

  test('applies the bullet marker size', async ({ page }) => {
    const marker = await page.getByTestId('unordered-bullet').getByRole('listitem').first().evaluate(getMarkerStyle);

    expect(marker.fontSize).toBe('18px');
  });

  test('applies a custom counter marker', async ({ page }) => {
    const marker = await page.getByTestId('ordered-custom').getByRole('listitem').first().evaluate(getMarkerStyle);

    expect(marker).toMatchObject({
      color: 'rgb(255, 99, 71)',
      content: '"[" counter(admiral-list-counter) "]"',
    });
  });
});

test.describe('List icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/icon'));
  });

  test('applies icon metrics from the list dimension', async ({ page }) => {
    const icon = page.getByTestId('list-icon');

    await expect(icon).toHaveCSS('width', '20px');
    await expect(icon).toHaveCSS('height', '20px');
    await expect(icon).toHaveCSS('margin-inline-end', '6px');
  });

  test('applies a custom icon color', async ({ page }) => {
    const filledPaths = page.getByTestId('list-icon').locator("[fill^='#'], [fill='currentColor']");

    await expect(filledPaths.first()).toHaveCSS('fill', 'rgb(255, 0, 0)');
  });
});

test.describe('List item value', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/item-value'));
  });

  test('sets the CSS counter to the item value', async ({ page }) => {
    const list = page.getByTestId('ordered-value-list');
    const item = list.locator(':scope > li').nth(1);

    await expect(list).toHaveCSS('counter-reset', 'admiral-list-counter 0');
    await expect(item).toHaveCSS('counter-increment', 'admiral-list-counter 1');
    await expect(item).toHaveCSS('counter-set', 'admiral-list-counter 5');
  });
});

test.describe('List theme colors', () => {
  test('resolves the item text color in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/default'));
    const item = page.getByTestId('ordered-list').getByRole('listitem').first();

    const lightColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest');
    await expect(item).toHaveCSS('color', lightColor);

    await page.locator('#playground-theme').selectOption('dark');
    const darkColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest');
    await expect(item).toHaveCSS('color', darkColor);
  });

  test('resolves the bullet marker color in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/markers'));
    const item = page.getByTestId('unordered-bullet').getByRole('listitem').first();

    const lightColor = await resolveCssColorToken(page, '--admiral-color-neutral-base-4-rest');
    expect((await item.evaluate(getMarkerStyle)).color).toBe(lightColor);

    await page.locator('#playground-theme').selectOption('dark');
    const darkColor = await resolveCssColorToken(page, '--admiral-color-neutral-base-4-rest');
    expect((await item.evaluate(getMarkerStyle)).color).toBe(darkColor);
  });

  test('resolves the default icon color in light and dark themes', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/icon'));
    const icon = page.getByTestId('default-list-icon');

    const lightColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-2-rest');
    await expect(icon).toHaveCSS('color', lightColor);

    await page.locator('#playground-theme').selectOption('dark');
    const darkColor = await resolveCssColorToken(page, '--admiral-color-neutral-text-2-rest');
    await expect(icon).toHaveCSS('color', darkColor);
  });
});

test.describe('List multiline layout', () => {
  test('wraps item content onto multiple lines', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/multiline'));
    const content = page.getByTestId('multiline-list').getByRole('listitem').first().locator(':scope > div');

    await expect(content).toHaveCSS('display', 'block');
    const { height, lineHeight } = await content.evaluate((element) => {
      const style = getComputedStyle(element);
      return { height: element.getBoundingClientRect().height, lineHeight: Number.parseFloat(style.lineHeight) };
    });
    expect(height).toBeGreaterThan(lineHeight);
  });
});

test.describe('List nested counters', () => {
  test('uses hierarchical counters for a nested ordered list', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/nested-counters'));
    const outerItems = page.getByTestId('outer-ordered-list').locator(':scope > li');
    const innerItems = page.getByTestId('outer-ordered-list').locator(':scope > li > div > ol > li');

    await expect(outerItems).toHaveCount(3);
    await expect(innerItems).toHaveCount(2);
    expect((await innerItems.first().evaluate(getMarkerStyle)).content).toBe('counters(admiral-list-counter, ".") "."');
  });

  test('applies the parent gap above a nested list', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/nested-counters'));
    const nestedList = page.getByTestId('outer-ordered-list').locator(':scope > li > div > ol');

    await expect(nestedList).toHaveCSS('margin-top', '8px');
  });
});

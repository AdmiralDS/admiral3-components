import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath } from '../utils';

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

test.describe('List playground', () => {
  test('renders an ordered list with semantic items and default layout', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/default'));

    const list = page.getByTestId('ordered-list');
    const items = list.getByRole('listitem');

    await expect(list).toBeVisible();
    await expect(list).toHaveAttribute('role', 'list');
    await expect(list).toHaveAttribute('data-dimension', 'm');
    await expect(list).toHaveCSS('display', 'flex');
    await expect(list).toHaveCSS('gap', '8px');
    await expect(items).toHaveCount(2);
    await expect(items.first()).toHaveAttribute('role', 'listitem');
    await expect(items.first()).toHaveText('Первый пункт');

    const marker = await items.first().evaluate(getMarkerStyle);
    expect(marker.content).toBe('counters(admiral-list-counter, ".") "."');
    expect(marker.height).toBe('24px');
    expect(marker.marginInlineEnd).toBe('8px');
  });

  test('applies dimensions, custom gap and marker styles to list variants', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/variants'));

    const ordered = page.getByTestId('ordered-letters');
    const unordered = page.getByTestId('unordered-custom');
    const nested = page.getByTestId('nested-list');

    await expect(ordered).toHaveAttribute('data-dimension', 's');
    await expect(ordered).toHaveCSS('gap', '12px');
    await expect(ordered.getByRole('listitem').first()).toHaveCSS('font-size', '14px');
    await expect(unordered).toHaveAttribute('data-dimension', 'xs');
    await expect(unordered.getByRole('listitem').first()).toHaveCSS('font-size', '12px');
    await expect(nested).toHaveCSS('margin-top', '8px');

    const orderedMarker = await ordered.getByRole('listitem').first().evaluate(getMarkerStyle);
    expect(orderedMarker.height).toBe('20px');
    expect(orderedMarker.marginInlineEnd).toBe('6px');

    const unorderedMarker = await unordered.getByRole('listitem').first().evaluate(getMarkerStyle);
    expect(unorderedMarker).toMatchObject({
      color: 'rgb(0, 128, 0)',
      content: '"✓"',
      height: '16px',
      marginInlineEnd: '6px',
    });
  });

  test('applies every marker configuration and a custom counter marker', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/markers'));

    const expectedContent = {
      'ordered-numbers': 'counters(admiral-list-counter, ".") "."',
      'ordered-lower-letters': 'counter(admiral-list-counter, lower-cyrillic) ")"',
      'ordered-upper-letters': 'counter(admiral-list-counter, upper-cyrillic) ")"',
      'unordered-bullet': '"•"',
      'unordered-virgule': '"—"',
      'unordered-icon': 'none',
    };

    for (const [testId, content] of Object.entries(expectedContent)) {
      const marker = await page.getByTestId(testId).getByRole('listitem').evaluate(getMarkerStyle);
      expect(marker.content).toBe(content);
    }

    const bulletMarker = await page.getByTestId('unordered-bullet').getByRole('listitem').evaluate(getMarkerStyle);
    expect(bulletMarker.fontSize).toBe('18px');

    const customMarker = await page.getByTestId('ordered-custom').getByRole('listitem').evaluate(getMarkerStyle);
    expect(customMarker).toMatchObject({
      color: 'rgb(255, 99, 71)',
      content: '"[" counter(admiral-list-counter) "]"',
    });
  });

  test('renders a decorative custom-colored icon with dimension metrics', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/icon'));

    const list = page.getByTestId('icon-list');
    const icon = page.getByTestId('list-icon');

    await expect(list).toHaveAttribute('data-dimension', 's');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveAttribute('focusable', 'false');
    await expect(icon).toHaveCSS('width', '20px');
    await expect(icon).toHaveCSS('height', '20px');
    await expect(icon).toHaveCSS('margin-inline-end', '6px');

    const filledPaths = icon.locator("[fill^='#'], [fill='currentColor']");
    await expect(filledPaths.first()).toHaveCSS('fill', 'rgb(255, 0, 0)');
  });

  test('supports reversed, list start and item value in native and CSS counters', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath('list/item-value'));

    await expect(page.getByTestId('ordered-value-list')).toHaveAttribute('start', '6');
    await expect(page.getByTestId('ordered-value-list')).toHaveAttribute('reversed', '');
    await expect(page.getByTestId('ordered-value-list')).toHaveCSS('counter-reset', 'admiral-list-counter 7');
    await expect(page.getByTestId('ordered-value')).toHaveAttribute('value', '5');
    await expect(page.getByTestId('ordered-value')).toHaveCSS('counter-increment', 'admiral-list-counter -1');
    await expect(page.getByTestId('ordered-value')).toHaveCSS('counter-set', 'admiral-list-counter 5');
  });
});

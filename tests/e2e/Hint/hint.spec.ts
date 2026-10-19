import { expect, test } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'hint/default';
const clickScenarioId = 'hint/click';

test.describe('Hint playground', () => {
  test('opens on hover, links the target with aria-describedby and closes on Escape', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Наведи курсор или установи фокус' });
    const hint = page.getByRole('tooltip');

    await expect(hint).toHaveCount(0);
    await expect(target).not.toHaveAttribute('aria-describedby');
    await target.hover();

    await expect(hint).toBeVisible();
    await expect(hint).toHaveText('Hint');
    expect(await target.getAttribute('aria-describedby')).toBe(await hint.getAttribute('id'));

    await page.keyboard.press('Escape');
    await expect(hint).toHaveCount(0);
    await expect(target).not.toHaveAttribute('aria-describedby');
  });

  test('opens immediately on keyboard focus and closes after focus leaves', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const target = page.getByRole('button', { name: 'Наведи курсор или установи фокус' });
    const hint = page.getByRole('tooltip');

    await target.focus();
    await expect(hint).toBeVisible();
    await page.locator('#playground-theme').focus();
    await expect(hint).toHaveCount(0);
  });

  test('keeps hover hint open while the pointer is over it', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    await page.getByRole('button', { name: 'Наведи курсор или установи фокус' }).hover();
    const hint = page.getByRole('tooltip');
    await hint.hover();

    await expect(hint).toBeVisible();
  });

  test('opens an accessible dialog in click mode and closes from the close button', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(clickScenarioId));

    const target = page.getByRole('button', { name: 'Показать подсказку' });
    const hint = page.getByRole('dialog');
    await expect(target).toHaveAttribute('aria-expanded', 'false');

    await target.click();

    await expect(hint).toBeVisible();
    await expect(target).toHaveAttribute('aria-expanded', 'true');
    const hintId = await hint.getAttribute('id');
    const targetId = await target.getAttribute('id');
    expect(hintId).toBeTruthy();
    expect(targetId).toBeTruthy();
    await expect(target).toHaveAttribute('aria-controls', hintId!);
    await expect(hint).toHaveAttribute('aria-labelledby', targetId!);

    await page.getByRole('button', { name: 'Закрыть подсказку' }).click();
    await expect(hint).toHaveCount(0);
    await expect(target).toHaveAttribute('aria-expanded', 'false');
  });

  test('keeps click hint open on internal interaction and closes on an outside click', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(clickScenarioId));

    await page.getByRole('button', { name: 'Показать подсказку' }).click();
    const hint = page.getByRole('dialog');
    await page.getByRole('button', { name: 'Подробнее' }).click();
    await expect(hint).toBeVisible();

    await page.locator('#playground-theme').click();
    await expect(hint).toHaveCount(0);
  });

  test('opens from native button activation with Enter and Space', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(clickScenarioId));

    const trigger = page.getByRole('button', { name: 'Показать подсказку' });
    const close = page.getByRole('button', { name: 'Закрыть подсказку' });

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Space');
    await expect(page.getByRole('dialog')).toBeVisible();
    await close.click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('uses a full-width portal and page-centered layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    await page.getByRole('button', { name: 'Наведи курсор или установи фокус' }).focus();

    const hint = page.getByRole('tooltip');
    const wrapper = hint.locator('xpath=..');
    const portal = wrapper.locator('xpath=..');
    await expect(hint).toBeVisible();
    await expect(wrapper).toHaveCSS('align-self', 'center');
    await expect(portal).toHaveCSS('left', '0px');
    await expect(portal).toHaveCSS('width', '375px');
  });

  test('resolves theme token styles', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));
    await page.getByRole('button', { name: 'Наведи курсор или установи фокус' }).focus();

    const hint = page.getByRole('tooltip');
    const expectedBackground = await resolveCssColorToken(page, '--admiral-color-neutral-base-elevated-rest');
    const expectedText = await resolveCssColorToken(page, '--admiral-color-neutral-text-1-rest');

    await expect(hint).toHaveCSS('background-color', expectedBackground);
    await expect(hint).toHaveCSS('color', expectedText);
  });
});

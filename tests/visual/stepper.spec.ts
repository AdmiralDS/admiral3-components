import { themeModes } from '@admiral-ds/admiral3-tokens';
import { expect, test } from '@playwright/test';

import { VISUAL_SCENARIO_IDS } from '../../playground/scenarios/visual/manifest';
import { STEPPER_COLOR_MODES, STEPPER_DIMENSIONS, STEPPER_ORIENTATIONS } from '../../src/components/Stepper/constants';

// Псевдосостояния снимаются настоящими действиями браузера, без подмены стилей в матрице.
for (const theme of themeModes) {
  test(`Stepper interactive states / ${theme}`, async ({ page }) => {
    await page.addInitScript((mode) => window.localStorage.setItem('admiral-playground-theme', mode), theme);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?scenario=${encodeURIComponent(VISUAL_SCENARIO_IDS.stepper)}`);
    await page.evaluate(() => document.fonts.ready);
    for (const orientation of STEPPER_ORIENTATIONS) {
      for (const dimension of STEPPER_DIMENSIONS) {
        for (const colorMode of STEPPER_COLOR_MODES) {
          const id = `${orientation}-${dimension}-${colorMode}`;
          const root = page.locator(`[data-stepper-visual="${id}"]`);
          const sample = root.locator('..');
          const button = root.getByRole('button', { name: 'Done', exact: true });
          await button.hover();
          await expect(sample).toHaveScreenshot(`stepper-${theme}-${id}-hover.png`);
          await page.mouse.down();
          try {
            await expect(sample).toHaveScreenshot(`stepper-${theme}-${id}-press.png`);
          } finally {
            await page.mouse.up();
          }
          await page.mouse.move(0, 0);
          await page.keyboard.press('Tab');
          await button.focus();
          await expect(sample).toHaveScreenshot(`stepper-${theme}-${id}-focus.png`);
        }
      }
    }
  });
}

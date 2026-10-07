import type { Locator, Page } from '@playwright/test';

import { TIMEOUTS } from './constants';

/** Возвращает сочетание для перехода между всеми фокусируемыми элементами. */
export const getTabKey = (browserName: 'chromium' | 'firefox' | 'webkit', reverse = false) => {
  const alt = browserName === 'webkit' && process.platform === 'darwin';
  return `${alt ? 'Alt+' : ''}${reverse ? 'Shift+' : ''}Tab`;
};

/** Возвращает путь к internal playground сценарию для e2e. */
export const getPlaygroundScenarioPath = (scenarioId: string) => {
  return `/?scenario=${encodeURIComponent(scenarioId)}`;
};

/** Возвращает browser-computed color из CSS custom property текущей playground theme. */
export const resolveCssColorToken = (page: Page, tokenName: string) => {
  return page.evaluate((name) => {
    const themeRoot = document.querySelector<HTMLElement>('[data-admiral-theme]') ?? document.body;
    const probe = document.createElement('div');

    probe.style.setProperty('color', `var(${name})`);
    probe.style.setProperty('position', 'absolute');
    probe.style.setProperty('visibility', 'hidden');

    themeRoot.appendChild(probe);

    const value = getComputedStyle(probe).color;
    probe.remove();

    return value;
  }, tokenName);
};

/**
 * Делает click по элементу и добавляет короткую паузу
 * для сценариев, где после клика нужен небольшой запас на анимацию или UI-обновление.
 */
export async function clickAndWait(el: Locator, page: Page, timeout?: number) {
  await el.click();
  await page.waitForTimeout(timeout || TIMEOUTS.WAIT_DEFAULT);
}

import { expect, test, type Locator } from '@playwright/test';

import { getPlaygroundScenarioPath, resolveCssColorToken } from '../utils';

const defaultScenarioId = 'skeleton/default';
const skeletonRestBackgroundColorToken = '--admiral-color-neutral-base-opacity-rest';
const skeletonHoverBackgroundColorToken = '--admiral-color-neutral-base-opacity-hover';
const skeletonAnimationDuration = '4s';
const skeletonAnimationTimingFunction = 'ease';
const skeletonAnimationIterationCount = 'infinite';

// Хелпер разбивает строку rgba/rgb на массив отдельных чисел [R, G, B, A]
const parseRgba = (colorString: string): [number, number, number, number] => {
  // Находим все числа (включая десятичные дроби для альфа-канала)
  const matches = colorString.match(/[\d.]+/g);
  if (!matches) return [0, 0, 0, 0];

  const r = parseInt(matches[0], 10);
  const g = parseInt(matches[1], 10);
  const b = parseInt(matches[2], 10);
  // Если альфа-канал отсутствует (формат rgb), выставляем его в 1
  const a = matches[3] ? parseFloat(matches[3]) : 1;

  return [r, g, b, a];
};

const setAnimationTime = async (element: Locator, time: number) => {
  await element.evaluate((el: HTMLElement, currentTime: number) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = currentTime;
  }, time);
};

test.describe('Skeleton playground', () => {
  test('resolves layout size in the browser', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const skeleton = page.getByTestId('skeleton');

    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveCSS('width', '200px');
    await expect(skeleton).toHaveCSS('height', '40px');
    await expect(skeleton).toHaveCSS('border-radius', '4px');

    const box = await skeleton.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeCloseTo(200, 1);
    expect(box?.height).toBeCloseTo(40, 1);
  });

  test('applies correct animation', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));

    const animationProps = await page.evaluate((selector) => {
      const el = document.querySelector(selector) as HTMLElement;
      const styles = getComputedStyle(el);
      return {
        name: styles.animationName,
        duration: styles.animationDuration,
        timingFunction: styles.animationTimingFunction,
        iterationCount: styles.animationIterationCount,
      };
    }, '[data-testid="skeleton"]');

    expect(animationProps.name).not.toBe('none');
    expect(animationProps.duration).toBe(skeletonAnimationDuration);
    expect(animationProps.timingFunction).toBe(skeletonAnimationTimingFunction);
    expect(animationProps.iterationCount).toBe(skeletonAnimationIterationCount);
  });

  test('alternates background color tokens during skeleton animation', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));
    const skeleton = page.getByTestId('skeleton');

    // Анимация на старте (0%)
    await setAnimationTime(skeleton, 0);
    const actualBackgroundColor = await skeleton.evaluate((el) => getComputedStyle(el).backgroundColor);
    const expectedBackgroundColor = await resolveCssColorToken(page, skeletonRestBackgroundColorToken);
    const [actualR, actualG, actualB, actualA] = parseRgba(actualBackgroundColor);
    const [expectedR, expectedG, expectedB, expectedA] = parseRgba(expectedBackgroundColor);
    expect(actualR).toBe(expectedR);
    expect(actualG).toBe(expectedG);
    expect(actualB).toBe(expectedB);
    // Проверка альфа-канала с допуском на микроокругление браузеров
    expect(Math.abs(actualA - expectedA)).toBeLessThan(0.01);

    // Перематываем анимацию на середину (50% / 2 секунды для анимации в 4s)
    await setAnimationTime(skeleton, 2000);
    const actualBackgroundColor2 = await skeleton.evaluate((el) => getComputedStyle(el).backgroundColor);
    const expectedBackgroundColor2 = await resolveCssColorToken(page, skeletonHoverBackgroundColorToken);
    const [actualR2, actualG2, actualB2, actualA2] = parseRgba(actualBackgroundColor2);
    const [expectedR2, expectedG2, expectedB2, expectedA2] = parseRgba(expectedBackgroundColor2);

    expect(actualR2).toBe(expectedR2);
    expect(actualG2).toBe(expectedG2);
    expect(actualB2).toBe(expectedB2);
    // Проверка альфа-канала с допуском на микроокругление браузеров
    expect(Math.abs(actualA2 - expectedA2)).toBeLessThan(0.01);
  });

  test('alternates background color tokens during skeleton animation in dark mode', async ({ page }) => {
    await page.goto(getPlaygroundScenarioPath(defaultScenarioId));
    await page.locator('#playground-theme').selectOption('dark');
    await expect(page.locator('[data-admiral-theme]')).toHaveAttribute('data-admiral-theme', 'dark');
    const skeleton = page.getByTestId('skeleton');

    // Анимация на старте (0%)
    await setAnimationTime(skeleton, 0);
    const actualBackgroundColor = await skeleton.evaluate((el) => getComputedStyle(el).backgroundColor);
    const expectedBackgroundColor = await resolveCssColorToken(page, skeletonRestBackgroundColorToken);
    const [actualR, actualG, actualB, actualA] = parseRgba(actualBackgroundColor);
    const [expectedR, expectedG, expectedB, expectedA] = parseRgba(expectedBackgroundColor);
    expect(actualR).toBe(expectedR);
    expect(actualG).toBe(expectedG);
    expect(actualB).toBe(expectedB);
    // Проверка альфа-канала с допуском на микроокругление браузеров
    expect(Math.abs(actualA - expectedA)).toBeLessThan(0.01);

    // Перематываем анимацию на середину (50% / 2 секунды для анимации в 4s)
    await setAnimationTime(skeleton, 2000);
    const actualBackgroundColor2 = await skeleton.evaluate((el) => getComputedStyle(el).backgroundColor);
    const expectedBackgroundColor2 = await resolveCssColorToken(page, skeletonHoverBackgroundColorToken);
    const [actualR2, actualG2, actualB2, actualA2] = parseRgba(actualBackgroundColor2);
    const [expectedR2, expectedG2, expectedB2, expectedA2] = parseRgba(expectedBackgroundColor2);

    expect(actualR2).toBe(expectedR2);
    expect(actualG2).toBe(expectedG2);
    expect(actualB2).toBe(expectedB2);
    // Проверка альфа-канала с допуском на микроокругление браузеров
    expect(Math.abs(actualA2 - expectedA2)).toBeLessThan(0.01);
  });
});

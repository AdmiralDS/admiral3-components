import { expect, type Page } from '@playwright/test';

import { getTabKey, resolveCssColorToken } from './utils';

/** Проверяет общий клавиатурный контракт Avatar и ActivityAvatar в interaction-сценарии. */
export const checkAvatarKeyboardInteraction = async (page: Page, browserName: 'chromium' | 'firefox' | 'webkit') => {
  const avatar = page.getByTestId('interactive-avatar');
  const tabKey = getTabKey(browserName);

  await page.getByTestId('before-avatar').focus();
  await page.keyboard.press(tabKey);

  await expect(avatar).toBeFocused();
  await expect(page.getByRole('tooltip')).toHaveText('Иван Иванов');
  await expect(avatar).toHaveAccessibleName('Иван Иванов');
  await expect(avatar).toHaveAttribute('aria-describedby', 'avatar-description');
  await expect(avatar).toHaveAccessibleDescription('Открыть профиль пользователя');
  const focusColor = await resolveCssColorToken(page, '--admiral-color-primary-stroke-1-rest');
  await expect
    .poll(() =>
      avatar.evaluate((element) => {
        const ring = getComputedStyle(element, '::before');
        return {
          focusVisible: element.matches(':focus-visible'),
          content: ring.content,
          borderStyle: ring.borderTopStyle,
          borderWidth: ring.borderTopWidth,
          borderColor: ring.borderTopColor,
          rounded: ring.borderTopLeftRadius !== '0px',
          behindStatus: Number(ring.zIndex) < 0,
        };
      }),
    )
    .toEqual({
      focusVisible: true,
      content: '""',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: focusColor,
      rounded: true,
      behindStatus: true,
    });

  await page.keyboard.press('Enter');
  await expect(page.getByTestId('activation-count')).toHaveText('1');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('activation-count')).toHaveText('2');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect(avatar).toBeFocused();

  await page.keyboard.press(tabKey);
  await expect(page.getByTestId('after-avatar')).toBeFocused();
  await expect(page.getByTestId('passive-avatar')).toHaveAttribute('tabindex', '-1');
};

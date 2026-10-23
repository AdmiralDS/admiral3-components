import type { HTMLAttributes, ReactNode } from 'react';

import type { AVATAR_APPEARANCES, AVATAR_DIMENSIONS, AVATAR_STATUSES } from './constants';

export type AvatarDimension = (typeof AVATAR_DIMENSIONS)[number];
export type AvatarStatus = (typeof AVATAR_STATUSES)[number];
export type AvatarAppearances = (typeof AVATAR_APPEARANCES)[number];

export interface AvatarStatusColorConfig {
  /** Стили статуса. */
  backgroundColor: string;
}

export interface AvatarAppearanceColorConfig {
  /** Стили фона. */
  backgroundColor?: string;
  /** Стили текста. */
  textColor?: string;
  /** Стили иконки. */
  iconColor?: string;
}

export interface AvatarBaseProps extends HTMLAttributes<HTMLButtonElement> {
  /** Имя пользователя, будет использовано внутри тултипа и для генерации инициалов (в случае если не задан параметр userInitials) */
  userName: string;
  /** Инициалы пользователя. По умолчанию вычисляются на основании userName - берутся первые буквы первых
   *  двух слов (одного слова для dimension='xs' и меньше), входящих в userName
   */
  userInitials?: string;
  /** URL аватарки пользователя */
  href?: string;
  /** Статус пользователя -
   * можно выбрать один из четырех исходных вариантов, либо задать свой цвет.
   **/
  status?: AvatarStatus | AvatarStatusColorConfig;
  /** Иконка для отображения. */
  icon?: ReactNode;
  /** Внешний вид компонента (цвет заливки, текста, иконки). **/
  appearance?: AvatarAppearances | AvatarAppearanceColorConfig;
  /** Размер компонента. */
  dimension?: AvatarDimension;
  /** Отображение тултипа. */
  showTooltip?: boolean;
  /** Аватар с опцией activity ring. */
  withActivityRing?: boolean;
  /** Отображение activity ring. */
  showActivityRing?: boolean;
}

export type AvatarSVGProps = {
  dimension: AvatarDimension;
  hasImage?: boolean;
  href?: string;
  status?: AvatarStatus | AvatarStatusColorConfig;
  appearance?: AvatarAppearances | AvatarAppearanceColorConfig;
  withActivityRing?: boolean;
  showActivityRing?: boolean;
};

export interface StyledAvatarWrapperProps {
  $dimension: AvatarDimension;
  $status: AvatarStatus;
  $statusColorConfig?: AvatarStatusColorConfig;
  $clickable: boolean;
}

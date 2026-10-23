import { textStyles } from '@admiral-ds/admiral3-tokens';
import type { CSSObject } from 'styled-components';

export const AVATAR_DIMENSIONS = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl'] as const;

interface AvatarDimensionParameters {
  size: number;
  paddingBlock: number;
  iconSize: number;
  statusSize: number;
  typography: CSSObject;
}

export const AVATAR_DIMENSION_PARAMETERS = {
  xxxs: { size: 16, paddingBlock: 0, iconSize: 0, statusSize: 0, typography: textStyles.caption.caption1 },
  xxs: { size: 20, paddingBlock: 2, iconSize: 0, statusSize: 0, typography: textStyles.caption.caption1 },
  xs: { size: 24, paddingBlock: 4, iconSize: 16, statusSize: 6, typography: textStyles.caption.caption1 },
  s: { size: 32, paddingBlock: 8, iconSize: 16, statusSize: 10, typography: textStyles.caption.caption1 },
  m: { size: 40, paddingBlock: 10, iconSize: 24, statusSize: 12, typography: textStyles.body.body1Short },
  l: { size: 48, paddingBlock: 14, iconSize: 28, statusSize: 14, typography: textStyles.body.body1Short },
  xl: { size: 56, paddingBlock: 16, iconSize: 32, statusSize: 18, typography: textStyles.subtitle.subtitle1 },
} as const satisfies Record<(typeof AVATAR_DIMENSIONS)[number], AvatarDimensionParameters>;

export const AVATAR_STATUSES = ['neutral', 'attention', 'success', 'error'] as const;

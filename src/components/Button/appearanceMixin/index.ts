import { css } from 'styled-components';

import type { ButtonColorConfig, ButtonColorMode, ButtonAppearance } from '../types';
import { customAppearanceMixin } from './customAppearanceMixin';
import { flatAppearanceMixin } from './flatAppearanceMixin';
import { ghostAppearanceMixin } from './ghostAppearanceMixin';
import { outlineAppearanceMixin } from './outlineAppearanceMixin';
import { solidAppearanceMixin } from './solidAppearanceMixin';

export const buttonAppearanceMixin = css<{
  $colorMode: ButtonColorMode;
  $appearance: ButtonAppearance;
  $buttonGroup?: boolean;
  $colorConfig?: ButtonColorConfig;
  $skeleton?: boolean;
}>`
  &[data-appearance~='solid'] {
    ${solidAppearanceMixin}
  }
  &[data-appearance~='outline'] {
    ${outlineAppearanceMixin}
  }
  &[data-appearance~='flat'] {
    ${flatAppearanceMixin}
  }
  &[data-appearance~='ghost'] {
    ${ghostAppearanceMixin}
  }
  &[data-appearance~='custom'] {
    ${customAppearanceMixin}
  }
`;

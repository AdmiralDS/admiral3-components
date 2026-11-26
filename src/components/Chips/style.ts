import styled, { css } from 'styled-components';

import { hoverPressLeaveTransition } from '#src/theme/animation';

import { CHIPS_DIMENSION_PARAMETERS } from './constants';
import type { ChipAppearance, ChipColorMode, ChipDimension } from './types';
import { cssToken } from '../../theme/cssToken';

interface DimensionStyleProps {
  $dimension: ChipDimension;
}

interface ChipStyleProps extends DimensionStyleProps {
  $appearance: ChipAppearance;
  $colorMode: ChipColorMode;
  $disabled?: boolean;
  $readOnly?: boolean;
}

interface ChipDataAttributes {
  'data-appearance'?: ChipAppearance;
  'data-color-mode'?: ChipColorMode;
  'data-dimension'?: ChipDimension;
}

const textNeutral1Rest = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const textNeutral2Rest = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const textNeutralDisabledRest = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const textPrimary1Rest = cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest);

const backgroundPrimary3Rest = cssToken(
  '--admiral-color-primary-base-3-rest',
  (theme) => theme.color.primary.base._3.rest,
);
const borderNeutral2Rest = cssToken(
  '--admiral-color-neutral-stroke-2-rest',
  (theme) => theme.color.neutral.stroke._2.rest,
);
const backgroundNeutralOpacityRest = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const borderPrimary1Rest = cssToken(
  '--admiral-color-primary-stroke-1-rest',
  (theme) => theme.color.primary.stroke._1.rest,
);
const borderNeutralDisabled = cssToken(
  '--admiral-color-neutral-stroke-2-rest',
  (theme) => theme.color.neutral.stroke._2.rest,
);

const chipHeight = css<DimensionStyleProps>`
  height: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].height}px;
`;

const iconHeight = css<DimensionStyleProps>`
  height: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].iconSize}px;
`;

const iconWidth = css<DimensionStyleProps>`
  width: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].iconSize}px;
`;

const chipTypography = css<ChipStyleProps>`
  ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${(props) => {
    const { $colorMode, $disabled } = props;
    if ($disabled) {
      return textNeutralDisabledRest(props);
    }

    return $colorMode === 'neutral' ? textNeutral1Rest(props) : textPrimary1Rest(props);
  }};
`;

const colorsBorderAndBackground = css<ChipStyleProps>`
  transition:
    background-color ${hoverPressLeaveTransition},
    border-color ${hoverPressLeaveTransition};
  border-radius: ${cssToken('--admiral-radius-round', (theme) => theme.radius.round)};
  background-color: ${(props) => {
    const { $appearance, $disabled } = props;
    return $appearance === 'flat'
      ? (props.$colorMode === 'colored' && !$disabled ? backgroundPrimary3Rest : backgroundNeutralOpacityRest)(props)
      : 'transparent';
  }};

  border: ${(props) => {
    const { $appearance, $disabled } = props;
    if ($appearance === 'flat') return 'none';
    if ($disabled) {
      return `1px solid ${borderNeutralDisabled(props)}`;
    } else {
      return `1px solid ${(props.$colorMode === 'neutral' ? borderNeutral2Rest : borderPrimary1Rest)(props)}`;
    }
  }};

  &:has(> :first-child:focus-visible) {
    outline: 2px solid ${borderPrimary1Rest};
    outline-offset: 2px;
  }
`;

const chipLayout = css<ChipStyleProps>`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  max-width: 190px;
  min-width: 0;
  user-select: ${(p) => (p.$readOnly ? 'text' : 'none')};
  cursor: default;
  padding-inline: ${(p) =>
    CHIPS_DIMENSION_PARAMETERS[p.$dimension].contentPadding - (p.$appearance === 'outlined' ? 1 : 0)}px;
`;

const chipIconColorReset = css`
  & svg [fill^='#'] {
    fill: currentColor;
  }
`;

const chipFocus = css<ChipStyleProps>`
  &:focus-visible {
    outline: 2px solid ${borderPrimary1Rest};
    outline-offset: 2px;
  }
`;

const chipIcons = css<ChipStyleProps>`
  & svg {
    ${iconHeight}
    ${iconWidth}
    & *[fill^='#'] {
      fill: ${(props) => {
        const { $appearance, $disabled, $colorMode } = props;
        return $disabled
          ? textNeutralDisabledRest(props)
          : $colorMode === 'colored'
            ? textPrimary1Rest(props)
            : $appearance === 'flat'
              ? textNeutral2Rest(props)
              : textNeutral1Rest(props);
      }};
    }
  }
`;

export const ChipStyled = styled.div.attrs<ChipStyleProps & ChipDataAttributes>((props) => ({
  'data-dimension': props.$dimension,
  'data-appearance': props.$appearance,
  'data-color-mode': props.$colorMode,
}))<ChipStyleProps>`
  gap: 2px;

  ${chipLayout}
  ${chipIconColorReset}
  ${colorsBorderAndBackground}
  ${chipHeight}
  ${chipTypography}
  ${chipFocus}
  ${chipIcons}
`;

export const ChipChildrenWrapperStyled = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  min-width: 0;
  padding-inline: 4px;
`;

export const IconsWrapperStyled = styled.span<{ $dimension: ChipDimension }>`
  ${iconHeight}
  & > svg {
    ${iconHeight}
    ${iconWidth}
  }
`;

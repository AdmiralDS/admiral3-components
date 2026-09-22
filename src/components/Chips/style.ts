import styled, { css } from 'styled-components';

import { hoverPressLeaveTransition } from '#src/theme/animation';

import { CHIPS_DIMENSION_PARAMETERS } from './constants';
import { CloseIconPlacementButton } from './IconPlacement';
import type {
  ChipActionsStyleProps,
  ChipColorMode,
  ChipColorsStyleProps,
  ChipDimension,
  ChipDimensionStyleProps,
  ChipTypographyStyleProps,
  StyledChipContentProps,
  StyledChipProps,
} from './types';
import { cssToken } from '../../theme/cssToken';

const textNeutralStaticWhite1 = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
const textNeutral1Rest = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const textNeutral2Rest = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const textNeutralDisabledRest = cssToken(
  '--admiral-color-neutral-text-disable-rest',
  (theme) => theme.color.neutral.text.disable.rest,
);
const textPrimary1Rest = cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest);
const textNeutralInvertedRest = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const textNeutralInvertedDisabled = cssToken(
  '--admiral-color-neutral-text-inverted-disable',
  (theme) => theme.color.neutral.text.inverted.disable,
);
const textNeutralStaticWhite3 = cssToken(
  '--admiral-color-neutral-text-static-white-3',
  (theme) => theme.color.neutral.text.staticWhite._3,
);
const textPrimary1Hover = cssToken(
  '--admiral-color-primary-text-1-hover',
  (theme) => theme.color.primary.text._1.hover,
);
const textNeutral2Hover = cssToken(
  '--admiral-color-neutral-text-2-hover',
  (theme) => theme.color.neutral.text._2.hover,
);
const textPrimary1Press = cssToken(
  '--admiral-color-primary-text-1-press',
  (theme) => theme.color.primary.text._1.press,
);
const textNeutral2Press = cssToken(
  '--admiral-color-neutral-text-2-press',
  (theme) => theme.color.neutral.text._2.press,
);

const backgroundPrimary3Rest = cssToken(
  '--admiral-color-primary-base-3-rest',
  (theme) => theme.color.primary.base._3.rest,
);
const backgroundPrimary3Hover = cssToken(
  '--admiral-color-primary-base-3-hover',
  (theme) => theme.color.primary.base._3.hover,
);
const backgroundPrimary3Press = cssToken(
  '--admiral-color-primary-base-3-press',
  (theme) => theme.color.primary.base._3.press,
);
const borderNeutral2Rest = cssToken(
  '--admiral-color-neutral-stroke-2-rest',
  (theme) => theme.color.neutral.stroke._2.rest,
);
const backgroundPrimary1Rest = cssToken(
  '--admiral-color-primary-base-1-rest',
  (theme) => theme.color.primary.base._1.rest,
);
const backgroundPrimary1Hover = cssToken(
  '--admiral-color-primary-base-1-hover',
  (theme) => theme.color.primary.base._1.hover,
);
const backgroundPrimary1Press = cssToken(
  '--admiral-color-primary-base-1-press',
  (theme) => theme.color.primary.base._1.press,
);
const backgroundNeutralOpacityRest = cssToken(
  '--admiral-color-neutral-base-opacity-rest',
  (theme) => theme.color.neutral.base.opacity.rest,
);
const backgroundNeutralOpacityHover = cssToken(
  '--admiral-color-neutral-base-opacity-hover',
  (theme) => theme.color.neutral.base.opacity.hover,
);
const backgroundNeutralOpacityPress = cssToken(
  '--admiral-color-neutral-base-opacity-press',
  (theme) => theme.color.neutral.base.opacity.press,
);
const backgroundNeutralInvisibleHover = cssToken(
  '--admiral-color-neutral-base-invisible-hover',
  (theme) => theme.color.neutral.base.invisible.hover,
);
const backgroundNeutralInvisiblePress = cssToken(
  '--admiral-color-neutral-base-invisible-press',
  (theme) => theme.color.neutral.base.invisible.press,
);
const borderPrimary1Rest = cssToken(
  '--admiral-color-primary-stroke-1-rest',
  (theme) => theme.color.primary.stroke._1.rest,
);
const borderPrimary1Hover = cssToken(
  '--admiral-color-primary-stroke-1-hover',
  (theme) => theme.color.primary.stroke._1.hover,
);
const borderPrimary1Press = cssToken(
  '--admiral-color-primary-stroke-1-press',
  (theme) => theme.color.primary.stroke._1.press,
);
const borderNeutralDisabled = cssToken(
  '--admiral-color-neutral-stroke-2-rest',
  (theme) => theme.color.neutral.stroke._2.rest,
);
const backgroundNeutralInvertedRest = cssToken(
  '--admiral-color-neutral-base-inverted-rest',
  (theme) => theme.color.neutral.base.inverted.rest,
);
const backgroundNeutralInvertedHover = cssToken(
  '--admiral-color-neutral-base-inverted-hover',
  (theme) => theme.color.neutral.base.inverted.hover,
);
const backgroundNeutralInvertedPress = cssToken(
  '--admiral-color-neutral-base-inverted-press',
  (theme) => theme.color.neutral.base.inverted.press,
);

const heights = css<ChipDimensionStyleProps>`
  height: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].height}px;
`;

const heightIcons = css<ChipDimensionStyleProps>`
  height: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].iconSize}px;
`;

const heightText = css<ChipDimensionStyleProps>`
  height: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].textHeight}px;
`;

const widthIcons = css<ChipDimensionStyleProps>`
  width: ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].iconSize}px;
`;

const chipTypographyHover = css<ChipTypographyStyleProps>`
  &:hover {
    color: ${(props) => {
      const { $colorMode, $selected } = props;
      if ($selected) {
        return ($colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
      }

      if ($colorMode === 'neutral') {
        return textNeutral1Rest(props);
      } else {
        return textPrimary1Rest(props);
      }
    }};
  }
`;

const chipTypography = css<ChipTypographyStyleProps>`
  ${({ $dimension }) => CHIPS_DIMENSION_PARAMETERS[$dimension].typography}
  color: ${(props) => {
    const { $colorMode, $disabled, $selected } = props;
    if ($disabled && !$selected) {
      return textNeutralDisabledRest(props);
    }

    if ($selected) {
      if ($disabled) {
        return ($colorMode === 'neutral' ? textNeutralInvertedDisabled : textNeutralStaticWhite3)(props);
      }
      return ($colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
    }

    return $colorMode === 'neutral' ? textNeutral1Rest(props) : textPrimary1Rest(props);
  }};

  ${({ $disabled }) => !$disabled && chipTypographyHover}
`;

const actionsMixin = css<ChipActionsStyleProps>`
  &:hover {
    ${(props) => {
      const { $appearance, $selected, $withCloseIcon } = props;
      if ($selected) {
        return `background-color: ${(props.$colorMode === 'neutral' ? backgroundNeutralInvertedHover : backgroundPrimary1Hover)(props)};`;
      }
      if ($appearance === 'flat') {
        return `background-color: ${(props.$colorMode === 'colored' ? backgroundPrimary3Hover : backgroundNeutralOpacityHover)(props)};`;
      } else if (!$withCloseIcon) {
        return `background-color: ${backgroundNeutralInvisibleHover(props)};`;
      }
    }};
    ${(p) =>
      p.$selected &&
      `
      border-color: ${(p.$colorMode === 'neutral' ? backgroundNeutralInvertedHover : borderPrimary1Hover)(p)};
    `}
  }
  &:active {
    ${(props) => {
      const { $appearance, $selected, $withCloseIcon } = props;
      if ($selected) {
        return `background-color: ${(props.$colorMode === 'neutral' ? backgroundNeutralInvertedPress : backgroundPrimary1Press)(props)};`;
      }
      if ($appearance === 'flat') {
        return `background-color: ${(props.$colorMode === 'colored' ? backgroundPrimary3Press : backgroundNeutralOpacityPress)(props)};`;
      } else if (!$withCloseIcon) {
        return `background-color: ${backgroundNeutralInvisiblePress(props)};`;
      }
    }};
    ${(p) =>
      p.$selected &&
      `
      border-color: ${(p.$colorMode === 'neutral' ? backgroundNeutralInvertedPress : borderPrimary1Press)(p)};
    `}
  }
`;

const colorsBorderAndBackground = css<ChipColorsStyleProps>`
  transition:
    background-color ${hoverPressLeaveTransition},
    border-color ${hoverPressLeaveTransition};
  border-radius: 16px;
  background-color: ${(props) => {
    const { $appearance, $selected, $disabled } = props;
    if ($selected) {
      return (props.$colorMode === 'neutral' ? backgroundNeutralInvertedRest : backgroundPrimary1Rest)(props);
    }
    return $appearance === 'flat'
      ? (props.$colorMode === 'colored' && !$disabled ? backgroundPrimary3Rest : backgroundNeutralOpacityRest)(props)
      : 'transparent';
  }};

  border: ${(props) => {
    const { $appearance, $disabled } = props;
    if ($appearance === 'flat') return 'none';
    if (props.$selected) {
      return `1px solid ${(props.$colorMode === 'neutral' ? backgroundNeutralInvertedRest : borderPrimary1Rest)(props)}`;
    } else if ($disabled) {
      return `1px solid ${borderNeutralDisabled(props)}`;
    } else {
      return `1px solid ${(props.$colorMode === 'neutral' ? borderNeutral2Rest : borderPrimary1Rest)(props)}`;
    }
  }};

  ${(p) => p.$clickable && !p.$disabled && !p.$readOnly && !p.$withCloseIcon && actionsMixin}

  &:has(> :first-child:focus-visible) {
    outline: 0;

    &:before {
      border: 2px solid ${borderPrimary1Rest};
      border-radius: 20px;
      content: '';
      display: block;
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      pointer-events: none;
    }
  }
`;
export const ChipComponentStyled = styled.div<StyledChipProps>`
  display: inline-flex;
  column-gap: ${({ $withCloseIcon, $readOnly }) => ($withCloseIcon && !$readOnly ? '2px' : '0')};
  align-items: center;
  box-sizing: border-box;
  position: relative;
  max-width: 190px;
  user-select: none;
  cursor: ${({ $defaultChip, $disabled, $withTooltip, $readOnly }) =>
    ($defaultChip || $withTooltip) && !$disabled && !$readOnly ? 'pointer' : $disabled ? 'not-allowed' : 'default'};
  padding-inline: ${(p) =>
    CHIPS_DIMENSION_PARAMETERS[p.$dimension].contentPadding - (p.$appearance === 'outlined' ? 1 : 0)}px;

  & > * {
    pointer-events: ${({ $disabled, $readOnly }) => ($disabled || $readOnly ? 'none' : 'auto')};
  }

  ${colorsBorderAndBackground}
  ${heights}
  ${chipTypography}
`;

const closeIconWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChipContentWrapperStyled = styled.div<StyledChipContentProps>`
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 2px;

  &:focus-visible {
    outline: none;
  }

  ${(p) => p.$withCloseIcon && closeIconWrapperStyle}
  ${(p) => (p.$withCloseIcon ? heights : heightText)}

  & svg {
    ${heightIcons}
    ${widthIcons}
    & *[fill^='#'] {
      fill: ${(props) => {
        const { $appearance, $disabled, $selected } = props;
        if ($selected) {
          if ($disabled) {
            return (props.$colorMode === 'neutral' ? textNeutralInvertedDisabled : textNeutralStaticWhite3)(props);
          }
          return (props.$colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
        }
        return $disabled
          ? textNeutralDisabledRest(props)
          : props.$colorMode === 'colored'
            ? textPrimary1Rest(props)
            : $appearance === 'flat'
              ? textNeutral2Rest(props)
              : textNeutral1Rest(props);
      }};
    }
  }
`;
export const ChipChildrenWrapperStyled = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  padding-inline: 4px;
`;

export const IconsWrapperStyled = styled.span<{ $dimension: ChipDimension }>`
  ${heightIcons}
  & > svg {
    ${heightIcons}
    ${widthIcons}
  }
`;

export const CloseIconButton = styled(CloseIconPlacementButton)<{
  $colorMode: ChipColorMode;
}>`
  color: inherit;
  margin-inline: 0px;
  & svg {
    transition: color ${hoverPressLeaveTransition};
  }
  &:not(:disabled):hover svg {
    color: ${(p) => (p.$colorMode === 'neutral' ? textNeutral2Hover : textPrimary1Hover)(p)};
  }
  &:not(:disabled):active svg {
    color: ${(p) => (p.$colorMode === 'neutral' ? textNeutral2Press : textPrimary1Press)(p)};
  }
`;

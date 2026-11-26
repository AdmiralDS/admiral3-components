import styled, { css } from 'styled-components';

import { cssToken } from '#src/theme/cssToken';

import { Chip } from '../Chip';
import type { ChipAppearance, ChipColorMode } from '../types';

interface SelectableChipStyleProps {
  $selected: boolean;
  appearance: ChipAppearance;
  colorMode: ChipColorMode;
}

const textNeutralStaticWhite1 = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
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

const backgroundPrimary3Hover = cssToken(
  '--admiral-color-primary-base-3-hover',
  (theme) => theme.color.primary.base._3.hover,
);
const backgroundPrimary3Press = cssToken(
  '--admiral-color-primary-base-3-press',
  (theme) => theme.color.primary.base._3.press,
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

const actionsMixin = css<SelectableChipStyleProps>`
  &:hover {
    ${(props) => {
      const { appearance, $selected } = props;
      if ($selected) {
        return `background-color: ${(props.colorMode === 'neutral' ? backgroundNeutralInvertedHover : backgroundPrimary1Hover)(props)};`;
      }
      if (appearance === 'flat') {
        return `background-color: ${(props.colorMode === 'colored' ? backgroundPrimary3Hover : backgroundNeutralOpacityHover)(props)};`;
      } else {
        return `background-color: ${backgroundNeutralInvisibleHover(props)};`;
      }
    }};
    ${(p) =>
      p.$selected &&
      `
      border-color: ${(p.colorMode === 'neutral' ? backgroundNeutralInvertedHover : borderPrimary1Hover)(p)};
    `}
  }
  &:active {
    ${(props) => {
      const { appearance, $selected } = props;
      if ($selected) {
        return `background-color: ${(props.colorMode === 'neutral' ? backgroundNeutralInvertedPress : backgroundPrimary1Press)(props)};`;
      }
      if (appearance === 'flat') {
        return `background-color: ${(props.colorMode === 'colored' ? backgroundPrimary3Press : backgroundNeutralOpacityPress)(props)};`;
      } else {
        return `background-color: ${backgroundNeutralInvisiblePress(props)};`;
      }
    }};
    ${(p) =>
      p.$selected &&
      `
      border-color: ${(p.colorMode === 'neutral' ? backgroundNeutralInvertedPress : borderPrimary1Press)(p)};
    `}
  }
`;

export const SelectableChipStyled = styled(Chip)<SelectableChipStyleProps>`
  cursor: ${(p) => (p.disabled ? 'not-allowed' : p.readOnly ? 'default' : 'pointer')};
  border: ${({ $selected, appearance, colorMode, ...props }) => {
    if ($selected && appearance !== 'flat') {
      return `1px solid ${(colorMode === 'neutral' ? backgroundNeutralInvertedRest : borderPrimary1Rest)(props)}`;
    }
  }};
  color: ${(props) => {
    const { colorMode, disabled, $selected } = props;

    if ($selected) {
      if (disabled) {
        return (colorMode === 'neutral' ? textNeutralInvertedDisabled : textNeutralStaticWhite3)(props);
      }
      return (colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
    }
  }};

  ${(p) => !p.disabled && !p.readOnly && actionsMixin}
  background-color: ${(p) => {
    if (p.$selected) {
      return (p.colorMode === 'neutral' ? backgroundNeutralInvertedRest : backgroundPrimary1Rest)(p);
    }
  }};

  & svg {
    & *[fill^='#'] {
      fill: ${(props) => {
        const { disabled, $selected, colorMode } = props;
        if ($selected) {
          if (disabled) {
            return (colorMode === 'neutral' ? textNeutralInvertedDisabled : textNeutralStaticWhite3)(props);
          }
          return (colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
        }
      }};
    }
  }

  &:hover {
    color: ${(props) => {
      const { colorMode, $selected, disabled } = props;
      if ($selected && !disabled) {
        return (colorMode === 'neutral' ? textNeutralInvertedRest : textNeutralStaticWhite1)(props);
      }
    }};
  }
`;

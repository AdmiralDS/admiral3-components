import { cssToken } from '../../../theme/cssToken';
import type { CssToken } from '../../../theme/cssToken';
import type { ButtonColorMode, ButtonAppearance } from '../types';

type ColorSet =
  | 'background'
  | 'backgroundHover'
  | 'backgroundPress'
  | 'backgroundDisabled'
  | 'color'
  | 'colorDisabled'
  | 'border'
  | 'borderDisabled';
type OutlineColorSet = ColorSet;
type SolidColorSet = Exclude<ColorSet, 'border' | 'borderDisabled'>;
type FlatColorSet = Exclude<ColorSet, 'border' | 'borderDisabled'>;
type GhostColorSet = Exclude<ColorSet, 'border' | 'borderDisabled'>;

/** apperance='solid и colorMode='colored' */
const solidWithColoredMode: Record<SolidColorSet, CssToken> = {
  background: cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest),
  backgroundHover: cssToken('--admiral-color-primary-base-1-hover', (theme) => theme.color.primary.base._1.hover),
  backgroundPress: cssToken('--admiral-color-primary-base-1-press', (theme) => theme.color.primary.base._1.press),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  color: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='solid и colorMode='neutral' */
const solidWithNeutralMode: Record<SolidColorSet, CssToken> = {
  background: cssToken('--admiral-color-neutral-base-inverted-rest', (theme) => theme.color.neutral.base.inverted.rest),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-inverted-hover',
    (theme) => theme.color.neutral.base.inverted.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-inverted-press',
    (theme) => theme.color.neutral.base.inverted.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  color: cssToken('--admiral-color-neutral-text-inverted-rest', (theme) => theme.color.neutral.text.inverted.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='flat и colorMode='colored' */
const flatWithColoredMode: Record<FlatColorSet, CssToken> = {
  background: cssToken('--admiral-color-primary-base-3-rest', (theme) => theme.color.primary.base._3.rest),
  backgroundHover: cssToken('--admiral-color-primary-base-3-hover', (theme) => theme.color.primary.base._3.hover),
  backgroundPress: cssToken('--admiral-color-primary-base-3-press', (theme) => theme.color.primary.base._3.press),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  color: cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='flat и colorMode='neutral' */
const flatWithNeutralMode: Record<FlatColorSet, CssToken> = {
  background: cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-opacity-hover',
    (theme) => theme.color.neutral.base.opacity.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-opacity-press',
    (theme) => theme.color.neutral.base.opacity.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-opacity-rest',
    (theme) => theme.color.neutral.base.opacity.rest,
  ),
  color: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='flat и colorMode='staticWhite' */
const flatWithStaticWhiteMode: Record<FlatColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-opacity-static-rest',
    (theme) => theme.color.neutral.base.opacityStatic.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-opacity-static-hover',
    (theme) => theme.color.neutral.base.opacityStatic.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-opacity-static-press',
    (theme) => theme.color.neutral.base.opacityStatic.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-opacity-static-rest',
    (theme) => theme.color.neutral.base.opacityStatic.rest,
  ),
  color: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-static-white-disable',
    (theme) => theme.color.neutral.text.staticWhite.disable,
  ),
};

/** apperance='outline и colorMode='colored' */
const outlineWithColoredMode: Record<OutlineColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-invisible-hover',
    (theme) => theme.color.neutral.base.invisible.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-invisible-press',
    (theme) => theme.color.neutral.base.invisible.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  border: cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest),
  borderDisabled: cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest),
  color: cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='outline и colorMode='neutral' */
const outlineWithNeutralMode: Record<OutlineColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-invisible-hover',
    (theme) => theme.color.neutral.base.invisible.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-invisible-press',
    (theme) => theme.color.neutral.base.invisible.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  border: cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest),
  borderDisabled: cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest),
  color: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='outline и colorMode='staticWhite' */
const outlineWithStaticWhiteMode: Record<OutlineColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-invisible-static-rest',
    (theme) => theme.color.neutral.base.invisibleStatic.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-invisible-static-hover',
    (theme) => theme.color.neutral.base.invisibleStatic.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-invisible-static-press',
    (theme) => theme.color.neutral.base.invisibleStatic.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-invisible-static-rest',
    (theme) => theme.color.neutral.base.invisibleStatic.rest,
  ),
  border: cssToken(
    '--admiral-color-neutral-stroke-static-white-4',
    (theme) => theme.color.neutral.stroke.staticWhite._4,
  ),
  borderDisabled: cssToken(
    '--admiral-color-neutral-stroke-static-white-4',
    (theme) => theme.color.neutral.stroke.staticWhite._4,
  ),
  color: cssToken('--admiral-color-neutral-text-static-white-1', (theme) => theme.color.neutral.text.staticWhite._1),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-static-white-disable',
    (theme) => theme.color.neutral.text.staticWhite.disable,
  ),
};

/** apperance='ghost и colorMode='colored' */
const ghostWithColoredMode: Record<GhostColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-invisible-hover',
    (theme) => theme.color.neutral.base.invisible.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-invisible-press',
    (theme) => theme.color.neutral.base.invisible.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  color: cssToken('--admiral-color-primary-text-1-rest', (theme) => theme.color.primary.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

/** apperance='ghost и colorMode='neutral' */
const ghostWithNeutralMode: Record<GhostColorSet, CssToken> = {
  background: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  backgroundHover: cssToken(
    '--admiral-color-neutral-base-invisible-hover',
    (theme) => theme.color.neutral.base.invisible.hover,
  ),
  backgroundPress: cssToken(
    '--admiral-color-neutral-base-invisible-press',
    (theme) => theme.color.neutral.base.invisible.press,
  ),
  backgroundDisabled: cssToken(
    '--admiral-color-neutral-base-invisible-rest',
    (theme) => theme.color.neutral.base.invisible.rest,
  ),
  color: cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest),
  colorDisabled: cssToken(
    '--admiral-color-neutral-text-disable-rest',
    (theme) => theme.color.neutral.text.disable.rest,
  ),
};

export const solidColors: Record<ButtonColorMode, Record<SolidColorSet, CssToken>> = {
  colored: solidWithColoredMode,
  neutral: solidWithNeutralMode,
  staticWhite: solidWithColoredMode,
};
export const flatColors: Record<ButtonColorMode, Record<FlatColorSet, CssToken>> = {
  colored: flatWithColoredMode,
  neutral: flatWithNeutralMode,
  staticWhite: flatWithStaticWhiteMode,
};
export const outlineColors: Record<ButtonColorMode, Record<OutlineColorSet, CssToken>> = {
  colored: outlineWithColoredMode,
  neutral: outlineWithNeutralMode,
  staticWhite: outlineWithStaticWhiteMode,
};
export const ghostColors: Record<ButtonColorMode, Record<GhostColorSet, CssToken>> = {
  colored: ghostWithColoredMode,
  neutral: ghostWithNeutralMode,
  staticWhite: ghostWithColoredMode,
};

export const getToken = (apperance: ButtonAppearance): Record<ButtonColorMode, Partial<Record<ColorSet, CssToken>>> => {
  if (apperance === 'flat') return flatColors;
  if (apperance === 'outline') return outlineColors;
  if (apperance === 'ghost') return ghostColors;
  return solidColors;
};

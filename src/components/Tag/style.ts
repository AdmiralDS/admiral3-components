import styled, { css } from 'styled-components';

import type { TagDimension } from '#src/components/Tag';

import { TAG_DIMENSION_PARAMETRS } from './constants';
import type { StyledTagWrapperProps, TagStatus } from './types';
import { hoverPressLeaveTransition } from '../../theme/animation';
import { cssToken } from '../../theme/cssToken';
import type { CssToken } from '../../theme/cssToken';
import { BadgeDot } from '../BadgeDot';

export const tagBackgroundColors: Record<TagStatus, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest),
  info: cssToken('--admiral-color-primary-base-3-rest', (theme) => theme.color.primary.base._3.rest),
  success: cssToken('--admiral-color-success-base-3-rest', (theme) => theme.color.success.base._3.rest),
  error: cssToken('--admiral-color-error-base-3-rest', (theme) => theme.color.error.base._3.rest),
  warning: cssToken('--admiral-color-warning-base-3-rest', (theme) => theme.color.warning.base._3.rest),
  attention: cssToken('--admiral-color-attention-base-3-rest', (theme) => theme.color.attention.base._3.rest),
};

export const tagBackgroundHoverColors: Record<TagStatus, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-base-opacity-hover', (theme) => theme.color.neutral.base.opacity.hover),
  info: cssToken('--admiral-color-primary-base-3-hover', (theme) => theme.color.primary.base._3.hover),
  success: cssToken('--admiral-color-success-base-3-hover', (theme) => theme.color.success.base._3.hover),
  error: cssToken('--admiral-color-error-base-3-hover', (theme) => theme.color.error.base._3.hover),
  warning: cssToken('--admiral-color-warning-base-3-hover', (theme) => theme.color.warning.base._3.hover),
  attention: cssToken('--admiral-color-attention-base-3-hover', (theme) => theme.color.attention.base._3.hover),
};

export const tagBackgroundPressColors: Record<TagStatus, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-base-opacity-press', (theme) => theme.color.neutral.base.opacity.press),
  info: cssToken('--admiral-color-primary-base-3-press', (theme) => theme.color.primary.base._3.press),
  success: cssToken('--admiral-color-success-base-3-press', (theme) => theme.color.success.base._3.press),
  error: cssToken('--admiral-color-error-base-3-press', (theme) => theme.color.error.base._3.press),
  warning: cssToken('--admiral-color-warning-base-3-press', (theme) => theme.color.warning.base._3.press),
  attention: cssToken('--admiral-color-attention-base-3-press', (theme) => theme.color.attention.base._3.press),
};

export const tagBorderColors: Record<TagStatus, CssToken> = {
  neutral: cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest),
  info: cssToken('--admiral-color-primary-stroke-2-rest', (theme) => theme.color.primary.stroke._2.rest),
  success: cssToken('--admiral-color-success-stroke-2-rest', (theme) => theme.color.success.stroke._2.rest),
  error: cssToken('--admiral-color-error-stroke-2-rest', (theme) => theme.color.error.stroke._2.rest),
  warning: cssToken('--admiral-color-warning-stroke-2-rest', (theme) => theme.color.warning.stroke._2.rest),
  attention: cssToken('--admiral-color-attention-stroke-1-rest', (theme) => theme.color.attention.stroke._1.rest),
};

const wrapperBackground = css<StyledTagWrapperProps>`
  background: ${(props) => props.$colorConfig?.backgroundColor?.rest ?? tagBackgroundColors[props.$status](props)};
`;

const wrapperBorder = css<StyledTagWrapperProps>`
  border: 1px solid ${(props) => props.$colorConfig?.borderColor ?? tagBorderColors[props.$status](props)};
`;

const wrapperHover = css<StyledTagWrapperProps>`
  &:hover {
    background: ${(props) =>
      props.$colorConfig?.backgroundColor?.hover ??
      props.$colorConfig?.backgroundColor?.rest ??
      tagBackgroundHoverColors[props.$status](props)};
  }
`;

const wrapperPress = css<StyledTagWrapperProps>`
  &:active {
    background: ${(props) =>
      props.$colorConfig?.backgroundColor?.press ??
      props.$colorConfig?.backgroundColor?.rest ??
      tagBackgroundPressColors[props.$status](props)};
  }
`;

export const Wrapper = styled.button.attrs<
  StyledTagWrapperProps & {
    'data-dimension': TagDimension;
    'data-status': string;
    'data-with-border'?: string;
  }
>((props) => ({
  'data-dimension': props.$dimension,
  'data-status': props.$colorConfig ? 'custom' : props.$status,
  'data-with-border': props.$withBorder ? '' : undefined,
}))<StyledTagWrapperProps>`
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${({ $dimension }) => `
    height: ${TAG_DIMENSION_PARAMETRS[$dimension].height}px;
    padding-block: ${TAG_DIMENSION_PARAMETRS[$dimension].paddingBlock}px;
    padding-inline: ${TAG_DIMENSION_PARAMETRS[$dimension].paddingInline}px;
  `}

  border-radius: ${cssToken('--admiral-radius-small', (theme) => theme.radius.small)};
  ${({ $withBorder }) => ($withBorder ? wrapperBorder : `border: 1px solid transparent;`)}
  ${wrapperBackground}
  transition: background-color ${hoverPressLeaveTransition};

  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  ${(p) => p.$clickable && wrapperHover}
  ${(p) => p.$clickable && wrapperPress}

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid
      ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
  }
`;

export const Text = styled.span<{ $textColor?: string; $dimension: TagDimension }>`
  ${({ $dimension }) => TAG_DIMENSION_PARAMETRS[$dimension].typography}
  color: ${(props) =>
    props.$textColor ??
    cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest)(props)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IconsWrapper = styled.span<{ $dimension: TagDimension }>`
  display: flex;
  flex-shrink: 0;
  width: ${({ $dimension }) => TAG_DIMENSION_PARAMETRS[$dimension].iconSize}px;
  height: ${({ $dimension }) => TAG_DIMENSION_PARAMETRS[$dimension].iconSize}px;

  & > svg {
    color: ${cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest)};
  }
`;

export const StatusDot = styled(BadgeDot)`
  flex-shrink: 0;
`;

import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { css } from 'styled-components';

import type { TagDimension } from '#src/components/Tag';

import { TAG_DIMENSION_PARAMETRS } from './constants';
import type { StyledTagProps, TagStatus } from './types';
import { cssToken } from '../../theme/cssToken';

const wrapperBackground = css<{ $background?: TagStatus | string }>`
  background: ${({ $background }) => {
    switch ($background) {
      case 'primary':
        return cssToken('--admiral-color-primary-base-3-rest', (theme) => theme.color.primary.base._3.rest);
      case 'success':
        return cssToken('--admiral-color-success-base-3-rest', (theme) => theme.color.success.base._3.rest);
      case 'danger':
        return cssToken('--admiral-color-error-base-3-rest', (theme) => theme.color.error.base._3.rest);
      case 'warning':
        return cssToken('--admiral-color-warning-base-3-rest', (theme) => theme.color.warning.base._3.rest);
      case 'attention':
        return cssToken('--admiral-color-attention-base-3-rest', (theme) => theme.color.attention.base._3.rest);
      default:
        return (
          $background ||
          cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest)
        );
    }
  }};
`;

const wrapperBorder = css<{ $border?: TagStatus | string }>`
  border: 1px solid
    ${({ $border }) => {
      switch ($border) {
        case 'info':
          return cssToken('--admiral-color-primary-stroke-2-rest', (theme) => theme.color.primary.stroke._2.rest);
        case 'success':
          return cssToken('--admiral-color-success-stroke-2-rest', (theme) => theme.color.success.stroke._2.rest);
        case 'error':
          return cssToken('--admiral-color-error-stroke-2-rest', (theme) => theme.color.error.stroke._2.rest);
        case 'warning':
          return cssToken('--admiral-color-warning-stroke-2-rest', (theme) => theme.color.warning.stroke._2.rest);
        case 'attention':
          return cssToken('--admiral-color-attention-stroke-1-rest', (theme) => theme.color.attention.stroke._1.rest);
        default:
          return (
            $border || cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest)
          );
      }
    }};
`;

const wrapperHover = css<{ $backgroundHover?: TagStatus | string }>`
  background: ${({ $backgroundHover }) => {
    switch ($backgroundHover) {
      case 'info':
        return cssToken('--admiral-color-primary-base-3-hover', (theme) => theme.color.primary.base._3.hover);
      case 'success':
        return cssToken('--admiral-color-success-base-3-hover', (theme) => theme.color.success.base._3.hover);
      case 'error':
        return cssToken('--admiral-color-error-base-3-hover', (theme) => theme.color.error.base._3.hover);
      case 'warning':
        return cssToken('--admiral-color-warning-base-3-hover', (theme) => theme.color.warning.base._3.hover);
      case 'attention':
        return cssToken('--admiral-color-attention-base-3-hover', (theme) => theme.color.attention.base._3.hover);
      default:
        return (
          $backgroundHover ||
          cssToken('--admiral-color-neutral-base-opacity-hover', (theme) => theme.color.neutral.base.opacity.hover)
        );
    }
  }};
`;

const wrapperPress = css<{ $backgroundPress?: TagStatus | string }>`
  background: ${({ $backgroundPress }) => {
    switch ($backgroundPress) {
      case 'info':
        return cssToken('--admiral-color-primary-base-3-press', (theme) => theme.color.primary.base._3.press);
      case 'success':
        return cssToken('--admiral-color-success-base-3-press', (theme) => theme.color.success.base._3.press);
      case 'error':
        return cssToken('--admiral-color-error-base-3-press', (theme) => theme.color.error.base._3.press);
      case 'warning':
        return cssToken('--admiral-color-warning-base-3-press', (theme) => theme.color.warning.base._3.press);
      case 'attention':
        return cssToken('--admiral-color-attention-base-3-press', (theme) => theme.color.attention.base._3.press);
      default:
        return (
          $backgroundPress ||
          cssToken('--admiral-color-neutral-base-opacity-press', (theme) => theme.color.neutral.base.opacity.press)
        );
    }
  }};
`;

export const Wrapper = styled.button<{
  $dimension: TagDimension;
  $clickable: boolean;
  $border?: TagStatus | string;
  $background?: TagStatus | string;
  $backgroundHover?: TagStatus | string;
  $backgroundPress?: TagStatus | string;
  $withBorder: boolean;
}>`
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  gap: 6px;

  ${({ $dimension }) => `
    height: ${TAG_DIMENSION_PARAMETRS[$dimension].height}px;
    padding-block: ${TAG_DIMENSION_PARAMETRS[$dimension].paddingBlock}px;
    padding-inline: ${TAG_DIMENSION_PARAMETRS[$dimension].paddingInline}px;
  `}

  border-radius: ${cssToken('--admiral-radius-small', (theme) => theme.radius.small)};
  ${({ $withBorder }) => ($withBorder ? wrapperBorder : `border: 1px solid transparent;`)}
  ${wrapperBackground}

  display: inline-flex;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    ${(p) => p.$clickable && wrapperHover}
  }
  &:active {
    ${(p) => p.$clickable && wrapperPress}
  }

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid
      ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
  }
`;

export const Text = styled.span<{ $colorText?: string; $dimension: TagDimension }>`
  color: ${({ $colorText }) =>
    $colorText
      ? $colorText
      : cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(p) => (p.$dimension === 'l' ? textStyles.body.body2Long : textStyles.caption.caption1)}
`;

export const Icon = styled.span<StyledTagProps>`
  display: flex;
  flex-shrink: 0;
  width: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  height: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};

  & > svg {
    color: ${cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest)};
  }
`;

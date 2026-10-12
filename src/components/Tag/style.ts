import styled, { css } from 'styled-components';
import { typography } from '#src/components/Typography';
import type { TagKind, TagDimension } from '#src/components/Tag';
import { cssToken } from '../../theme/cssToken';

const wrapperBackground = css<{ $background: TagKind | string }>`
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
      case 'neutral':
        return cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest);
      default:
        return (
          $background ||
          cssToken('--admiral-color-neutral-base-opacity-rest', (theme) => theme.color.neutral.base.opacity.rest)
        );
    }
  }};
`;

const wrapperBorder = css<{ $border: TagKind | string }>`
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
        case 'neutral':
          return cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest);
        default:
          return (
            $border || cssToken('--admiral-color-neutral-stroke-2-rest', (theme) => theme.color.neutral.stroke._2.rest)
          );
      }
    }};
`;

const wrapperHover = css<{ $backgroundHover: TagKind | string }>`
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
      case 'neutral':
        return cssToken(
          '--admiral-color-neutral-base-opacity-hover',
          (theme) => theme.color.neutral.base.opacity.hover,
        );
      default:
        return (
          $backgroundHover ||
          cssToken('--admiral-color-neutral-base-opacity-hover', (theme) => theme.color.neutral.base.opacity.hover)
        );
    }
  }};
`;

const wrapperPress = css<{ $backgroundHover: TagKind | string }>`
  background: ${({ $backgroundHover }) => {
    switch ($backgroundHover) {
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
      case 'neutral':
        return cssToken(
          '--admiral-color-neutral-base-opacity-press',
          (theme) => theme.color.neutral.base.opacity.press,
        );
      default:
        return (
          $backgroundHover ||
          cssToken('--admiral-color-neutral-base-opacity-press', (theme) => theme.color.neutral.base.opacity.press)
        );
    }
  }};
`;

export const Wrapper = styled.button<{
  $dimension?: TagDimension;
  $width?: number | string;
  $clickable: boolean;
  $statusViaBackground?: boolean;
  $border: TagKind | string;
  $background: TagKind | string;
  $backgroundHover: TagKind | string;
}>`
  position: relative;
  box-sizing: border-box;
  max-width: 100%;

  ${({ $dimension }) => `
    height: ${$dimension === 's' ? TAG_HEIGHT_S : TAG_HEIGHT_M}px;
    padding: ${$dimension === 's' ? TAG_PADDING_TOP_S : TAG_PADDING_TOP_M}px ${
      $dimension === 's' ? TAG_PADDING_LEFT_S : TAG_PADDING_LEFT_M
    }px;
  `}

  ${({ $width }) => $width && `width: ${typeof $width === 'number' ? `${$width}px` : $width};`}
  border-radius: ${cssToken('--admiral-radius-medium', (theme) => theme.radius.medium)};
  ${({ $statusViaBackground, theme }) =>
    $statusViaBackground
      ? wrapperBackground
      : `background: var(--admiral-color-Opacity_Neutral8, ${theme.color['Opacity/Neutral 8']});`}
  ${({ $statusViaBackground }) => ($statusViaBackground ? wrapperBorder : `border: 1px solid transparent;`)}

  display: inline-flex;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover,
  &:active {
    ${({ $statusViaBackground, $clickable }) =>
      $clickable && !$statusViaBackground ? `border: 1px solid transparent;` : ''}
    ${({ $statusViaBackground, theme, $clickable }) =>
      $clickable
        ? $statusViaBackground
          ? wrapperHover
          : `background: var(--admiral-color-Opacity_Neutral12, ${theme.color['Opacity/Neutral 12']});`
        : ''}
  }

  &:focus-visible {
    outline-offset: 2px;
    outline: 2px solid
      ${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)};
  }
`;

export const Text = styled.span`
  color: var(--admiral-color-Neutral_Neutral90, ${(p) => p.theme.color['Neutral/Neutral 90']});
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${typography['Caption/Caption 1']}
`;

export const TagCircle = styled.div<{ $background: TagKind | string }>`
  display: flex;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  ${circleBackground}
`;

export const Icon = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-right: 4px;

  & *[fill^='#'] {
    fill: var(--admiral-color-Neutral_Neutral50, ${(p) => p.theme.color['Neutral/Neutral 50']});
  }
`;

export const StatusIcon = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-left: 4px;

  & *[fill^='#'] {
    fill: var(--admiral-color-Neutral_Neutral50, ${(p) => p.theme.color['Neutral/Neutral 50']});
  }

  &:hover {
    & *[fill^='#'] {
      fill: var(--admiral-color-Neutral_Neutral50, ${(p) => p.theme.color['Neutral/Neutral 50']});
    }
  }
`;

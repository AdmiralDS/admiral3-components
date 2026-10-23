import { useId } from 'react';

import styled from 'styled-components';

import { cssToken, type CssToken } from '#src/theme/cssToken';

import { AVATAR_DIMENSION_PARAMETERS } from './constants';
import type { AvatarStatus, AvatarSVGProps } from './types';

const RoundedImage = styled.image`
  clip-path: circle();
`;

export const AvatarSVG: React.FC<AvatarSVGProps> = ({
  dimension = 'xl',
  hasImage,
  href,
  status: statusProp,
  // size,
  appearance,
  withActivityRing = false,
  showActivityRing = false,
}) => {
  const presetId = useId();
  const id = `url(#${presetId})`;

  const backgroundColor =
    typeof appearance === 'object'
      ? appearance.backgroundColor
      : `${cssToken('--admiral-color-neutral-base-3-rest', (theme) => theme.color.neutral.base._3.rest)}`;

  const { size, statusSize } = AVATAR_DIMENSION_PARAMETERS[dimension];

  const inset = withActivityRing ? 4 : 0;
  const totalSize = size + inset * 2;
  const center = totalSize / 2;
  const radius = size / 2;
  const ringRadius = center - 1;
  const statusRadius = statusSize / 2;
  const statusRadiusMask = statusRadius + 2;
  const statusCenter = inset + size - statusRadius;
  const viewBox = `0 0 ${totalSize} ${totalSize}`;

  const statusColors: Record<AvatarStatus, CssToken> = {
    neutral: cssToken('--admiral-color-neutral-base-4-rest', (theme) => theme.color.neutral.base._4.rest),
    success: cssToken('--admiral-color-success-base-1-rest', (theme) => theme.color.success.base._1.rest),
    error: cssToken('--admiral-color-error-base-1-rest', (theme) => theme.color.error.base._1.rest),
    attention: cssToken('--admiral-color-attention-base-1-rest', (theme) => theme.color.attention.base._1.rest),
  };

  const customStatus = typeof statusProp === `object`;
  const status = statusProp ? (customStatus ? statusProp.backgroundColor : statusColors[statusProp]) : '';

  return (
    <svg
      viewBox={viewBox}
      width={totalSize}
      height={totalSize}
      style={{ transform: 'rotate(.00001deg)' }} /* hack to force anti-aliasing in IE */
    >
      <defs>
        <mask id={presetId}>
          {withActivityRing && showActivityRing && (
            <circle id="ring" cx={radius} cy={radius} r={ringRadius} strokeWidth="2" stroke="white" fill="white" />
          )}
          <circle id="outer" cx={radius} cy={radius} r={center} strokeWidth="0" stroke="white" fill="white" />
          {status && (
            <ellipse
              id="inner"
              vectorEffect="non-scaling-stroke"
              cx={statusCenter}
              cy={statusCenter}
              rx={statusRadiusMask}
              ry={statusRadiusMask}
              fill="black"
            />
          )}
        </mask>
      </defs>
      {hasImage && (
        <RoundedImage
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid slice"
          mask={id}
          href={href}
          x={`${inset}px`}
          y={`${inset}px`}
        />
      )}
      {!hasImage && (
        <circle
          id="outer"
          cx={radius}
          cy={radius}
          r={center}
          strokeWidth="0"
          stroke={backgroundColor}
          fill={backgroundColor}
          mask={id}
        />
      )}
      {withActivityRing && showActivityRing && (
        <circle
          id="ring"
          cx={radius}
          cy={radius}
          r={ringRadius}
          strokeWidth="2"
          stroke={`${cssToken('--admiral-color-primary-stroke-1-rest', (theme) => theme.color.primary.stroke._1.rest)}`}
          fill="none"
          mask={id}
        />
      )}
      {status && (
        <ellipse
          style={{ fill: status, strokeWidth: 0, strokeOpacity: 0 }}
          vectorEffect="non-scaling-stroke"
          cx={statusCenter}
          cy={statusCenter}
          rx={statusRadius}
          ry={statusRadius}
        />
      )}
    </svg>
  );
};

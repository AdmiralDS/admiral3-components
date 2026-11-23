import { useId } from 'react';

import { AVATAR_DIMENSION_PARAMETERS } from './constants';
import { RoundedImage, StyledAvatarSVG } from './style';
import type { AvatarSVGProps } from './types';

export const AvatarSVG: React.FC<AvatarSVGProps> = ({
  dimension = 'xl',
  hasImage,
  href,
  status,
  appearance,
  withActivityRing = false,
  showActivityRing = false,
}) => {
  const presetId = useId();
  const id = `url(#${presetId})`;
  const hasStatus = typeof status === 'object' ? Boolean(status.backgroundColor) : Boolean(status);

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

  return (
    <StyledAvatarSVG
      viewBox={viewBox}
      width={totalSize}
      height={totalSize}
      aria-hidden="true"
      focusable="false"
      $appearance={appearance}
      $status={status}
    >
      <defs>
        <mask id={presetId}>
          {withActivityRing && showActivityRing && (
            <circle cx={center} cy={center} r={ringRadius} strokeWidth="2" stroke="white" fill="white" />
          )}
          <circle cx={center} cy={center} r={radius} strokeWidth="0" stroke="white" fill="white" />
          {hasStatus && (
            <ellipse
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
          cx={center}
          cy={center}
          r={radius}
          strokeWidth="0"
          stroke="var(--admiral-avatar-background-color)"
          fill="var(--admiral-avatar-background-color)"
          mask={id}
        />
      )}
      {withActivityRing && showActivityRing && (
        <circle
          cx={center}
          cy={center}
          r={ringRadius}
          strokeWidth="2"
          stroke="var(--admiral-avatar-ring-color)"
          fill="none"
          mask={id}
        />
      )}
      {hasStatus && (
        <ellipse
          fill="var(--admiral-avatar-status-color)"
          vectorEffect="non-scaling-stroke"
          cx={statusCenter}
          cy={statusCenter}
          rx={statusRadius}
          ry={statusRadius}
        />
      )}
    </StyledAvatarSVG>
  );
};

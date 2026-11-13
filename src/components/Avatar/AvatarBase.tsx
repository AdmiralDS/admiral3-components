import { forwardRef } from 'react';

import { withTooltip } from '#src/components/Tooltip';
import { hasSlotContent } from '#src/utils/hasSlotContent';

import { AvatarSVG } from './Avatar_SVG';
import { Wrapper, Text, IconWrapper } from './style';
import type { AvatarBaseProps } from './types';
import { useLoaded } from './useLoaded';

const DEFAULT_APPEARANCE = 'primary';
const WrapperWithTooltip = withTooltip(Wrapper);

export const AvatarBase = forwardRef<HTMLButtonElement, AvatarBaseProps>(
  (
    {
      userName,
      userInitials,
      href,
      status,
      dimension = 'm',
      icon,
      appearance = DEFAULT_APPEARANCE,
      showTooltip = true,
      withActivityRing = false,
      showActivityRing = false,
      onClick,
      tabIndex,
      ...props
    }: AvatarBaseProps,
    ref,
  ) => {
    const avatarDimension =
      (dimension === 'xxs' || dimension === 'xxxs') && (status || withActivityRing) ? 'xs' : dimension;

    const maxAbbrLength = avatarDimension === 'xs' || avatarDimension === 'xxs' || avatarDimension === 'xxxs' ? 1 : 2;
    const defaultUserInitials = userName
      ?.split(' ')
      .map((word) => word.toUpperCase()[0])
      .join('')
      .slice(0, maxAbbrLength);
    const initials = userInitials ? userInitials : defaultUserInitials;
    const abbr = initials;

    const active = !!onClick;
    const customStatus = typeof status === 'object';
    const presetStatus = customStatus ? undefined : status;
    const statusColorConfig = customStatus ? status : undefined;

    const customAppearance = typeof appearance === `object`;
    // const presetAppearance = customAppearance ? 'neutral' : appearance;
    const colorAppearanceConfig = customAppearance ? appearance : undefined;
    const resolvedTabIndex = tabIndex ?? (active ? 0 : -1);

    const textColor = colorAppearanceConfig?.textColor;
    const loaded = useLoaded(href);
    const hasImage = Boolean(href && loaded === 'loaded');
    const hasIcon = hasSlotContent(icon) && !hasImage;
    const hasAbbr = !hasImage && !hasIcon;

    const renderAvatarContent = () => (
      <>
        <AvatarSVG
          dimension={avatarDimension}
          hasImage={hasImage}
          href={href}
          status={status}
          appearance={appearance}
          withActivityRing={withActivityRing}
          showActivityRing={showActivityRing}
        />
        {hasAbbr && (
          <Text $dimension={avatarDimension} $textColor={textColor}>
            {abbr}
          </Text>
        )}
        {hasIcon && <IconWrapper $dimension={avatarDimension}>{icon}</IconWrapper>}
      </>
    );

    return (
      <WrapperWithTooltip
        type="button"
        aria-label={userName}
        ref={ref}
        $dimension={avatarDimension}
        $status={presetStatus}
        $statusColorConfig={statusColorConfig}
        $clickable={active}
        $withActivityRing={withActivityRing}
        tabIndex={resolvedTabIndex}
        onClick={onClick}
        {...props}
        renderContent={() => (showTooltip ? userName : null)}
      >
        {renderAvatarContent()}
      </WrapperWithTooltip>
    );
  },
);

AvatarBase.displayName = 'AvatarBase';

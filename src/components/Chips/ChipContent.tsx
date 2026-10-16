import { useMemo, type ReactNode, type Ref } from 'react';

import { Badge, type BadgeAppearance } from '#src/components/Badge';
import { hasSlotContent } from '#src/utils/hasSlotContent';

import { ChipChildrenWrapperStyled, IconsWrapperStyled } from './style';
import type { ChipColorMode, ChipDimension } from './types';

interface ChipContentProps {
  children: ReactNode;
  iconsBefore?: ReactNode;
  avatar?: ReactNode;
  badge?: number;
  dimension: ChipDimension;
  colorMode: ChipColorMode;
  selected?: boolean;
  disabled?: boolean;
  contentRef: Ref<HTMLSpanElement>;
}

export const ChipContent = ({
  children,
  iconsBefore,
  avatar,
  badge,
  dimension,
  colorMode,
  selected,
  disabled,
  contentRef,
}: ChipContentProps) => {
  const badgeAppearance: BadgeAppearance = useMemo(() => {
    if (selected && !disabled) return colorMode === 'neutral' ? 'neutral1' : 'whiteStatic';
    if (disabled) {
      if (selected) return 'neutral1Disable';
      return 'neutral2Disable';
    }
    if (colorMode === 'neutral') return 'neutral3';
    return 'info';
  }, [colorMode, selected, disabled]);

  return (
    <>
      {hasSlotContent(iconsBefore) && (
        <IconsWrapperStyled aria-hidden $dimension={dimension}>
          {iconsBefore}
        </IconsWrapperStyled>
      )}
      {hasSlotContent(avatar) && <IconsWrapperStyled $dimension={dimension}>{avatar}</IconsWrapperStyled>}
      <ChipChildrenWrapperStyled ref={contentRef}>{children}</ChipChildrenWrapperStyled>
      {badge !== undefined && (
        <Badge data-badge dimension="s" appearance={badgeAppearance}>
          {badge}
        </Badge>
      )}
    </>
  );
};

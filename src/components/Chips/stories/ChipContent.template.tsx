import { DocumentsCopyOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_DIMENSION_PARAMETERS } from '../constants';

const Avatar = styled.span<{ $dimension: NonNullable<ChipBaseProps['dimension']> }>`
  display: block;
  width: ${(p) => CHIPS_DIMENSION_PARAMETERS[p.$dimension].iconSize}px;
  height: 100%;
  border-radius: 50%;
  background-color: var(--admiral-color-primary-base-1-rest);
`;

export const ChipContentTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар и бейдж.</StoryDemoDescription>
    <Chip
      {...args}
      iconsBefore={<SystemSearchOutline />}
      iconsAfter={<DocumentsCopyOutline />}
      avatar={<Avatar $dimension={args.dimension ?? 'm'} aria-hidden />}
      badge={5}
    />
  </StoryDemoContainer>
);

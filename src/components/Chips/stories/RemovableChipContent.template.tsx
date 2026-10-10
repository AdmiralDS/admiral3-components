import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

// TODO Заменить на компонент Avatar после его реализации.
const Avatar = styled.div<{ $dimension: RemovableChipProps['dimension'] }>`
  background-color: red;
  width: ${(p) => (p.$dimension === 'l' ? '20px' : '16px')};
  height: 100%;
  border-radius: 50%;
`;

export const RemovableChipContentTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Иконки, аватар, бейдж.</StoryDemoDescription>
    <RemovableChip
      {...args}
      iconsBefore={<SystemSearchOutline />}
      avatar={<Avatar $dimension={args.dimension} />}
      badge={5}
    >
      Chip
    </RemovableChip>
  </StoryDemoContainer>
);

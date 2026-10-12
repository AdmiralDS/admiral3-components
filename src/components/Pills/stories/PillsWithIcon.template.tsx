import { SystemStarSolid } from '@admiral-ds/admiral3-icons';

import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const PillsWithIconTemplate = (args: PillProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        Декоративная иконка скрыта от скринридера, потому что статус уже выражен текстом. Иконки наследуют цвет Pills.
      </StoryDemoDescription>
      <Pill {...args}>
        <SystemStarSolid aria-hidden="true" focusable="false" />
        {args.children}
      </Pill>
    </StoryDemoContainer>
  );
};

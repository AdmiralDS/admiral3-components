import { Pill, type PillProps } from '@admiral-ds/admiral3-components';

import { StoryDirtyContainer } from '../../stories/StoryContainers';
import { PILLS_APPEARANCES } from '../constants';

export const PillsDirtyTemplate = (args: PillProps) => {
  return (
    <StoryDirtyContainer>
      {PILLS_APPEARANCES.map((appearance) => (
        <Pill key={appearance} {...args} appearance={appearance}>
          {appearance}
        </Pill>
      ))}
    </StoryDirtyContainer>
  );
};

import { Chip, type ChipBaseProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES } from '../constants';

export const ChipAppearancesTemplate = (args: ChipBaseProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Вариант flat использует заливку, а outlined использует обводку. Оба варианта доступны в режимах colored и neutral.
    </StoryDemoDescription>
    {CHIPS_APPEARANCES.flatMap((appearance) =>
      CHIPS_COLOR_MODES.map((colorMode) => (
        <Chip key={appearance + colorMode} {...args} appearance={appearance} colorMode={colorMode}>
          {appearance} / {colorMode}
        </Chip>
      )),
    )}
  </StoryDemoContainer>
);

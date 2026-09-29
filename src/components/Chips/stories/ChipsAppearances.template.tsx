import { Chips, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES } from '../constants';

export const ChipsAppearancesTemplate = (args: ChipsProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Варианты flat и outlined в цветном и нейтральном режимах.</StoryDemoDescription>
    {CHIPS_APPEARANCES.flatMap((appearance) =>
      CHIPS_COLOR_MODES.map((colorMode) => (
        <Chips key={appearance + colorMode} {...args} appearance={appearance} colorMode={colorMode}>
          {appearance} / {colorMode}
        </Chips>
      )),
    )}
  </StoryDemoContainer>
);

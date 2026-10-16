import { RemovableChip, type RemovableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES } from '../constants';

export const RemovableChipAppearancesTemplate = (args: RemovableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Вариант flat использует заливку, а outlined — обводку. Оба варианта доступны в цветном режиме colored и
      нейтральном neutral.
    </StoryDemoDescription>
    {CHIPS_APPEARANCES.flatMap((appearance) =>
      CHIPS_COLOR_MODES.map((colorMode) => (
        <RemovableChip key={appearance + colorMode} {...args} appearance={appearance} colorMode={colorMode}>
          {appearance} / {colorMode}
        </RemovableChip>
      )),
    )}
  </StoryDemoContainer>
);

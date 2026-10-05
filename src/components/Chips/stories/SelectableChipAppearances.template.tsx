import { SelectableChip, type SelectableChipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES } from '../constants';

export const SelectableChipAppearancesTemplate = (args: SelectableChipProps) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>
      Вариант flat использует заливку, а outlined — обводку. Оба варианта доступны в цветном режиме colored и
      нейтральном neutral.
    </StoryDemoDescription>
    {CHIPS_APPEARANCES.flatMap((appearance) =>
      CHIPS_COLOR_MODES.map((colorMode) => (
        <SelectableChip key={appearance + colorMode} {...args} appearance={appearance} colorMode={colorMode}>
          {appearance} / {colorMode}
        </SelectableChip>
      )),
    )}
  </StoryDemoContainer>
);

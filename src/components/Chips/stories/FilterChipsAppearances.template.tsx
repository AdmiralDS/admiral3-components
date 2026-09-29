import { Fragment } from 'react';

import { FilterChips, type FilterChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES } from '../constants';

export const FilterChipsAppearancesTemplate = ({ dimension }: Pick<FilterChipsProps, 'dimension'>) => (
  <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
    <StoryDemoDescription>Все сочетания appearance и colorMode для FilterChips.Item.</StoryDemoDescription>
    {CHIPS_APPEARANCES.flatMap((appearance) =>
      CHIPS_COLOR_MODES.map((colorMode) => (
        <Fragment key={`${appearance}-${colorMode}`}>
          <StoryDemoDescription>
            {appearance} / {colorMode}
          </StoryDemoDescription>
          <FilterChips aria-label={`Чипсы ${appearance}, ${colorMode}`} dimension={dimension}>
            <FilterChips.Item appearance={appearance} colorMode={colorMode}>
              Марс
            </FilterChips.Item>
            <FilterChips.Item appearance={appearance} colorMode={colorMode}>
              Венера
            </FilterChips.Item>
          </FilterChips>
        </Fragment>
      )),
    )}
  </StoryDemoContainer>
);

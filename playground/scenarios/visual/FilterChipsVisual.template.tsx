import { FilterChips, type FilterChipsItemProps } from '@admiral-ds/admiral3-components';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import { CHIPS_APPEARANCES, CHIPS_COLOR_MODES, CHIPS_DIMENSIONS } from '../../../src/components/Chips/constants';

const PLANETS = [
  { id: 'mars', label: 'Марс' },
  { id: 'venus', label: 'Венера' },
  { id: 'jupiter', label: 'Юпитер' },
] as const;

type ItemVisualProps = Pick<FilterChipsItemProps, 'appearance' | 'colorMode' | 'readOnly'>;

const renderItems = (props: ItemVisualProps) =>
  PLANETS.map(({ id, label }) => (
    <FilterChips.Item key={id} id={id} {...props}>
      {label}
    </FilterChips.Item>
  ));

export const FilterChipsVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      <VisualGroups>
        {CHIPS_DIMENSIONS.map((dimension) => (
          <VisualGroup key={dimension}>
            <VisualGroupTitle>{dimension}</VisualGroupTitle>
            <VisualSamples>
              {CHIPS_APPEARANCES.flatMap((appearance) =>
                CHIPS_COLOR_MODES.map((colorMode) => (
                  <VisualSample key={`${appearance}-${colorMode}`}>
                    <VisualLabel>{`${appearance} / ${colorMode}`}</VisualLabel>
                    <FilterChips dimension={dimension} value={['venus']}>
                      {renderItems({ appearance, colorMode })}
                    </FilterChips>
                  </VisualSample>
                )),
              )}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>Multiple selection</VisualGroupTitle>
          <VisualSamples>
            {[
              { label: 'none selected', value: [] },
              { label: 'one selected', value: ['venus'] },
              { label: 'all selected', value: ['mars', 'venus', 'jupiter'] },
            ].map(({ label, value }) => (
              <VisualSample key={label}>
                <VisualLabel>{label}</VisualLabel>
                <FilterChips value={value}>{renderItems({ appearance: 'flat', colorMode: 'colored' })}</FilterChips>
              </VisualSample>
            ))}
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Exclusive selection</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <VisualLabel>none selected</VisualLabel>
              <FilterChips exclusive value={null}>
                {renderItems({ appearance: 'outlined', colorMode: 'neutral' })}
              </FilterChips>
            </VisualSample>
            <VisualSample>
              <VisualLabel>one selected</VisualLabel>
              <FilterChips exclusive value="venus">
                {renderItems({ appearance: 'outlined', colorMode: 'neutral' })}
              </FilterChips>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Disabled and read-only</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <VisualLabel>disabled</VisualLabel>
              <FilterChips disabled value={['venus']}>
                {renderItems({ appearance: 'flat', colorMode: 'neutral' })}
              </FilterChips>
            </VisualSample>
            <VisualSample>
              <VisualLabel>read-only</VisualLabel>
              <FilterChips value={['venus']}>
                {renderItems({ appearance: 'flat', colorMode: 'neutral', readOnly: true })}
              </FilterChips>
            </VisualSample>
            <VisualSample>
              <VisualLabel>custom gap</VisualLabel>
              <FilterChips gap={24} value={['venus']}>
                {renderItems({ appearance: 'flat', colorMode: 'neutral' })}
              </FilterChips>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

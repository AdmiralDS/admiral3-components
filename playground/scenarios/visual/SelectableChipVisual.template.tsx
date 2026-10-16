import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { SelectableChip } from '@admiral-ds/admiral3-components';

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

export const SelectableChipVisualTemplate = () => (
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
                    <SelectableChip dimension={dimension} appearance={appearance} colorMode={colorMode}>
                      SelectableChip
                    </SelectableChip>
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
        {CHIPS_APPEARANCES.flatMap((appearance) =>
          CHIPS_COLOR_MODES.map((colorMode) => (
            <VisualGroup key={`${appearance}-${colorMode}`}>
              <VisualGroupTitle>{`${appearance} / ${colorMode}`}</VisualGroupTitle>
              <VisualSamples>
                <VisualSample>
                  <VisualLabel>default</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`default-${appearance}-${colorMode}`}
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>selected</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`selected-${appearance}-${colorMode}`}
                    selected
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>disabled</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`disabled-${appearance}-${colorMode}`}
                    disabled
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>selected disabled</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`selected-disabled-${appearance}-${colorMode}`}
                    selected
                    disabled
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>read-only</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`read-only-${appearance}-${colorMode}`}
                    readOnly
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>selected read-only</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`selected-read-only-${appearance}-${colorMode}`}
                    selected
                    readOnly
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>badge</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`badge-${appearance}-${colorMode}`}
                    badge={5}
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>selected disabled content</VisualLabel>
                  <SelectableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`selected-disabled-content-${appearance}-${colorMode}`}
                    selected
                    disabled
                    badge={0}
                    iconsBefore={<SystemSearchOutline />}
                  >
                    SelectableChip
                  </SelectableChip>
                </VisualSample>
              </VisualSamples>
            </VisualGroup>
          )),
        )}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

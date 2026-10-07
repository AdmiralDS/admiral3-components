import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { RemovableChip } from '@admiral-ds/admiral3-components';

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

export const RemovableChipVisualTemplate = () => (
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
                    <RemovableChip
                      dimension={dimension}
                      appearance={appearance}
                      colorMode={colorMode}
                      onClose={() => undefined}
                      closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                    >
                      RemovableChip
                    </RemovableChip>
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
                  <RemovableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`default-${appearance}-${colorMode}`}
                    onClose={() => undefined}
                    closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                  >
                    RemovableChip
                  </RemovableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>disabled</VisualLabel>
                  <RemovableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`disabled-${appearance}-${colorMode}`}
                    onClose={() => undefined}
                    closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                    disabled
                  >
                    RemovableChip
                  </RemovableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>read-only</VisualLabel>
                  <RemovableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`read-only-${appearance}-${colorMode}`}
                    onClose={() => undefined}
                    closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                    readOnly
                  >
                    RemovableChip
                  </RemovableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>badge</VisualLabel>
                  <RemovableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`badge-${appearance}-${colorMode}`}
                    onClose={() => undefined}
                    closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                    badge={5}
                  >
                    RemovableChip
                  </RemovableChip>
                </VisualSample>
                <VisualSample>
                  <VisualLabel>disabled content</VisualLabel>
                  <RemovableChip
                    appearance={appearance}
                    colorMode={colorMode}
                    data-testid={`disabled-content-${appearance}-${colorMode}`}
                    onClose={() => undefined}
                    closeButtonProps={{ 'aria-label': 'Удалить чипс' }}
                    disabled
                    badge={0}
                    iconsBefore={<SystemSearchOutline />}
                  >
                    RemovableChip
                  </RemovableChip>
                </VisualSample>
              </VisualSamples>
            </VisualGroup>
          )),
        )}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

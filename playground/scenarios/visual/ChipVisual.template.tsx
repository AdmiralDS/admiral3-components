import { DocumentsCopyOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { Chip } from '@admiral-ds/admiral3-components';

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

const states = [
  { label: 'default', props: { children: 'Chip' } },
  { label: 'disabled', props: { children: 'Chip', disabled: true } },
  { label: 'read-only', props: { children: 'Chip', readOnly: true } },
  { label: 'badge', props: { children: 'Chip', badge: 5 } },
  {
    label: 'icons and badge',
    props: { children: 'Chip', iconsBefore: <SystemSearchOutline />, iconsAfter: <DocumentsCopyOutline />, badge: 0 },
  },
  {
    label: 'disabled with content',
    props: { children: 'Chip', disabled: true, iconsBefore: <SystemSearchOutline />, badge: 5 },
  },
  { label: 'truncated text', props: { children: 'A long chip label that does not fit on one line' } },
];

export const ChipVisualTemplate = () => (
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
                    <Chip dimension={dimension} appearance={appearance} colorMode={colorMode}>
                      Chip
                    </Chip>
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
                {states.map(({ label, props }) => (
                  <VisualSample key={label}>
                    <VisualLabel>{label}</VisualLabel>
                    <Chip appearance={appearance} colorMode={colorMode} {...props} />
                  </VisualSample>
                ))}
              </VisualSamples>
            </VisualGroup>
          )),
        )}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

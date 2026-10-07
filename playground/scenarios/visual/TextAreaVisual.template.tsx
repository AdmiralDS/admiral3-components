import type { ComponentProps, ReactNode } from 'react';

import { cornerRadiusOptions } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { TextArea, type TextAreaAppearance, type TextAreaDimension } from '@admiral-ds/admiral3-components';

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
import { TEXT_AREA_APPEARANCES, TEXT_AREA_DIMENSIONS } from '../../../src/components/TextArea/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof TextArea>;
};

type CompositionVariant = {
  label: string;
  render: (appearance: TextAreaAppearance, dimension: TextAreaDimension) => ReactNode;
};

const RadiusSample = styled(VisualSample)`
  width: 200px;
`;

const STATES: VisualVariant[] = [
  { label: 'empty', props: {} },
  { label: 'filled', props: { defaultValue: 'TextArea value\nSecond line' } },
  { label: 'filled with clear icon', props: { defaultValue: 'TextArea value\nSecond line', showClearIcon: true } },
  { label: 'filled with copy icon', props: { defaultValue: 'TextArea value\nSecond line', showCopyIcon: true } },
  { label: 'disabled empty', props: { disabled: true } },
  { label: 'disabled filled', props: { defaultValue: 'TextArea value\nSecond line', disabled: true } },
  { label: 'readOnly empty', props: { readOnly: true } },
  { label: 'readOnly filled', props: { defaultValue: 'TextArea value\nSecond line', readOnly: true } },
  { label: 'error empty', props: { status: 'error' } },
  { label: 'error filled', props: { defaultValue: 'TextArea value\nSecond line', status: 'error' } },
  { label: 'success empty', props: { status: 'success' } },
  { label: 'success filled', props: { defaultValue: 'TextArea value\nSecond line', status: 'success' } },
  { label: 'disabled error', props: { defaultValue: 'TextArea value\nSecond line', disabled: true, status: 'error' } },
  {
    label: 'disabled success',
    props: { defaultValue: 'TextArea value\nSecond line', disabled: true, status: 'success' },
  },
  { label: 'readOnly error', props: { defaultValue: 'TextArea value\nSecond line', readOnly: true, status: 'error' } },
  {
    label: 'readOnly success',
    props: { defaultValue: 'TextArea value\nSecond line', readOnly: true, status: 'success' },
  },
];

const COMPOSITIONS: CompositionVariant[] = [
  {
    label: 'resize',
    render: (appearance, dimension) => (
      <TextArea
        aria-label="Resize"
        appearance={appearance}
        dimension={dimension}
        defaultValue={'TextArea value\nSecond line'}
        resize
        minRows={2}
        maxRows={5}
      />
    ),
  },
  {
    label: 'autoHeight',
    render: (appearance, dimension) => (
      <TextArea
        aria-label="Auto height"
        appearance={appearance}
        dimension={dimension}
        defaultValue={'One\nTwo\nThree'}
        autoHeight
        minRows={2}
        maxRows={4}
      />
    ),
  },
  {
    label: 'autoHeight with overflow',
    render: (appearance, dimension) => (
      <TextArea
        aria-label="Auto height with overflow"
        appearance={appearance}
        dimension={dimension}
        defaultValue={'One\nTwo\nThree\nFour\nFive\nSix'}
        autoHeight
        minRows={2}
        maxRows={4}
      />
    ),
  },
];

const renderSamples = (render: (appearance: TextAreaAppearance, dimension: TextAreaDimension) => ReactNode) => (
  <VisualSamples>
    {TEXT_AREA_APPEARANCES.flatMap((appearance) =>
      TEXT_AREA_DIMENSIONS.map((dimension) => (
        <VisualSample key={`${appearance}-${dimension}`}>
          <VisualLabel>
            {appearance} / {dimension}
          </VisualLabel>
          {render(appearance, dimension)}
        </VisualSample>
      )),
    )}
  </VisualSamples>
);

export const TextAreaVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States by appearance and dimension</VisualTitle>
      <VisualGroups>
        {STATES.map(({ label, props }) => (
          <VisualGroup key={label}>
            <VisualGroupTitle>{label}</VisualGroupTitle>
            {renderSamples((appearance, dimension) => (
              <TextArea
                {...props}
                aria-label={label}
                appearance={appearance}
                dimension={dimension}
                placeholder="Placeholder"
              />
            ))}
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Compositions by appearance and dimension</VisualTitle>
      <VisualGroups>
        {COMPOSITIONS.map(({ label, render }) => (
          <VisualGroup key={label}>
            <VisualGroupTitle>{label}</VisualGroupTitle>
            {renderSamples(render)}
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
    <VisualSection data-visual-theme="light">
      <VisualTitle>Corner radius geometry</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>standard / m</VisualGroupTitle>
          <VisualSamples>
            {cornerRadiusOptions.map((cornerRadius) => (
              <RadiusSample key={cornerRadius} data-admiral-corner-radius={cornerRadius}>
                <VisualLabel>base {cornerRadius}</VisualLabel>
                <TextArea
                  aria-label="Corner radius"
                  appearance="standard"
                  defaultValue="TextArea value"
                  dimension="m"
                />
              </RadiusSample>
            ))}
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

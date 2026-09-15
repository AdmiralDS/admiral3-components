import type { ComponentProps, ReactNode } from 'react';

import { DocumentsCopyOutline, ServiceInfoOutline, SystemSearchOutline } from '@admiral-ds/admiral3-icons';
import { cornerRadiusOptions } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import {
  Input,
  InputIcon,
  InputIconButton,
  type InputAppearance,
  type InputDimension,
} from '@admiral-ds/admiral3-components';

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
import { INPUT_APPEARANCES, INPUT_DIMENSIONS } from '../../../src/components/Input/constants';

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof Input>;
};

type CompositionVariant = {
  label: string;
  render: (appearance: InputAppearance, dimension: InputDimension) => ReactNode;
};

const RadiusSample = styled(VisualSample)`
  width: 200px;
`;

const STATES: VisualVariant[] = [
  { label: 'empty', props: {} },
  { label: 'filled', props: { defaultValue: 'Input value' } },
  { label: 'filled with clear icon', props: { defaultValue: 'Input value', showClearIcon: true } },
  { label: 'disabled empty', props: { disabled: true } },
  { label: 'disabled filled', props: { defaultValue: 'Input value', disabled: true } },
  { label: 'readOnly empty', props: { readOnly: true } },
  { label: 'readOnly filled', props: { defaultValue: 'Input value', readOnly: true } },
  { label: 'error empty', props: { status: 'error' } },
  { label: 'error filled', props: { defaultValue: 'Input value', status: 'error' } },
  { label: 'success empty', props: { status: 'success' } },
  { label: 'success filled', props: { defaultValue: 'Input value', status: 'success' } },
  { label: 'disabled error', props: { defaultValue: 'Input value', disabled: true, status: 'error' } },
  { label: 'disabled success', props: { defaultValue: 'Input value', disabled: true, status: 'success' } },
  { label: 'readOnly error', props: { defaultValue: 'Input value', readOnly: true, status: 'error' } },
  { label: 'readOnly success', props: { defaultValue: 'Input value', readOnly: true, status: 'success' } },
];

const COMPOSITIONS: CompositionVariant[] = [
  {
    label: 'icons and clear action',
    render: (appearance, dimension) => (
      <Input
        appearance={appearance}
        dimension={dimension}
        defaultValue="Input value"
        showClearIcon
        iconsBefore={
          <InputIcon aria-hidden>
            <SystemSearchOutline />
          </InputIcon>
        }
        iconsAfter={
          <>
            <InputIconButton aria-label="Показать информацию">
              <ServiceInfoOutline aria-hidden />
            </InputIconButton>
            <InputIconButton aria-label="Скопировать значение">
              <DocumentsCopyOutline aria-hidden />
            </InputIconButton>
          </>
        }
      />
    ),
  },
  {
    label: 'prefix and suffix with dividers',
    render: (appearance, dimension) => (
      <Input appearance={appearance} dimension={dimension} defaultValue="1000" prefix="От" suffix="₽" />
    ),
  },
  {
    label: 'prefix and suffix without dividers',
    render: (appearance, dimension) => (
      <Input
        appearance={appearance}
        dimension={dimension}
        defaultValue="1000"
        prefix="От"
        suffix="₽"
        showAffixDivider={false}
      />
    ),
  },
];

const renderSamples = (render: (appearance: InputAppearance, dimension: InputDimension) => ReactNode) => (
  <VisualSamples>
    {INPUT_APPEARANCES.flatMap((appearance) =>
      INPUT_DIMENSIONS.map((dimension) => (
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

export const InputVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States by appearance and dimension</VisualTitle>
      <VisualGroups>
        {STATES.map(({ label, props }) => (
          <VisualGroup key={label}>
            <VisualGroupTitle>{label}</VisualGroupTitle>
            {renderSamples((appearance, dimension) => (
              <Input {...props} appearance={appearance} dimension={dimension} placeholder="Placeholder" />
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
                <Input appearance="standard" defaultValue="Input value" dimension="m" />
              </RadiusSample>
            ))}
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

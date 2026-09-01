import type { ComponentProps } from 'react';

import styled from 'styled-components';

import { FieldSet } from '@admiral-ds/admiral3-components';

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

type VisualVariant = {
  label: string;
  props: ComponentProps<typeof FieldSet>;
};

// TODO в дальнейшем заменить Item на библиотечные инпуты
const Item = styled.input`
  box-sizing: border-box;
  min-width: 72px;
  padding: 4px 8px;
  border: 1px solid currentColor;
  color: inherit;
  background: transparent;
  font: inherit;
`;

const VARIANTS: VisualVariant[] = [
  { label: 'M vertical', props: { dimension: 'm', orientation: 'vertical' } },
  { label: 'S vertical', props: { dimension: 's', orientation: 'vertical' } },
  { label: 'XS vertical', props: { dimension: 'xs', orientation: 'vertical' } },
  { label: 'M horizontal', props: { dimension: 'm', orientation: 'horizontal' } },
  { label: 'S horizontal', props: { dimension: 's', orientation: 'horizontal' } },
  { label: 'XS horizontal', props: { dimension: 'xs', orientation: 'horizontal' } },
  { label: 'Custom gap', props: { gap: 32 } },
];

const STATES: VisualVariant[] = [
  { label: 'default', props: {} },
  { label: 'required', props: { required: true } },
  { label: 'error', props: { error: true } },
  { label: 'required error', props: { error: true, required: true } },
  { label: 'disabled', props: { disabled: true } },
];

const renderMatrix = (items: VisualVariant[]) => (
  <VisualGroups>
    {items.map(({ label, props }) => (
      <VisualGroup key={label}>
        <VisualGroupTitle>{label}</VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>{label}</VisualLabel>
            <FieldSet {...props} legend="Данные пользователя">
              <Item aria-label="Фамилия" readOnly value="Фамилия" />
              <Item aria-label="Имя" readOnly value="Имя" />
              <Item aria-label="Отчество" readOnly value="Отчество" />
            </FieldSet>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    ))}
  </VisualGroups>
);

export const FieldSetVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      {renderMatrix(VARIANTS)}
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      {renderMatrix(STATES)}
    </VisualSection>
  </VisualLayout>
);

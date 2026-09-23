import type { ComponentProps } from 'react';

import styled from 'styled-components';

import { ProgressHeader } from '@admiral-ds/admiral3-components';

import { VisualLabel, VisualLayout, VisualSample, VisualSamples, VisualSection, VisualTitle } from './VisualLayout';

const HeaderViewport = styled.div`
  position: relative;
  overflow: hidden;
  width: 320px;
  height: 20px;
  border-radius: 2px;
`;

const VisualProgressHeader = (props: ComponentProps<typeof ProgressHeader>) => (
  <HeaderViewport>
    <ProgressHeader {...props} style={{ ...props.style, position: 'absolute' }} />
  </HeaderViewport>
);

export const ProgressHeaderVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>Determinate, 0%</VisualLabel>
          <VisualProgressHeader value={0} aria-label="Начало загрузки" />
        </VisualSample>
        <VisualSample>
          <VisualLabel>Determinate, 35%</VisualLabel>
          <VisualProgressHeader value={35} aria-label="Загрузка страницы" />
        </VisualSample>
        <VisualSample>
          <VisualLabel>Determinate, 100%</VisualLabel>
          <VisualProgressHeader value={100} aria-label="Загрузка завершена" />
        </VisualSample>
        <VisualSample>
          <VisualLabel>Indeterminate</VisualLabel>
          <VisualProgressHeader aria-label="Загрузка страницы" />
        </VisualSample>
        <VisualSample>
          <VisualLabel>Error</VisualLabel>
          <VisualProgressHeader value={62} error aria-label="Ошибка загрузки" />
        </VisualSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Custom appearance</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>Custom progress</VisualLabel>
          <VisualProgressHeader
            value={45}
            appearance={{
              backgroundColor: '#d8dce3',
              progressColor: '#008c8c',
              progressColorError: '#c2185b',
            }}
            aria-label="Загрузка страницы"
          />
        </VisualSample>
        <VisualSample>
          <VisualLabel>Custom error</VisualLabel>
          <VisualProgressHeader
            value={62}
            error
            appearance={{
              backgroundColor: '#d8dce3',
              progressColor: '#008c8c',
              progressColorError: '#c2185b',
            }}
            aria-label="Ошибка загрузки"
          />
        </VisualSample>
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);

import styled from 'styled-components';

import { Slider, SliderRange } from '@admiral-ds/admiral3-components';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  min-width: 0;
`;

export const SliderResponsiveTemplate = () => (
  <Layout data-testid="responsive-host">
    <Slider label="Громкость" defaultValue={50} data-testid="continuous" />
    <Slider label="Шаги" defaultValue={50} marks={[0, 25, 50, 75, 100]} data-testid="steps" />
    <SliderRange
      label="Сумма"
      defaultValue={[25, 75]}
      lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
      upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
      data-testid="range"
    />
  </Layout>
);

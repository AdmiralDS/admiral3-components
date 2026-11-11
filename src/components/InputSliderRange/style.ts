import styled from 'styled-components';

export const StyledInputSliderRange = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  inline-size: 100%;
  gap: 8px;
`;

export const InputSliderRangeFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
`;

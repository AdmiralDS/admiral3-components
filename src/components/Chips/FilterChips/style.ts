import styled from 'styled-components';

import type { ChipsProps } from '../types';

export const ContainerFilterChips = styled.div<{ $dimension: ChipsProps['dimension']; $gap?: number }>`
  display: flex;
  gap: ${({ $gap, $dimension }) => $gap ?? ($dimension === 'l' ? 12 : 8)}px;
`;

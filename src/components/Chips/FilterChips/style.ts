import styled from 'styled-components';

import type { ChipDimension } from '../types';

export const ContainerFilterChips = styled.div<{ $dimension: ChipDimension; $gap?: number }>`
  display: flex;
  gap: ${({ $gap, $dimension }) => $gap ?? ($dimension === 'l' ? 12 : 8)}px;
`;

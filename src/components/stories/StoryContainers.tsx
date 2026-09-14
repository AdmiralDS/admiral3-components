import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled, { css } from 'styled-components';

type StoryDemoContainerProps = {
  $direction?: 'row' | 'column';
  $gap?: string;
  $withBackground?: boolean;
};

export const StoryDemoContainer = styled.div<StoryDemoContainerProps>`
  box-sizing: border-box;
  inline-size: 100%;
  padding: 32px;
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: center;
  justify-content: center;
  gap: ${({ $gap = '0' }) => $gap};

  ${({ $withBackground = true }) =>
    $withBackground &&
    css`
      background-color: var(--admiral-color-neutral-base-2-rest);
    `}
`;

export const StoryDemoItem = styled.div`
  display: flex;
  inline-size: 320px;
  flex-direction: column;
  gap: 8px;
`;

export const StoryDirtyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px dashed #9aa9bc;
`;

export const StoryDemoDescription = styled.p<{ $textAlign?: 'start' | 'center' }>`
  ${textStyles.body.body2Long}
  max-inline-size: 640px;
  margin: 0;
  color: var(--admiral-color-neutral-text-1-rest);
  text-align: ${({ $textAlign = 'start' }) => $textAlign};

  code {
    font: inherit;
    color: var(--admiral-color-primary-text-1-rest);
  }
`;

import { useState } from 'react';

import styled from 'styled-components';

import { Dropdown, type DropdownProps } from '@admiral-ds/admiral3-components';

const Layout = styled.div<{ $targetPlacement: 'center' | 'bottom' }>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 320px;
  padding: 80px;
  ${({ $targetPlacement }) =>
    $targetPlacement === 'bottom' &&
    `
      min-height: 100vh;
      align-items: flex-end;
      padding-bottom: 16px;
    `}
`;

const Target = styled.button<{ $width: number }>`
  box-sizing: border-box;
  width: ${({ $width }) => $width}px;
  min-height: 40px;
`;

const Content = styled.div<{ $contentWidth: number; $widthMode: DropdownProps['widthMode'] }>`
  box-sizing: border-box;
  width: ${({ $contentWidth, $widthMode }) => ($widthMode === 'target' ? '100%' : `${$contentWidth}px`)};
  min-height: 64px;
  padding: 12px;
`;

export interface DropdownPlaygroundTemplateProps extends Omit<DropdownProps, 'targetElement'> {
  targetWidth?: number;
  contentWidth?: number;
  targetPlacement?: 'center' | 'bottom';
}

export const DropdownPlaygroundTemplate = ({
  targetWidth = 200,
  contentWidth = 280,
  targetPlacement = 'center',
  ...props
}: DropdownPlaygroundTemplateProps) => {
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);

  return (
    <Layout $targetPlacement={targetPlacement}>
      <Target ref={setTargetElement} $width={targetWidth}>
        Target
      </Target>
      <Dropdown {...props} targetElement={targetElement}>
        <Content $contentWidth={contentWidth} $widthMode={props.widthMode}>
          {props.children}
        </Content>
      </Dropdown>
    </Layout>
  );
};

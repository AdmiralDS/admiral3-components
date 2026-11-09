import { useState } from 'react';

import styled from 'styled-components';

import { Dropdown, type DropdownProps } from '@admiral-ds/admiral3-components';

type HorizontalPosition = 'left' | 'center' | 'right';
type VerticalPosition = 'top' | 'center' | 'bottom';

const Controls = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  > span {
    min-width: max-content;
  }
`;

const ControlButton = styled.button<{ $active: boolean }>`
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid ${({ $active }) => ($active ? '#315efb' : '#8a96a8')};
  border-radius: 6px;
  color: ${({ $active }) => ($active ? '#ffffff' : 'inherit')};
  background: ${({ $active }) => ($active ? '#315efb' : 'transparent')};
  cursor: pointer;
`;

const Stage = styled.div`
  box-sizing: border-box;
  position: relative;
  width: calc(100% - 32px);
  height: calc(100vh - 180px);
  min-width: 320px;
  min-height: 360px;
  max-width: calc(100% - 32px);
  max-height: 720px;
  margin: 0 16px 16px;
  border: 1px dashed #8a96a8;
  border-radius: 8px;
  overflow: auto;
  resize: both;
`;

const Surface = styled.div`
  position: relative;
  min-width: 700px;
  min-height: 600px;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(to right, transparent calc(50% - 1px), #dbe2ea 50%, transparent calc(50% + 1px)),
    linear-gradient(to bottom, transparent calc(50% - 1px), #dbe2ea 50%, transparent calc(50% + 1px));
`;

const Target = styled.button<{ $horizontal: HorizontalPosition; $vertical: VerticalPosition; $width: number }>`
  position: absolute;
  ${({ $horizontal }) =>
    $horizontal === 'left' ? 'left: 24px;' : $horizontal === 'right' ? 'right: 24px;' : 'left: 50%;'}
  ${({ $vertical }) => ($vertical === 'top' ? 'top: 24px;' : $vertical === 'bottom' ? 'bottom: 24px;' : 'top: 50%;')}
  transform: ${({ $horizontal, $vertical }) =>
    `${$horizontal === 'center' ? 'translateX(-50%)' : ''} ${$vertical === 'center' ? 'translateY(-50%)' : ''}`};
  min-height: 40px;
  width: ${({ $width }) => $width}px;
  padding: 8px 16px;
`;

const DropdownContent = styled.div<{ $width: number; $tall: boolean; $fitTarget: boolean }>`
  box-sizing: border-box;
  width: ${({ $fitTarget, $width }) => ($fitTarget ? '100%' : `${$width}px`)};
  min-height: ${({ $tall }) => ($tall ? 240 : 80)}px;
  padding: 16px;
  overflow-wrap: anywhere;
`;

const Hint = styled.p`
  flex-basis: 100%;
  margin: 0;
  color: #5a6680;
`;

const horizontalPositions: HorizontalPosition[] = ['left', 'center', 'right'];
const verticalPositions: VerticalPosition[] = ['top', 'center', 'bottom'];

export const DropdownAdaptiveTemplate = (props: DropdownProps) => {
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);
  const [horizontal, setHorizontal] = useState<HorizontalPosition>('center');
  const [vertical, setVertical] = useState<VerticalPosition>('center');
  const [contentWidth, setContentWidth] = useState(320);
  const [targetWidth, setTargetWidth] = useState(160);
  const [tallContent, setTallContent] = useState(false);

  return (
    <>
      <Controls>
        <ControlGroup>
          <span>Target по X:</span>
          {horizontalPositions.map((position) => (
            <ControlButton
              key={position}
              type="button"
              $active={horizontal === position}
              onClick={() => setHorizontal(position)}
            >
              {position}
            </ControlButton>
          ))}
        </ControlGroup>
        <ControlGroup>
          <span>Target по Y:</span>
          {verticalPositions.map((position) => (
            <ControlButton
              key={position}
              type="button"
              $active={vertical === position}
              onClick={() => setVertical(position)}
            >
              {position}
            </ControlButton>
          ))}
        </ControlGroup>
        <ControlGroup>
          <label htmlFor="target-width">Ширина target: {targetWidth}px</label>
          <input
            id="target-width"
            type="range"
            min="120"
            max="480"
            step="40"
            value={targetWidth}
            onChange={(event) => setTargetWidth(Number(event.currentTarget.value))}
          />
        </ControlGroup>
        <ControlGroup>
          <label htmlFor="dropdown-width">Ширина: {contentWidth}px</label>
          <input
            id="dropdown-width"
            type="range"
            min="160"
            max="560"
            step="40"
            value={contentWidth}
            onChange={(event) => setContentWidth(Number(event.currentTarget.value))}
          />
        </ControlGroup>
        <ControlButton type="button" $active={tallContent} onClick={() => setTallContent((value) => !value)}>
          Высокий контент
        </ControlButton>
        <Hint>
          Изменяйте размер пунктирной области, прокручивайте её и меняйте размер окна Storybook. Dropdown должен
          пересчитывать сторону и горизонтальный сдвиг автоматически.
        </Hint>
      </Controls>
      <Stage>
        <Surface>
          <Target ref={setTargetElement} $horizontal={horizontal} $vertical={vertical} $width={targetWidth}>
            Target
          </Target>
          <Dropdown {...props} targetElement={targetElement}>
            <DropdownContent $width={contentWidth} $tall={tallContent} $fitTarget={props.widthMode === 'target'}>
              <strong>Dropdown</strong>
              <p>Снизу — приоритетная позиция. Если места недостаточно, компонент откроется сверху.</p>
            </DropdownContent>
          </Dropdown>
        </Surface>
      </Stage>
    </>
  );
};

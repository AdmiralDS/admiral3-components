import styled from 'styled-components';

import { Button, Hint, HintLabel, useHint } from '@admiral-ds/admiral3-components';

const Content = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  gap: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const HintClickTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <>
      <Button {...triggerProps}>Показать подсказку</Button>
      {isVisible && (
        <Hint {...hintProps} closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}>
          <Content>
            <HintLabel>Дополнительная информация</HintLabel>
            <div>Хинт закрывается по крестику, Escape, повторному клику по триггеру или клику снаружи.</div>
            <Actions>
              <Button dimension="xs" appearance="ghost">
                Подробнее
              </Button>
            </Actions>
          </Content>
        </Hint>
      )}
    </>
  );
};

import styled from 'styled-components';

import { Button, Hint, HintLabel, useHint } from '@admiral-ds/admiral3-components';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HintScrollTemplate = () => {
  const { isVisible, triggerProps, hintProps } = useHint<HTMLButtonElement>({ triggerMode: 'click' });

  return (
    <>
      <Button {...triggerProps}>Показать длинную подсказку</Button>
      {isVisible && (
        <Hint
          {...hintProps}
          hintStyles={{ style: { width: 320, maxHeight: 240 } }}
          closeButtonProps={{ 'aria-label': 'Закрыть подсказку' }}
        >
          <Content>
            <HintLabel>Условия обслуживания</HintLabel>
            <div>
              Хинт ограничен по высоте. Если содержимое не помещается, прокручивается только внутренняя область.
            </div>
            <div>
              Кнопка закрытия остаётся на месте и визуально располагается поверх scroll-зоны. Правый отступ текста
              учитывает размер кнопки.
            </div>
            <div>
              Дополнительный текст делает содержимое достаточно длинным, чтобы продемонстрировать вертикальную прокрутку
              и максимальную высоту компонента.
            </div>
            <div>
              При прокрутке заголовок и текст перемещаются вместе, а крестик остаётся закреплённым в правом верхнем
              углу.
            </div>
          </Content>
        </Hint>
      )}
    </>
  );
};

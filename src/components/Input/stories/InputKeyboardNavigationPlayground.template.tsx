import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { Input, InputIconButton, InputIconInformer } from '@admiral-ds/admiral3-components';

export const InputKeyboardNavigationPlaygroundTemplate = () => {
  return (
    <>
      <button data-testid="before-input" type="button">
        Предыдущий элемент
      </button>
      <Input
        data-testid="input"
        defaultValue="Input value"
        placeholder="Input"
        showClearIcon
        iconsAfter={
          <>
            <InputIconInformer
              data-testid="informer-icon"
              title="Дополнительная информация о поле ввода"
              tabIndex={0}
            />
            <InputIconButton aria-label="Пользовательское действие">
              <SystemSearchOutline aria-hidden />
            </InputIconButton>
          </>
        }
      />
      <Input data-testid="read-only-input" defaultValue="Read only value" readOnly />
      <Input data-testid="disabled-input" defaultValue="Disabled value" disabled />
      <button data-testid="after-input-states" type="button">
        Следующий элемент
      </button>
    </>
  );
};

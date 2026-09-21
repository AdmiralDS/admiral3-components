import { useId } from 'react';

import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const FormItemExample = (args: FormItemProps) => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const hasDescription = hasSlotContent(args.description);
  return (
    <FormItem
      {...args}
      htmlFor={id}
      description={hasDescription ? <span id={descriptionId}>{args.description}</span> : undefined}
    >
      <Input
        id={id}
        aria-label={hasSlotContent(args.label) ? undefined : 'Название'}
        placeholder="Введите значение"
        aria-describedby={hasDescription ? descriptionId : undefined}
      />
    </FormItem>
  );
};

export const FormItemPlaygroundTemplate = (args: FormItemProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <FormItemExample {...args} />
    <StoryDemoDescription>
      FormItem оформляет подпись, пояснение и счётчик одного поля. Значением и валидацией управляет само поле или
      библиотека форм.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Свяжите <code>htmlFor</code> с уникальным <code>id</code> поля, а <code>id</code> элемента внутри{' '}
      <code>description</code> — с <code>aria-describedby</code> поля.
    </StoryDemoDescription>
    <StoryDemoDescription>
      FormItem передаёт вложенному Input <code>dimension</code>, <code>disabled</code>, <code>required</code> и{' '}
      <code>readOnly</code> через контекст. Настройки обёртки приоритетнее пропсов Input, включая значения по умолчанию:{' '}
      <code>m</code> для размера и <code>false</code> для остальных настроек.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Для группы полей используйте FieldSet. Примеры библиотечной валидации находятся в Integration/React Hook Form и
      Integration/TanStack Form.
    </StoryDemoDescription>
  </StoryDemoContainer>
);

export const FormItemAdditionalLabelTemplate = (args: FormItemProps) => <FormItemExample {...args} />;

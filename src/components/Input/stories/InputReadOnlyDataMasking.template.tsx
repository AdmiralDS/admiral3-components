import { useState, type MouseEvent } from 'react';

import { ServiceEyeCloseOutline, ServiceEyeOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Button, Input, InputIconButton, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const examples = [
  { name: 'card-number', label: 'Номер карты', maskedValue: '•••• •••• •••• 548', value: '5543 9764 3143 2548' },
  { name: 'birth-date', label: 'Дата рождения', maskedValue: '08.05.••••', value: '08.05.1992' },
  { name: 'email', label: 'Электронная почта', maskedValue: 'a••••@mail.ru', value: 'apollon13@mail.ru' },
  { name: 'surname', label: 'Фамилия', maskedValue: 'С•••••••а', value: 'Смирнова' },
  { name: 'phone', label: 'Телефон', maskedValue: '+7 095 ••• •• 75', value: '+7 095 364 83 75' },
] as const;

const ScenarioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

type ReadOnlyMaskedInputProps = InputProps & (typeof examples)[number];

const ReadOnlyMaskedInput = ({ label, maskedValue, name, value, ...args }: ReadOnlyMaskedInputProps) => {
  const [visible, setVisible] = useState(false);

  const preventIconMouseDefault = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Input
      {...args}
      name={name}
      value={visible ? value : maskedValue}
      readOnly
      aria-label={label}
      iconsAfter={
        <InputIconButton
          aria-label={visible ? `Скрыть: ${label}` : `Показать: ${label}`}
          aria-pressed={visible}
          disabled={args.disabled}
          onMouseDown={preventIconMouseDefault}
          onMouseUp={preventIconMouseDefault}
          onClick={() => setVisible((currentVisible) => !currentVisible)}
        >
          {visible ? <ServiceEyeOutline aria-hidden /> : <ServiceEyeCloseOutline aria-hidden />}
        </InputIconButton>
      }
    />
  );
};

const ClickToRevealInput = (args: InputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...args}
      data-testid="read-only-click-input"
      value={visible ? examples[2].value : examples[2].maskedValue}
      readOnly
      aria-label={`${examples[2].label}: раскрытие по клику`}
      onClick={() => setVisible((currentVisible) => !currentVisible)}
    />
  );
};

const FocusToRevealInput = (args: InputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...args}
      data-testid="read-only-focus-input"
      value={visible ? examples[1].value : examples[1].maskedValue}
      readOnly
      aria-label={`${examples[1].label}: раскрытие по фокусу`}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    />
  );
};

const GroupRevealInputs = (args: InputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <ScenarioGroup>
      <Input
        {...args}
        data-testid="read-only-group-card"
        value={visible ? examples[0].value : examples[0].maskedValue}
        readOnly
        aria-label={examples[0].label}
      />
      <Input
        {...args}
        value={visible ? examples[4].value : examples[4].maskedValue}
        readOnly
        aria-label={examples[4].label}
      />
      <Button type="button" dimension="s" onClick={() => setVisible((currentVisible) => !currentVisible)}>
        {visible ? 'Скрыть реквизиты' : 'Показать реквизиты'}
      </Button>
    </ScenarioGroup>
  );
};

export const InputReadOnlyDataMaskingTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Позволяет выводить различные форматы (маски) нередактируемых данных в состоянии Read Only, с возможностью
      частичного сокрытия информации по клику на поле или какому-либо событию.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Могут отображаться любые типы данных, например: обычный текст, реквизиты, даты, суммы, почта, номер телефона и
      т.п. При этом, формат маски и скрываемые символы назначаются пользователем. В примерах показано произвольное
      количество скрываемых символов.
    </StoryDemoDescription>
    {examples.map((example) => (
      <StoryDemoItem key={example.name}>
        <ReadOnlyMaskedInput {...args} {...example} />
      </StoryDemoItem>
    ))}
    <StoryDemoDescription>
      Дефолтное состояние может быть как скрытым, так и открытым. Отображение-скрытие данных может происходить по
      следующим сценариям:
    </StoryDemoDescription>
    <StoryDemoDescription as="ul">
      <li>Отображение-скрытие по клику на поле.</li>
      <li>
        Если информация скрыта по дефолту, то показывать по клику (фокусу) на поле и скрывать при выводе фокуса,
        например клику по соседнему полю.
      </li>
      <li>
        Отображать-скрывать информацию в группе полей по событию, например условной кнопке «Показать реквизиты карты».
      </li>
    </StoryDemoDescription>
    <StoryDemoItem>
      <StoryDemoDescription>Отображение-скрытие по клику на поле</StoryDemoDescription>
      <ClickToRevealInput {...args} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Показ по фокусу и скрытие при потере фокуса</StoryDemoDescription>
      <FocusToRevealInput {...args} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Управление группой полей внешним событием</StoryDemoDescription>
      <GroupRevealInputs {...args} />
    </StoryDemoItem>
  </StoryDemoContainer>
);

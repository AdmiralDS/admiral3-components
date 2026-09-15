import { useState } from 'react';

import styled from 'styled-components';

import { Chips, ListItem, UnorderedList, type ChipsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const radioArray = ['Марс', 'Венера', 'Юпитер'];
const DescriptionList = styled(UnorderedList)`
  width: 100%;
  max-width: 640px;
`;
const checkBoxArray = [
  { name: 'Марс', selected: false },
  { name: 'Венера', selected: false },
  { name: 'Юпитер', selected: false },
];

const WrapperFilterChips = styled.div<{ $dimension: ChipsProps['dimension'] }>`
  display: flex;
  gap: ${(p) => (p.$dimension === 'l' ? '12px' : '8px')};
`;

export const ChipsFilterTemplate = (args: ChipsProps) => {
  const [radioSelected, setRadioSelected] = useState('Венера');
  const [checkBoxData, setCheckBoxData] = useState(checkBoxArray);

  const handleCheckBoxClick = (name: string) =>
    setCheckBoxData((prevState) =>
      prevState.map((item) => (item.name === name ? { ...item, selected: !item.selected } : item)),
    );

  return (
    <StoryDemoContainer $withBackground={false} $direction="column" $gap="16px">
      <StoryDemoDescription>
        Filter Chips – набор из двух и более чипсов, которые могут быть в выбранном или невыбранном состояниях. <br />
        <br />
        Filter Chips могут работать в двух режимах:
      </StoryDemoDescription>
      <DescriptionList dimension="s" styleType="bullet">
        <ListItem>режим чекбоксов, когда можно выбрать любое количество значений</ListItem>
        <ListItem>режим радио кнопок, когда можно выбрать только одно значение из списка</ListItem>
      </DescriptionList>
      <StoryDemoDescription>Checkbox</StoryDemoDescription>
      <WrapperFilterChips $dimension={args.dimension}>
        {checkBoxData.map((item) => (
          <Chips
            key={item.name}
            {...args}
            selected={item.selected}
            onClick={!args.disabled && !args.readOnly ? () => handleCheckBoxClick(item.name) : undefined}
          >
            {item.name}
          </Chips>
        ))}
      </WrapperFilterChips>
      <StoryDemoDescription>Radio</StoryDemoDescription>
      <WrapperFilterChips $dimension={args.dimension}>
        {radioArray.map((item) => (
          <Chips
            key={item}
            {...args}
            selected={radioSelected === item}
            onClick={!args.disabled && !args.readOnly ? () => setRadioSelected(item) : undefined}
          >
            {item}
          </Chips>
        ))}
      </WrapperFilterChips>
    </StoryDemoContainer>
  );
};

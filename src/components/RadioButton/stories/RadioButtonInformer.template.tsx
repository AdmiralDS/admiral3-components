import { useState } from 'react';

import { ServiceInfoSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import {
  RadioButton,
  SelectionControlInformer,
  SelectionControlLayout,
  withHint,
  type RadioButtonProps,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { RADIO_BUTTON_DIMENSIONS } from '../constants';

const RadioButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const INFORMER_TEXT = 'Lorem Ipsum is simply dummy text.';

const SelectionControlInformerWithHint = withHint(SelectionControlInformer);

interface RadioButtonWithInformerProps {
  args: RadioButtonProps;
  dimension?: RadioButtonProps['dimension'];
}

const RadioButtonWithInformer = ({ args, dimension = 'm' }: RadioButtonWithInformerProps) => {
  const [radioButtonElement, setRadioButtonElement] = useState<HTMLInputElement | null>(null);
  const descriptionId = `radio-hint-${dimension}`;

  /** При наведении на иконку информера текст показывается визуально в Hint. Иконка скрыта от скринридера
    и не участвует в Tab-навигации; вместо этого тот же текст постоянно связан с CheckBox
    через скрытый элемент и aria-describedby. */
  return (
    <SelectionControlLayout>
      <RadioButton
        {...args}
        ref={setRadioButtonElement}
        name={`radio-informer-${dimension}`}
        dimension={dimension}
        aria-describedby={descriptionId}
      >
        Dimension — {dimension}
      </RadioButton>
      <SelectionControlInformerWithHint
        $dimension={dimension}
        aria-hidden
        renderContent={() => INFORMER_TEXT}
        hintTargetElement={radioButtonElement}
      >
        <ServiceInfoSolid />
      </SelectionControlInformerWithHint>
      <span id={descriptionId} hidden>
        {INFORMER_TEXT}
      </span>
    </SelectionControlLayout>
  );
};

export const RadioButtonInformerTemplate = (args: RadioButtonProps) => (
  <StoryDemoContainer>
    <RadioButtonList>
      {RADIO_BUTTON_DIMENSIONS.map((dimension) => (
        <RadioButtonWithInformer key={dimension} args={args} dimension={dimension} />
      ))}
    </RadioButtonList>
  </StoryDemoContainer>
);

import { useState } from 'react';

import { ServiceInfoSolid } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import {
  CheckBox,
  SelectionControlInformer,
  SelectionControlLayout,
  withHint,
  type CheckBoxProps,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer } from '../../stories/StoryContainers';
import { CHECK_BOX_DIMENSIONS } from '../constants';

const INFORMER_TEXT = 'Lorem Ipsum is simply dummy text.';

const CheckBoxList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const SelectionControlInformerWithHint = withHint(SelectionControlInformer);

interface CheckBoxWithInformerProps {
  args: CheckBoxProps;
  dimension?: CheckBoxProps['dimension'];
}

const CheckBoxWithInformer = ({ args, dimension = 'm' }: CheckBoxWithInformerProps) => {
  const [checkboxElement, setCheckboxElement] = useState<HTMLInputElement | null>(null);
  const descriptionId = `checkbox-hint-${dimension}`;

  /** При наведении на иконку информера текст показывается визуально в Hint. Иконка скрыта от скринридера
    и не участвует в Tab-навигации; вместо этого тот же текст постоянно связан с CheckBox
    через скрытый элемент и aria-describedby. */
  return (
    <SelectionControlLayout>
      <CheckBox {...args} ref={setCheckboxElement} dimension={dimension} aria-describedby={descriptionId}>
        Размер {dimension.toUpperCase()}
      </CheckBox>
      <SelectionControlInformerWithHint
        $dimension={dimension}
        aria-hidden
        renderContent={() => INFORMER_TEXT}
        hintTargetElement={checkboxElement}
      >
        <ServiceInfoSolid />
      </SelectionControlInformerWithHint>
      <span id={descriptionId} hidden>
        {INFORMER_TEXT}
      </span>
    </SelectionControlLayout>
  );
};

export const CheckBoxInformerTemplate = (args: CheckBoxProps) => (
  <StoryDemoContainer>
    <CheckBoxList>
      {CHECK_BOX_DIMENSIONS.map((dimension) => (
        <CheckBoxWithInformer key={dimension} args={args} dimension={dimension} />
      ))}
    </CheckBoxList>
  </StoryDemoContainer>
);

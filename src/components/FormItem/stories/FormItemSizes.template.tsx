import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';
import { FORM_ITEM_DIMENSIONS } from '../constants';

export const FormItemSizesTemplate = (args: FormItemProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    {FORM_ITEM_DIMENSIONS.map((dimension) => {
      const id = `form-item-size-${dimension}`;

      return (
        <StoryDemoItem key={dimension}>
          <StoryDemoDescription>Размер {dimension.toUpperCase()}</StoryDemoDescription>
          <FormItem {...args} dimension={dimension} htmlFor={id}>
            <Input id={id} dimension={dimension} placeholder="Введите значение" />
          </FormItem>
        </StoryDemoItem>
      );
    })}
  </StoryDemoContainer>
);

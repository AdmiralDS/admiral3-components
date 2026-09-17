import { FormItem, Input, type FormItemProps } from '@admiral-ds/admiral3-components';

import { hasSlotContent } from '../../../utils/hasSlotContent';
import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';
import { FORM_ITEM_DIMENSIONS } from '../constants';

export const FormItemSizesTemplate = (args: FormItemProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    {FORM_ITEM_DIMENSIONS.map((dimension) => {
      const id = `form-item-size-${dimension}`;

      return (
        <StoryDemoItem key={dimension}>
          <StoryDemoDescription>Размер {dimension.toUpperCase()}</StoryDemoDescription>
          <FormItem
            {...args}
            dimension={dimension}
            htmlFor={id}
            description={
              hasSlotContent(args.description) ? <span id={`${id}-description`}>{args.description}</span> : undefined
            }
          >
            <Input
              id={id}
              dimension={dimension}
              placeholder="Введите значение"
              required={args.required}
              disabled={args.disabled}
              status={args.status}
              aria-describedby={hasSlotContent(args.description) ? `${id}-description` : undefined}
            />
          </FormItem>
        </StoryDemoItem>
      );
    })}
  </StoryDemoContainer>
);

import {
  Input,
  Spinner,
  type InputDimension,
  type InputProps,
  type SpinnerDimension,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const spinnerDimensionByInputDimension: Record<InputDimension, SpinnerDimension> = {
  l: 'm',
  m: 'm',
  s: 's',
  xs: 'xs',
};

export const InputStatesTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoItem>
      <StoryDemoDescription>Empty</StoryDemoDescription>
      <Input {...args} />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Filled</StoryDemoDescription>
      <Input {...args} defaultValue="Input" />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Disabled</StoryDemoDescription>
      <Input {...args} defaultValue="Input" disabled />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Read only</StoryDemoDescription>
      <Input {...args} defaultValue="Input" readOnly />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Error</StoryDemoDescription>
      <Input {...args} defaultValue="Input" status="error" />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Success</StoryDemoDescription>
      <Input {...args} defaultValue="Input" status="success" />
    </StoryDemoItem>
    <StoryDemoItem>
      <StoryDemoDescription>Loading</StoryDemoDescription>
      <Input
        {...args}
        aria-busy
        defaultValue="Input"
        iconsAfter={
          <Spinner aria-label="Загрузка значения" dimension={spinnerDimensionByInputDimension[args.dimension ?? 'm']} />
        }
      />
    </StoryDemoItem>
  </StoryDemoContainer>
);

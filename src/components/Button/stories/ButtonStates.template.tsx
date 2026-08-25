import styled from 'styled-components';

import { Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const State = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  align-self: flex-start;
`;

export const ButtonStatesTemplate = (args: ButtonProps) => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <State>
        <Button {...args} disabled />
        <StoryDemoDescription>Disable</StoryDemoDescription>
      </State>
      <State>
        <Button
          {...args}
          inactive
          // TODO: в дальнейшем заменить title на Tooltip/Hint
          title="Кнопка выглядит задизейбленной, но сохраняет фокус и обработку нажатий. Используйте, когда основное
          действие кнопки недоступно, но по нажатию нужно объяснить причину (н-р через тултип или
          нотификацию)."
        />
        <StoryDemoDescription>Inactive</StoryDemoDescription>
      </State>
      <State>
        <Button {...args} loading onClick={() => window.alert('click')} />
        <StoryDemoDescription>Loading</StoryDemoDescription>
      </State>
      <State>
        <Button {...args} loading loadingPosition="start" />
        <StoryDemoDescription>Loading with Spinner start position</StoryDemoDescription>
      </State>
      <State>
        <Button {...args} loading loadingPosition="end" />
        <StoryDemoDescription>Loading with Spinner end position</StoryDemoDescription>
      </State>
      <State>
        <Button {...args} skeleton appearance="outline" />
        <StoryDemoDescription>Skeleton</StoryDemoDescription>
      </State>
    </StoryDemoContainer>
  );
};

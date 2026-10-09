import styled from 'styled-components';

import { Button, ButtonGroup } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_GROUP_APPEARANCES } from '../constants';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const Comparison = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

export const ButtonGroupNeutralFocusFallbackTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Перемещайте фокус через <code>Tab</code>. В каждой паре цвет контура должен совпадать: пустой{' '}
      <code>colorConfig</code> не должен менять фокус в режиме <code>neutral</code>. Проверьте также тёмную тему.
    </StoryDemoDescription>
    {BUTTON_GROUP_APPEARANCES.map((appearance) => (
      <Example key={appearance}>
        <StoryDemoDescription>{appearance} / neutral</StoryDemoDescription>
        <Comparison>
          <Example>
            <StoryDemoDescription>Без colorConfig</StoryDemoDescription>
            <ButtonGroup appearance={appearance} colorMode="neutral" aria-label={`${appearance} без colorConfig`}>
              <Button>Первая</Button>
              <Button>Вторая</Button>
            </ButtonGroup>
          </Example>
          <Example>
            <StoryDemoDescription>colorConfig={'{}'}</StoryDemoDescription>
            <ButtonGroup
              appearance={appearance}
              colorMode="neutral"
              colorConfig={{}}
              aria-label={`${appearance} с пустым colorConfig`}
            >
              <Button>Первая</Button>
              <Button>Вторая</Button>
            </ButtonGroup>
          </Example>
        </Comparison>
      </Example>
    ))}
  </StoryDemoContainer>
);

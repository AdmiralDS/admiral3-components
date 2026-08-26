import { ServiceCheckOutline, ServiceShareOutline } from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import { Badge, Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_APPEARANCES } from '../constants';

const Appearance = styled.div`
  display: flex;
  gap: 16px;
  align-self: flex-start;
`;

export const ButtonIconBadgeTemplate = (args: Omit<ButtonProps, 'appearance' | 'colorMode'>) => {
  return (
    <StoryDemoContainer $gap="16px" $direction="column">
      <StoryDemoDescription>
        Для дополнительных акцентов и более прозрачных действий могут применяться кнопки с иконками. Иконка может быть
        как слева, так и справа.
      </StoryDemoDescription>
      <Appearance>
        {BUTTON_APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} appearance={appearance}>
            <ServiceCheckOutline /> Button
          </Button>
        ))}
      </Appearance>
      <Appearance>
        {BUTTON_APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} appearance={appearance}>
            Button <ServiceCheckOutline />
          </Button>
        ))}
      </Appearance>
      <StoryDemoDescription>
        В некоторых случаях могут использоваться кнопки только с иконками. Как правило, это иконки значениях которых
        понятны и не вызывают сомнений.
      </StoryDemoDescription>
      <Appearance>
        {BUTTON_APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} appearance={appearance} square>
            <ServiceShareOutline />
          </Button>
        ))}
      </Appearance>
      <StoryDemoDescription>
        Также кнопка может использоваться в сочетании с бейджем, но при использовании бейджей не рекомендуется включать
        иконки.
      </StoryDemoDescription>
      <Appearance>
        {BUTTON_APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} appearance={appearance}>
            Button
            <Badge dimension="s" appearance={appearance === 'solid' ? 'whiteStatic' : 'info'}>
              5
            </Badge>
          </Button>
        ))}
      </Appearance>
      <Appearance>
        {BUTTON_APPEARANCES.map((appearance) => (
          <Button key={appearance} {...args} appearance={appearance}>
            <Badge dimension="s" appearance={appearance === 'solid' ? 'whiteStatic' : 'info'}>
              5
            </Badge>
            Button
          </Button>
        ))}
      </Appearance>
    </StoryDemoContainer>
  );
};

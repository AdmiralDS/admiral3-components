import {
  ServiceCheckOutline,
  ServiceCheckSolid,
  ServiceShareOutline,
  ServiceShareSolid,
} from '@admiral-ds/admiral3-icons';
import styled from 'styled-components';

import {
  Badge,
  Button,
  ButtonGroup,
  type BadgeAppearance,
  type ButtonGroupAppearance,
  type ButtonGroupColorMode,
  type ButtonGroupProps,
} from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

const Example = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const Examples = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: max-content;
`;

const NON_SOLID_BADGE_APPEARANCES: Record<ButtonGroupColorMode, BadgeAppearance> = {
  colored: 'info',
  neutral: 'neutral3',
};

const BADGE_APPEARANCES: Record<ButtonGroupAppearance, Record<ButtonGroupColorMode, BadgeAppearance>> = {
  solid: { colored: 'whiteStatic', neutral: 'neutral1' },
  outline: NON_SOLID_BADGE_APPEARANCES,
  flat: NON_SOLID_BADGE_APPEARANCES,
};

const BADGES = [
  { label: 'Новые', value: 5 },
  { label: 'В работе', value: 3 },
  { label: 'Готовые', value: 8 },
] as const;

export const ButtonGroupIconBadgeTemplate = (args: ButtonGroupProps) => {
  const appearance = args.appearance ?? 'solid';
  const colorMode = args.colorMode ?? 'colored';
  const badgeAppearance = BADGE_APPEARANCES[appearance][colorMode];
  const CheckIcon = appearance === 'solid' ? ServiceCheckSolid : ServiceCheckOutline;
  const ShareIcon = appearance === 'solid' ? ServiceShareSolid : ServiceShareOutline;

  return (
    <StoryDemoContainer>
      <Examples>
        <Example>
          <StoryDemoDescription>Иконка перед текстом</StoryDemoDescription>
          <ButtonGroup {...args} aria-label="Действия с иконкой перед текстом">
            <Button>
              <CheckIcon aria-hidden="true" focusable="false" /> Подтвердить
            </Button>
            <Button>
              <CheckIcon aria-hidden="true" focusable="false" /> Согласовать
            </Button>
            <Button>
              <CheckIcon aria-hidden="true" focusable="false" /> Завершить
            </Button>
          </ButtonGroup>
        </Example>
        <Example>
          <StoryDemoDescription>Иконка после текста</StoryDemoDescription>
          <ButtonGroup {...args} aria-label="Действия с иконкой после текста">
            <Button>
              Поделиться <ShareIcon aria-hidden="true" focusable="false" />
            </Button>
            <Button>
              Отправить <ShareIcon aria-hidden="true" focusable="false" />
            </Button>
            <Button>
              Экспортировать <ShareIcon aria-hidden="true" focusable="false" />
            </Button>
          </ButtonGroup>
        </Example>
        <Example>
          <StoryDemoDescription>С Badge</StoryDemoDescription>
          <ButtonGroup {...args} aria-label="Разделы с количеством элементов">
            {BADGES.map(({ label, value }) => (
              <Button key={label}>
                {label} <Badge appearance={badgeAppearance}>{value}</Badge>
              </Button>
            ))}
          </ButtonGroup>
        </Example>
        <Example>
          <StoryDemoDescription>Только иконки</StoryDemoDescription>
          <ButtonGroup {...args} aria-label="Быстрые действия">
            <Button square aria-label="Подтвердить">
              <CheckIcon aria-hidden="true" focusable="false" />
            </Button>
            <Button square aria-label="Поделиться">
              <ShareIcon aria-hidden="true" focusable="false" />
            </Button>
            <Button square aria-label="Завершить">
              <CheckIcon aria-hidden="true" focusable="false" />
            </Button>
          </ButtonGroup>
        </Example>
      </Examples>
    </StoryDemoContainer>
  );
};

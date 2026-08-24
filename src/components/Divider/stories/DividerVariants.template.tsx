import styled from 'styled-components';

import { StoryDemoContainer, StoryDemoDescription } from '#src/components/stories/StoryContainers';

import { Divider, ListItem, UnorderedList } from '@admiral-ds/admiral3-primitives';

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px 0;
  width: 80%;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const HorizontalWrapper = styled(Container)`
  flex-direction: column;
`;

const VerticalWrapper = styled(Container)`
  height: 100px;
`;

export const DividerVariantsTemplate = () => {
  return (
    <>
      <StoryDemoContainer $gap="16px" $direction="column">
        <StoryDemoDescription style={{ width: '100%' }}>Основные настройки компонента</StoryDemoDescription>
        <UnorderedList dimension="s" styleType="bullet">
          <ListItem>Тип — горизонтальный или вертикальный</ListItem>
          <ListItem>Стиль — default, subtle, strong, primary, static white</ListItem>
          <ListItem>Толщина линии — 1 px ('s'), 2 px ('m')</ListItem>
          <ListItem>Тема — светлая или темная</ListItem>
          <ListItem>Вы можете назначать произвольные цвета компоненту, помимо заданных</ListItem>
          <ListItem>Размер компонента регулируется «вручную» пользователем</ListItem>
        </UnorderedList>
        <HorizontalWrapper>
          <Divider length="80%" dimension="s" />
          <Divider length="80%" />
          <Divider length="80%" dimension="s" appearance="subtle" />
          <Divider length="80%" appearance="subtle" />
          <Divider length="80%" dimension="s" appearance="strong" />
          <Divider length="80%" appearance="strong" />
          <Divider length="80%" dimension="s" appearance="primary" />
          <Divider length="80%" appearance="primary" />
          <Divider length="80%" dimension="s" appearance="staticWhite" />
          <Divider length="80%" appearance="staticWhite" />
          <Divider length="80%" dimension="s" appearance={{ backgroundColor: '#84106e' }} />
          <Divider length="80%" appearance={{ backgroundColor: '#84106e' }} />
        </HorizontalWrapper>
        <VerticalWrapper>
          <Divider orientation="vertical" />
          <Divider orientation="vertical" dimension="s" />
          <Divider orientation="vertical" dimension="s" appearance="subtle" />
          <Divider orientation="vertical" appearance="subtle" />
          <Divider orientation="vertical" dimension="s" appearance="strong" />
          <Divider orientation="vertical" appearance="strong" />
          <Divider orientation="vertical" dimension="s" appearance="primary" />
          <Divider orientation="vertical" appearance="primary" />
          <Divider orientation="vertical" dimension="s" appearance="staticWhite" />
          <Divider orientation="vertical" appearance="staticWhite" />
          <Divider orientation="vertical" dimension="s" appearance={{ backgroundColor: '#84106e' }} />
          <Divider orientation="vertical" appearance={{ backgroundColor: '#84106e' }} />
        </VerticalWrapper>
      </StoryDemoContainer>
    </>
  );
};

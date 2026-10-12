import {
  ServiceCheckOutline,
  ServiceShareOutline,
  SystemPersonSolid,
  SystemStarSolid,
} from '@admiral-ds/admiral3-icons';

import { Pill, Pills, type PillsProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

export const PillsNestedTemplate = (args: PillsProps) => {
  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        Связанные Pill можно визуально объединить внешней композицией Pills. Если в Pills не указано свойство{' '}
        <code>connected</code>, то Pill будут отображаться как отдельные элементы. <br />
        Используя иконки, следите, чтобы иконки были во всех компонентах группы
      </StoryDemoDescription>
      <Pills connected aria-label="Связанные статусы" data-testid="pills-group">
        <Pill appearance="info1">
          <SystemStarSolid aria-hidden="true" focusable="false" />
          First
        </Pill>
        <Pill appearance="error1">
          <ServiceShareOutline aria-hidden="true" focusable="false" />
          Middle 1
        </Pill>
        <Pill appearance="attention1">
          <SystemPersonSolid aria-hidden="true" focusable="false" />
          Middle 2
        </Pill>
        <Pill appearance="success1">
          <ServiceCheckOutline aria-hidden="true" focusable="false" />
          Last
        </Pill>
      </Pills>
      <Pills {...args} aria-label="Связанные статусы" data-testid="pills-group">
        <Pill appearance="info1">
          <SystemStarSolid aria-hidden="true" focusable="false" />
          First
        </Pill>
        <Pill appearance="error1">
          <ServiceShareOutline aria-hidden="true" focusable="false" />
          Middle 1
        </Pill>
        <Pill appearance="attention1">
          <SystemPersonSolid aria-hidden="true" focusable="false" />
          Middle 2
        </Pill>
        <Pill appearance="success1">
          <ServiceCheckOutline aria-hidden="true" focusable="false" />
          Last
        </Pill>
      </Pills>
    </StoryDemoContainer>
  );
};

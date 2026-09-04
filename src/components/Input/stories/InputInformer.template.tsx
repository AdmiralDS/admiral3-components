import styled from 'styled-components';

import { Input, InputIconInformer, type InputProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription, StoryDemoItem } from '../../stories/StoryContainers';

const INFORMER_TEXT = 'Дополнительная информация о поле ввода';

const StoryInputIconInformer = styled(InputIconInformer)`
  &&,
  && * {
    cursor: pointer;
  }
`;

export const InputInformerTemplate = (args: InputProps) => (
  <StoryDemoContainer $direction="column" $gap="16px">
    <StoryDemoDescription>
      Поле ввода с информером. Необходимо, если для правильного заполнения поля может потребоваться дополнительная
      информация.
    </StoryDemoDescription>
    <StoryDemoDescription>
      После реализации компонента Hint он будет использоваться для подсказки. В качестве иконки в поле ввода
      используется иконка Help. Информер рекомендуется всегда оставлять активным, в том числе в состояниях{' '}
      <code>readOnly</code> и <code>disabled</code>.
    </StoryDemoDescription>
    <StoryDemoItem>
      {/* TODO: Заменить нативный title на Hint после реализации компонента Hint. */}
      <Input {...args} iconsAfter={<StoryInputIconInformer aria-label={INFORMER_TEXT} title={INFORMER_TEXT} />} />
    </StoryDemoItem>
  </StoryDemoContainer>
);

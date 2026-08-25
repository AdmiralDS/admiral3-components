import styled from 'styled-components';

import { Button, type ButtonProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_APPEARANCES, BUTTON_COLOR_MODES, BUTTON_DIMENSIONS } from '../constants';

const Appearance = styled.div`
  display: grid;
  gap: 16px;
`;
const ButtonList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  background-color: var(--admiral-color-neutral-base-2-rest);
`;

const appearanceLabels: Record<(typeof BUTTON_APPEARANCES)[number], { name: string; description: string }> = {
  solid: {
    name: 'Solid Button',
    description:
      'Основная кнопка. Используется для самых важных действий. Желательно использовать одну такую кнопку на странице.',
  },
  flat: {
    name: 'Flat Button',
    description:
      'Используется для дополнительных действий. Имеет меньший визуальный акцент нежели второстепенная кнопка.',
  },
  outline: {
    name: 'Outline Button',
    description:
      'Второстепенная кнопка. Используется для дополнительных действий. Часто идет в паре с основной кнопкой, когда нужно обозначить несколько действий, одно из которых является основным.',
  },
  ghost: {
    name: 'Ghost Button',
    description: 'Прозрачная кнопка. Кнопка имеет наименьший приоритет по сравнению с другими типами кнопок.',
  },
};

export const ButtonAppereancesTemplate = (args: ButtonProps) => {
  return (
    <StoryDemoContainer $gap="60px" $direction="column">
      <StoryDemoDescription>
        Существует четыре вида кнопок: <code>Solid, Outline, Flat, Ghost</code>. Вид кнопки определяется с помощью
        параметра <code>appearance</code>. Также у кнопок есть параметр <code>colorMode</code>, который позволяет
        переключаться между цветовыми режимами окрашивания: <code>colored, neutral, staticWhite</code> (поддерживается
        только <code>Flat</code> и <code>Outline</code> кнопками). Рекомендуется использовать кнопки в одном цветовом
        режиме. К примеру, не использовать в одном проекте синюю и черную кнопки Solid.
      </StoryDemoDescription>
      {BUTTON_APPEARANCES.map((appearance) => (
        <Appearance key={appearance}>
          <span>{appearanceLabels[appearance].name}</span>
          <StoryDemoDescription>{appearanceLabels[appearance].description}</StoryDemoDescription>
          {(appearance === 'solid' || appearance === 'ghost') &&
            BUTTON_COLOR_MODES.filter((mode) => mode !== 'staticWhite').map((colorMode) => (
              <ButtonList key={colorMode}>
                {BUTTON_DIMENSIONS.map((dimension) => (
                  <Button
                    key={`${appearance}_${colorMode}_${dimension}`}
                    {...args}
                    appearance={appearance}
                    colorMode={colorMode}
                    dimension={dimension}
                  />
                ))}
              </ButtonList>
            ))}
          {(appearance === 'flat' || appearance === 'outline') &&
            BUTTON_COLOR_MODES.map((colorMode) => (
              <ButtonList key={colorMode} data-admiral-theme={colorMode === 'staticWhite' ? 'dark' : 'light'}>
                {BUTTON_DIMENSIONS.map((dimension) => (
                  <Button
                    key={`${appearance}_${colorMode}_${dimension}`}
                    {...args}
                    appearance={appearance}
                    colorMode={colorMode}
                    dimension={dimension}
                  />
                ))}
              </ButtonList>
            ))}
        </Appearance>
      ))}
    </StoryDemoContainer>
  );
};

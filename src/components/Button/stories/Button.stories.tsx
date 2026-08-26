import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import { Button, type ButtonProps, type ButtonAppearance, type ButtonColorMode } from '@admiral-ds/admiral3-components';

import { ButtonAppereancesTemplate } from './ButtonAppearances.template';
import buttonAppereancesTemplateRaw from './ButtonAppearances.template?raw';
import { ButtonCustomColorTemplate } from './ButtonCustomColor.template';
import buttonCustomColorTemplateRaw from './ButtonCustomColor.template?raw';
import { ButtonIconBadgeTemplate } from './ButtonIconBadge.template';
import buttonIconBadgeTemplateRaw from './ButtonIconBadge.template?raw';
import { ButtonPlaygroundTemplate } from './ButtonPlayground.template';
import buttonPlaygroundTemplateRaw from './ButtonPlayground.template?raw';
import { ButtonSizesTemplate } from './ButtonSizes.template';
import buttonSizesTemplateRaw from './ButtonSizes.template?raw';
import { ButtonStatesTemplate } from './ButtonStates.template';
import buttonStatesTemplateRaw from './ButtonStates.template?raw';
import { StoryDemoDescription } from '../../stories/StoryContainers';
import { BUTTON_APPEARANCES, BUTTON_COLOR_MODES, BUTTON_DIMENSIONS, BUTTON_LOADING_POSITIONS } from '../constants';

// Создаем плоский тип (без discriminated unions) специально для Storybook args
type StorybookButtonProps = Omit<ButtonProps, 'appearance' | 'colorMode'> & {
  appearance?: ButtonAppearance;
  colorMode?: ButtonColorMode;
};
const ErrorMessage = styled.div`
  padding: 8px 12px;
  background-color: var(--admiral-color-error-base-3-rest);
  border-bottom: 2px solid var(--admiral-color-error-text-1-rest);
  margin-bottom: 40px;
`;

const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    // Декоратор для проверки валидности пропсов
    (Story, context) => {
      const { appearance, colorMode } = context.args as StorybookButtonProps;

      const isInvalid = (appearance === 'solid' || appearance === 'ghost') && colorMode === 'staticWhite';

      return (
        <div
          data-admiral-theme={
            (appearance === 'flat' || appearance === 'outline') && colorMode === 'staticWhite' ? 'dark' : 'light'
          }
        >
          {isInvalid && (
            <ErrorMessage>
              <StoryDemoDescription>
                ⚠️ Невалидная комбинация: <code>colorMode="staticWhite"</code> не поддерживается для{' '}
                <code>appearance="{appearance}"</code>. Компонент отобразится с <code>colorMode="colored"</code>.
              </StoryDemoDescription>
            </ErrorMessage>
          )}
          <Story />
        </div>
      );
    },
  ],
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: BUTTON_APPEARANCES,
    },
    colorMode: {
      control: { type: 'inline-radio' },
      options: BUTTON_COLOR_MODES,
    },
    dimension: {
      control: { type: 'inline-radio' },
      options: BUTTON_DIMENSIONS,
    },
    disabled: {
      control: { type: 'boolean' },
    },
    inactive: {
      control: { type: 'boolean' },
    },
    square: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    loadingPosition: {
      control: { type: 'inline-radio' },
      options: BUTTON_LOADING_POSITIONS,
    },
    skeleton: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

const defaultArgs: StorybookButtonProps = {
  children: 'Button',
  appearance: 'solid',
  colorMode: 'colored',
  dimension: 'm',
};

export const Playground: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonPlaygroundTemplate {...(args as ButtonProps)} />,

  parameters: {
    docs: {
      source: {
        code: buttonPlaygroundTemplateRaw,
      },
    },
  },
};

export const Sizes: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonSizesTemplate {...(args as ButtonProps)} />,

  parameters: {
    docs: {
      source: {
        code: buttonSizesTemplateRaw,
      },
    },
  },
};

export const AppereancesAndColorModes: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonAppereancesTemplate {...(args as ButtonProps)} />,

  parameters: {
    controls: {
      exclude: ['appearance', 'colorMode', 'dimension'],
    },
    docs: {
      source: {
        code: buttonAppereancesTemplateRaw,
      },
    },
  },
};

export const WithIconAndBadge: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonIconBadgeTemplate {...(args as ButtonProps)} />,

  parameters: {
    controls: {
      exclude: ['children', 'appearance', 'colorMode', 'square'],
    },
    docs: {
      source: {
        code: buttonIconBadgeTemplateRaw,
      },
    },
  },
};

export const States: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonStatesTemplate {...(args as ButtonProps)} />,

  parameters: {
    controls: {
      exclude: ['disabled', 'inactive', 'loading', 'loadingPosition', 'skeleton'],
    },
    docs: {
      source: {
        code: buttonStatesTemplateRaw,
      },
    },
  },
};

export const CustomColor: StoryObj<StorybookButtonProps> = {
  args: defaultArgs,
  render: (args) => <ButtonCustomColorTemplate {...(args as ButtonProps)} />,

  parameters: {
    controls: {
      exclude: ['appearance', 'colorMode'],
    },
    docs: {
      source: {
        code: buttonCustomColorTemplateRaw,
      },
    },
  },
};

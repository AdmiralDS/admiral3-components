import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stepper, type StepperProps } from '@admiral-ds/admiral3-components';

import { StepperColorModesTemplate } from './StepperColorModes.template';
import stepperColorModesTemplateRaw from './StepperColorModes.template?raw';
import { StepperDescriptionOnlyTemplate } from './StepperDescriptionOnly.template';
import stepperDescriptionOnlyTemplateRaw from './StepperDescriptionOnly.template?raw';
import { StepperDimensionsTemplate } from './StepperDimensions.template';
import stepperDimensionsTemplateRaw from './StepperDimensions.template?raw';
import { StepperFormTemplate } from './StepperForm.template';
import stepperFormTemplateRaw from './StepperForm.template?raw';
import { StepperInactiveTemplate } from './StepperInactive.template';
import stepperInactiveTemplateRaw from './StepperInactive.template?raw';
import { StepperLastConnectorTemplate } from './StepperLastConnector.template';
import stepperLastConnectorTemplateRaw from './StepperLastConnector.template?raw';
import { StepperMobileTemplate } from './StepperMobile.template';
import stepperMobileTemplateRaw from './StepperMobile.template?raw';
import { StepperNavigationTemplate } from './StepperNavigation.template';
import stepperNavigationTemplateRaw from './StepperNavigation.template?raw';
import { StepperOrientationTemplate } from './StepperOrientation.template';
import stepperOrientationTemplateRaw from './StepperOrientation.template?raw';
import { StepperPlaygroundTemplate } from './StepperPlayground.template';
import stepperPlaygroundTemplateRaw from './StepperPlayground.template?raw';
import { StepperStatesTemplate } from './StepperStates.template';
import stepperStatesTemplateRaw from './StepperStates.template?raw';
import { StepperTruncationTemplate } from './StepperTruncation.template';
import stepperTruncationTemplateRaw from './StepperTruncation.template?raw';
import { STEPPER_COLOR_MODES, STEPPER_DIMENSIONS, STEPPER_LINE_CLAMPS, STEPPER_ORIENTATIONS } from '../constants';

const componentDescription = `
Компонент Stepper — визуальное отображение пользовательского прогресса через набор шагов. Уведомляет пользователя о текущем положении на пути при выполнении конкретной задачи.

Названия шагов должны сопровождать индикатор прогресса, чтобы указать, что пользователь будет выполнять на каждом из этапов. Рекомендуется использовать короткие и емкие названия шагов для явного отображения сути.

Компонент представлен в двух вариантах — горизонтальном и вертикальном.
`;

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: componentDescription } } },
  argTypes: {
    activeStep: { control: { type: 'number', min: -1, step: 1 } },
    dimension: { control: { type: 'inline-radio' }, options: STEPPER_DIMENSIONS },
    orientation: { control: { type: 'inline-radio' }, options: STEPPER_ORIENTATIONS },
    colorMode: { control: { type: 'inline-radio' }, options: STEPPER_COLOR_MODES },
    lineClamp: { control: { type: 'inline-radio' }, options: STEPPER_LINE_CLAMPS },
    mobile: { control: { type: 'boolean' } },
    showLastStepLine: { control: { type: 'boolean' } },
    stepWidth: { control: { type: 'number', min: 24, step: 1 } },
    children: { control: false },
    onStepChange: { control: false },
    statusLabels: { control: false },
  },
} satisfies Meta<typeof Stepper>;

export default meta;

const defaultArgs: StepperProps = {
  activeStep: 1,
  dimension: 'm',
  orientation: 'horizontal',
  colorMode: 'colored',
  lineClamp: 2,
  mobile: false,
  showLastStepLine: false,
  'aria-label': 'Этапы оформления заказа',
};

export const Playground: StoryObj<StepperProps> = {
  args: defaultArgs,
  name: 'Активный Stepper',
  render: StepperPlaygroundTemplate,
  parameters: {
    docs: { source: { code: stepperPlaygroundTemplateRaw } },
  },
};

export const Inactive: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperInactiveTemplate,
  name: 'Неактивный Stepper',
  parameters: {
    docs: { source: { code: stepperInactiveTemplateRaw } },
  },
};

export const Dimensions: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperDimensionsTemplate,
  name: 'Размеры',
  parameters: {
    controls: { exclude: ['dimension'] },
    docs: { source: { code: stepperDimensionsTemplateRaw } },
  },
};

export const ColorModes: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperColorModesTemplate,
  name: 'Цветовые режимы',
  parameters: {
    controls: { exclude: ['colorMode'] },
    docs: { source: { code: stepperColorModesTemplateRaw } },
  },
};

export const Orientation: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperOrientationTemplate,
  name: 'Ориентация',
  parameters: {
    controls: { exclude: ['orientation', 'mobile'] },
    docs: { source: { code: stepperOrientationTemplateRaw } },
  },
};

export const States: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperStatesTemplate,
  name: 'Состояния',
  parameters: {
    controls: { exclude: ['activeStep'] },
    docs: { source: { code: stepperStatesTemplateRaw } },
  },
};

export const PreviousSteps: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperNavigationTemplate,
  name: 'Возврат к шагам',
  parameters: {
    controls: { exclude: ['activeStep'] },
    docs: { source: { code: stepperNavigationTemplateRaw } },
  },
};

export const Mobile: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperMobileTemplate,
  name: 'Мобильная версия',
  parameters: {
    controls: { exclude: ['activeStep', 'orientation', 'mobile'] },
    docs: { source: { code: stepperMobileTemplateRaw } },
  },
};

export const Truncation: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperTruncationTemplate,
  name: 'Усечение текста',
  parameters: {
    controls: { exclude: ['activeStep', 'stepWidth', 'mobile'] },
    docs: { source: { code: stepperTruncationTemplateRaw } },
  },
};

export const Form: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperFormTemplate,
  name: 'Фокус в форме',
  parameters: {
    controls: { exclude: ['activeStep'] },
    docs: { source: { code: stepperFormTemplateRaw } },
  },
};

export const LastConnector: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperLastConnectorTemplate,
  name: 'Линия последнего шага',
  parameters: {
    controls: { exclude: ['showLastStepLine'] },
    docs: { source: { code: stepperLastConnectorTemplateRaw } },
  },
};

export const DescriptionOnly: StoryObj<StepperProps> = {
  args: defaultArgs,
  render: StepperDescriptionOnlyTemplate,
  name: 'Без заголовка',
  parameters: {
    docs: { source: { code: stepperDescriptionOnlyTemplateRaw } },
  },
};

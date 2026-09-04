import { SystemSearchOutline } from '@admiral-ds/admiral3-icons';

import { InputIconButton } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import type { InputProps } from '../../src/components/Input';
import { InputCurrencyTemplate } from '../../src/components/Input/stories/InputCurrency.template';
import { InputHighPrecisionNumbersTemplate } from '../../src/components/Input/stories/InputHighPrecisionNumbers.template';
import { InputKeyboardNavigationPlaygroundTemplate } from '../../src/components/Input/stories/InputKeyboardNavigationPlayground.template';
import { InputNativeFormPlaygroundTemplate } from '../../src/components/Input/stories/InputNativeFormPlayground.template';
import { InputPasswordTemplate } from '../../src/components/Input/stories/InputPassword.template';
import { InputPlaygroundTemplate } from '../../src/components/Input/stories/InputPlayground.template';
import { InputReadOnlyDataMaskingTemplate } from '../../src/components/Input/stories/InputReadOnlyDataMasking.template';

const defaultArgs: InputProps = {
  placeholder: 'Input',
};

export const inputScenarios: PlaygroundScenario[] = [
  {
    id: 'input/default',
    title: 'Input Default',
    render: () => <InputPlaygroundTemplate {...defaultArgs} data-testid="input" />,
  },
  {
    id: 'input/clear-icon',
    title: 'Input Clear Icon',
    render: () => (
      <InputPlaygroundTemplate {...defaultArgs} data-testid="input" defaultValue="Input value" showClearIcon />
    ),
  },
  {
    id: 'input/cursor-zones',
    title: 'Input Cursor Zones',
    render: () => (
      <InputPlaygroundTemplate
        {...defaultArgs}
        data-testid="input"
        prefix={<span data-testid="prefix">Prefix</span>}
        iconsBefore={<SystemSearchOutline data-testid="before-icon" aria-hidden />}
        iconsAfter={
          <InputIconButton data-testid="after-icon" aria-label="Действие с полем">
            <SystemSearchOutline aria-hidden />
          </InputIconButton>
        }
        suffix={<span data-testid="suffix">Suffix</span>}
      />
    ),
  },
  {
    id: 'input/keyboard-navigation',
    title: 'Input Keyboard Navigation',
    render: () => <InputKeyboardNavigationPlaygroundTemplate />,
  },
  {
    id: 'input/native-form',
    title: 'Input Native Form',
    render: () => <InputNativeFormPlaygroundTemplate />,
  },
  {
    id: 'input/currency',
    title: 'Input Currency',
    render: () => <InputCurrencyTemplate {...defaultArgs} />,
  },
  {
    id: 'input/high-precision-numbers',
    title: 'Input High Precision Numbers',
    render: () => <InputHighPrecisionNumbersTemplate {...defaultArgs} />,
  },
  {
    id: 'input/password-read-only',
    title: 'Password Input Read Only',
    render: () => <InputPasswordTemplate {...defaultArgs} defaultValue="123456" readOnly />,
  },
  {
    id: 'input/read-only-data-masking',
    title: 'Input Read Only Data Masking',
    render: () => <InputReadOnlyDataMaskingTemplate {...defaultArgs} />,
  },
];

import type { PlaygroundScenario } from './index';
import { InputSliderRangeControlledTemplate } from '../../src/components/InputSliderRange/stories/InputSliderRangeControlled.template';
import { InputSliderRangeCurrencyTemplate } from '../../src/components/InputSliderRange/stories/InputSliderRangeCurrency.template';
import { InputSliderRangeFormItemTemplate } from '../../src/components/InputSliderRange/stories/InputSliderRangeFormItem.template';
import { InputSliderRangeNativeFormTemplate } from '../../src/components/InputSliderRange/stories/InputSliderRangeNativeForm.template';
import { InputSliderRangePlaygroundTemplate } from '../../src/components/InputSliderRange/stories/InputSliderRangePlayground.template';

export const inputSliderRangeScenarios: PlaygroundScenario[] = [
  {
    id: 'input-slider-range/default',
    title: 'InputSliderRange Default',
    render: () => <InputSliderRangePlaygroundTemplate defaultValue={['25', '75']} data-testid="input-slider-range" />,
  },
  {
    id: 'input-slider-range/controlled',
    title: 'InputSliderRange Controlled',
    render: () => <InputSliderRangeControlledTemplate />,
  },
  {
    id: 'input-slider-range/currency',
    title: 'InputSliderRange Currency',
    render: () => <InputSliderRangeCurrencyTemplate />,
  },
  {
    id: 'input-slider-range/form-item',
    title: 'InputSliderRange FormItem',
    render: () => <InputSliderRangeFormItemTemplate defaultValue={['25', '75']} required />,
  },
  {
    id: 'input-slider-range/native-form',
    title: 'InputSliderRange Native Form',
    render: () => <InputSliderRangeNativeFormTemplate />,
  },
];

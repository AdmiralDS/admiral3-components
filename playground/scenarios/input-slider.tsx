import type { PlaygroundScenario } from './index';
import { InputSliderControlledTemplate } from '../../src/components/InputSlider/stories/InputSliderControlled.template';
import { InputSliderCurrencyTemplate } from '../../src/components/InputSlider/stories/InputSliderCurrency.template';
import { InputSliderFormItemTemplate } from '../../src/components/InputSlider/stories/InputSliderFormItem.template';
import { InputSliderMarksTemplate } from '../../src/components/InputSlider/stories/InputSliderMarks.template';
import { InputSliderNativeFormTemplate } from '../../src/components/InputSlider/stories/InputSliderNativeForm.template';
import { InputSliderPlaygroundTemplate } from '../../src/components/InputSlider/stories/InputSliderPlayground.template';

export const inputSliderScenarios: PlaygroundScenario[] = [
  {
    id: 'input-slider/maskito',
    title: 'InputSlider Currency Mask',
    render: () => <InputSliderCurrencyTemplate />,
  },
  {
    id: 'input-slider/default',
    title: 'InputSlider Default',
    render: () => <InputSliderPlaygroundTemplate defaultValue="50" inputProps={{ showClearIcon: true }} />,
  },
  {
    id: 'input-slider/controlled',
    title: 'InputSlider Controlled',
    render: () => <InputSliderControlledTemplate />,
  },
  {
    id: 'input-slider/marks',
    title: 'InputSlider Marks',
    render: () => <InputSliderMarksTemplate />,
  },
  {
    id: 'input-slider/form-item',
    title: 'InputSlider FormItem',
    render: () => <InputSliderFormItemTemplate defaultValue="50" />,
  },
  {
    id: 'input-slider/native-form',
    title: 'InputSlider Native Form',
    render: () => <InputSliderNativeFormTemplate />,
  },
];

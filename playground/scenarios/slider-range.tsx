import type { PlaygroundScenario } from './index';
import { SliderRangeKeyboardTemplate } from '../../src/components/SliderRange/stories/SliderRangeKeyboard.template';
import { SliderRangeStoryControlledTemplate as SliderRangeControlledTemplate } from '../../src/components/SliderRange/stories/SliderRangeStoryControlled.template';
import { SliderRangeStoryNativeFormTemplate as SliderRangeNativeFormTemplate } from '../../src/components/SliderRange/stories/SliderRangeStoryNativeForm.template';
import { SliderRangeStoryPlaygroundTemplate as SliderRangePlaygroundTemplate } from '../../src/components/SliderRange/stories/SliderRangeStoryPlayground.template';

export const sliderRangeScenarios: PlaygroundScenario[] = [
  {
    id: 'slider-range/controlled-touch',
    title: 'SliderRange Controlled Touch',
    render: () => (
      <SliderRangeControlledTemplate
        label="Сумма"
        showTooltip
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
      />
    ),
  },
  {
    id: 'slider-range/keyboard-disabled',
    title: 'SliderRange Disabled Keyboard Navigation',
    render: () => (
      <SliderRangeKeyboardTemplate
        label="Сумма"
        defaultValue={[20, 40]}
        disabled
        showTooltip
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        data-testid="slider-range"
      />
    ),
  },
  {
    id: 'slider-range/keyboard',
    title: 'SliderRange Keyboard Navigation',
    render: () => (
      <SliderRangeKeyboardTemplate
        label="Сумма"
        defaultValue={[20, 40]}
        step={5}
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        data-testid="slider-range"
      />
    ),
  },
  {
    id: 'slider-range/renderers',
    title: 'SliderRange Renderers',
    render: () => (
      <SliderRangePlaygroundTemplate
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        label="Сумма"
        defaultValue={[25, 75]}
        renderValue={(value) => <strong>{value} ₽</strong>}
        renderMarks={(value) => (value === 0 ? null : <span>{value} ₽</span>)}
        showTooltip
        data-testid="slider-range"
      />
    ),
  },
  {
    id: 'slider-range/renderers-hidden',
    title: 'SliderRange Hidden Renderers',
    render: () => (
      <SliderRangePlaygroundTemplate
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        label="Сумма"
        defaultValue={[25, 75]}
        renderValue={null}
        renderMarks={null}
        showTooltip
        data-testid="slider-range"
      />
    ),
  },
  {
    id: 'slider-range/default',
    title: 'SliderRange Default',
    render: () => (
      <SliderRangePlaygroundTemplate
        label="Сумма"
        defaultValue={[25, 75]}
        lowerNativeSliderProps={{
          'aria-label': 'Минимальная сумма',
          onFocus: (event) => {
            event.currentTarget.dataset.focusHandled = 'true';
          },
        }}
        upperNativeSliderProps={{
          'aria-label': 'Максимальная сумма',
          onFocus: (event) => {
            event.currentTarget.dataset.focusHandled = 'true';
          },
        }}
        data-testid="slider-range"
      />
    ),
  },
  {
    id: 'slider-range/form',
    title: 'SliderRange Native Form',
    render: () => (
      <SliderRangeNativeFormTemplate
        label="Сумма"
        lowerNativeSliderProps={{ 'aria-label': 'Минимальная сумма' }}
        upperNativeSliderProps={{ 'aria-label': 'Максимальная сумма' }}
        data-testid="slider-range"
      />
    ),
  },
];

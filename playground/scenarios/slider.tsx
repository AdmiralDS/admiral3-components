import type { PlaygroundScenario } from './index';
import { SliderResponsiveTemplate } from './SliderResponsive.template';
import { SliderStoryControlledTemplate as SliderControlledTemplate } from '../../src/components/Slider/stories/SliderStoryControlled.template';
import { SliderStoryKeyboardTemplate as SliderKeyboardNavigationTemplate } from '../../src/components/Slider/stories/SliderStoryKeyboard.template';
import { SliderStoryNativeFormTemplate as SliderNativeFormTemplate } from '../../src/components/Slider/stories/SliderStoryNativeForm.template';
import { SliderStoryPlaygroundTemplate as SliderPlaygroundTemplate } from '../../src/components/Slider/stories/SliderStoryPlayground.template';

export const sliderScenarios: PlaygroundScenario[] = [
  { id: 'slider/responsive', title: 'Slider Responsive Layout', render: SliderResponsiveTemplate },
  {
    id: 'slider/renderers',
    title: 'Slider Renderers',
    render: () => (
      <SliderPlaygroundTemplate
        label="Сумма"
        marks={[25, 75]}
        defaultValue={25}
        renderValue={(value) => <strong>{value} ₽</strong>}
        renderMarks={(value) => (value === 0 || value === 100 ? null : <span>{value} ₽</span>)}
        showTooltip
        data-testid="slider"
      />
    ),
  },
  {
    id: 'slider/renderers-hidden',
    title: 'Slider Hidden Renderers',
    render: () => (
      <SliderPlaygroundTemplate
        label="Сумма"
        marks={[25, 75]}
        defaultValue={25}
        renderValue={null}
        renderMarks={null}
        showTooltip
        data-testid="slider"
      />
    ),
  },
  {
    id: 'slider/restricted',
    title: 'Slider Restricted Marks',
    render: () => (
      <SliderPlaygroundTemplate label="Шкала" marks={[0, 10, 40, 70, 100]} defaultValue={40} data-testid="slider" />
    ),
  },
  { id: 'slider/form', title: 'Slider Native Form', render: () => <SliderNativeFormTemplate data-testid="slider" /> },
  {
    id: 'slider/keyboard',
    title: 'Slider Keyboard Navigation',
    render: () => <SliderKeyboardNavigationTemplate step={5} data-testid="slider" />,
  },
  {
    id: 'slider/keyboard-disabled',
    title: 'Slider Disabled Keyboard Navigation',
    render: () => <SliderKeyboardNavigationTemplate disabled showTooltip data-testid="slider" />,
  },
  {
    id: 'slider/keyboard-steps',
    title: 'Slider Steps Keyboard Navigation',
    render: () => <SliderKeyboardNavigationTemplate marks={[0, 25, 50, 75, 100]} data-testid="slider" />,
  },
  {
    id: 'slider/default',
    title: 'Slider Default',
    render: () => <SliderPlaygroundTemplate label="Громкость" defaultValue={50} data-testid="slider" />,
  },
  {
    id: 'slider/controlled',
    title: 'Slider Controlled',
    render: () => <SliderControlledTemplate data-testid="slider" />,
  },
  {
    id: 'slider/tooltip',
    title: 'Slider Tooltip',
    render: () => <SliderPlaygroundTemplate label="Громкость" defaultValue={50} showTooltip data-testid="slider" />,
  },
  {
    id: 'slider/disabled',
    title: 'Slider Disabled',
    render: () => <SliderPlaygroundTemplate label="Громкость" defaultValue={50} disabled data-testid="slider" />,
  },
];

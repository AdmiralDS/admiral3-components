import type { PlaygroundScenario } from './index';
import { TextAreaAutoHeightTemplate } from '../../src/components/TextArea/stories/TextAreaAutoHeight.template';
import { TextAreaControlledTemplate } from '../../src/components/TextArea/stories/TextAreaControlled.template';
import { TextAreaCopyTemplate } from '../../src/components/TextArea/stories/TextAreaCopy.template';
import { TextAreaNativeFormTemplate } from '../../src/components/TextArea/stories/TextAreaNativeForm.template';
import { TextAreaPlaygroundTemplate } from '../../src/components/TextArea/stories/TextAreaPlayground.template';
import { TextAreaResizeTemplate } from '../../src/components/TextArea/stories/TextAreaResize.template';

export const textAreaScenarios: PlaygroundScenario[] = [
  {
    id: 'text-area/default',
    title: 'TextArea Default',
    render: () => <TextAreaPlaygroundTemplate data-testid="text-area" placeholder="Введите текст" showClearIcon />,
  },
  {
    id: 'text-area/auto-height',
    title: 'TextArea Auto height',
    render: () => <TextAreaAutoHeightTemplate autoHeight minRows={2} maxRows={4} showClearIcon />,
  },
  {
    id: 'text-area/resize',
    title: 'TextArea Resize',
    render: () => <TextAreaResizeTemplate resize minRows={2} maxRows={5} />,
  },
  {
    id: 'text-area/copy',
    title: 'TextArea Copy',
    render: () => <TextAreaCopyTemplate defaultValue="Текст для копирования" showCopyIcon readOnly />,
  },
  { id: 'text-area/native-form', title: 'TextArea Native form', render: TextAreaNativeFormTemplate },
  { id: 'text-area/controlled', title: 'TextArea Controlled', render: TextAreaControlledTemplate },
];

import { ServiceCheckOutline } from '@admiral-ds/admiral3-icons';

import type { ButtonProps } from '@admiral-ds/admiral3-components';

import type { PlaygroundScenario } from './index';
import { ButtonDirtyTemplate } from '../../src/components/Button/stories/ButtonDirty.template';

const defaultArgs: ButtonProps = {
  children: 'Button',
  appearance: 'solid',
  colorMode: 'colored',
  dimension: 'm',
};

const customColorConfig: ButtonProps['colorConfig'] = {
  borderColor: 'var(--admiral-color-error-stroke-1-rest)',
  textColor: 'var(--admiral-color-error-text-1-rest)',
};

export const buttonScenarios: PlaygroundScenario[] = [
  {
    id: 'button/default',
    title: 'Button Default',
    render: () => <ButtonDirtyTemplate {...defaultArgs} data-testid="button" />,
  },
  {
    id: 'button/styling/solid',
    title: 'Button Solid',
    render: () => <ButtonDirtyTemplate {...defaultArgs} dimension="s" data-testid="button" />,
  },
  {
    id: 'button/styling/colorConfig',
    title: 'Button Outline with Custom Colors',
    render: () => (
      <ButtonDirtyTemplate {...defaultArgs} appearance="outline" colorConfig={customColorConfig} data-testid="button" />
    ),
  },
  {
    id: 'button/fallback',
    title: 'Button with appearance fallback',
    render: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ButtonDirtyTemplate {...defaultArgs} colorMode={'staticWhite' as any} data-testid="button" />;
    },
  },
  {
    id: 'button/state/loading',
    title: 'Button Loading',
    render: () => <ButtonDirtyTemplate {...defaultArgs} loading data-testid="button" />,
  },
  {
    id: 'button/content/custom-icons',
    title: 'Button Custom Icon Sizes',
    render: () => (
      <>
        {(['l', 'm', 's', 'xs'] as const).map((dimension) => (
          <ButtonDirtyTemplate
            key={dimension}
            {...defaultArgs}
            dimension={dimension}
            data-testid={`button-icon-${dimension}`}
          >
            <ServiceCheckOutline data-testid={`button-custom-icon-${dimension}`} />
            Button
          </ButtonDirtyTemplate>
        ))}
      </>
    ),
  },
  {
    id: 'button/state/inactive',
    title: 'Inactive Button',
    render: () => <ButtonDirtyTemplate {...defaultArgs} inactive data-testid="button" />,
  },
];

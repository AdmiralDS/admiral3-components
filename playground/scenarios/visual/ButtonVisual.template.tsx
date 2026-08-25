import { ServiceCheckOutline } from '@admiral-ds/admiral3-icons';

import {
  Button,
  type ButtonAppearance,
  type ButtonColorConfig,
  type ButtonColorMode,
} from '@admiral-ds/admiral3-components';

import {
  VisualContrastSurface,
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLabel,
  VisualLayout,
  VisualSample,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import {
  BUTTON_APPEARANCES,
  BUTTON_COLOR_MODES,
  BUTTON_DIMENSIONS,
  BUTTON_LOADING_POSITIONS,
} from '../../../src/components/Button/constants';

const ERROR_COLOR_CONFIGS: Record<ButtonAppearance, ButtonColorConfig> = {
  solid: {
    backgroundColor: {
      rest: 'var(--admiral-color-error-base-1-rest)',
      hover: 'var(--admiral-color-error-base-1-hover)',
      press: 'var(--admiral-color-error-base-1-press)',
    },
  },
  flat: {
    backgroundColor: {
      rest: 'var(--admiral-color-error-base-3-rest)',
      hover: 'var(--admiral-color-error-base-3-hover)',
      press: 'var(--admiral-color-error-base-3-press)',
    },
    textColor: 'var(--admiral-color-error-text-1-rest)',
  },
  outline: {
    borderColor: 'var(--admiral-color-error-stroke-1-rest)',
    textColor: 'var(--admiral-color-error-text-1-rest)',
  },
  ghost: { textColor: 'var(--admiral-color-error-text-1-rest)' },
};

const SUCCESS_COLOR_CONFIGS: Record<ButtonAppearance, ButtonColorConfig> = {
  solid: {
    backgroundColor: {
      rest: 'var(--admiral-color-success-base-1-rest)',
      hover: 'var(--admiral-color-success-base-1-hover)',
      press: 'var(--admiral-color-success-base-1-press)',
    },
  },
  flat: {
    backgroundColor: {
      rest: 'var(--admiral-color-success-base-3-rest)',
      hover: 'var(--admiral-color-success-base-3-hover)',
      press: 'var(--admiral-color-success-base-3-press)',
    },
    textColor: 'var(--admiral-color-success-text-1-rest)',
  },
  outline: {
    borderColor: 'var(--admiral-color-success-stroke-1-rest)',
    textColor: 'var(--admiral-color-success-text-1-rest)',
  },
  ghost: { textColor: 'var(--admiral-color-success-text-1-rest)' },
};

const renderPresetAppearance = (appearance: ButtonAppearance) => {
  const colorModes =
    appearance === 'solid' || appearance === 'ghost'
      ? BUTTON_COLOR_MODES.filter((colorMode) => colorMode !== 'staticWhite')
      : BUTTON_COLOR_MODES;

  return colorModes.map((colorMode) => {
    const samples = (
      <VisualSamples>
        {BUTTON_DIMENSIONS.map((dimension) => (
          <VisualSample key={dimension}>
            <VisualLabel>{dimension}</VisualLabel>
            {appearance === 'solid' || appearance === 'ghost' ? (
              <Button
                appearance={appearance}
                colorMode={colorMode as Exclude<ButtonColorMode, 'staticWhite'>}
                dimension={dimension}
              >
                Button
              </Button>
            ) : (
              <Button appearance={appearance} colorMode={colorMode} dimension={dimension}>
                Button
              </Button>
            )}
          </VisualSample>
        ))}
      </VisualSamples>
    );

    return (
      <VisualGroup key={`${appearance}-${colorMode}`}>
        <VisualGroupTitle>
          {appearance} / {colorMode}
        </VisualGroupTitle>
        {colorMode === 'staticWhite' ? (
          <VisualContrastSurface data-admiral-theme="dark">{samples}</VisualContrastSurface>
        ) : (
          samples
        )}
      </VisualGroup>
    );
  });
};

const renderSemanticAppearance = (title: string, colorConfigs: Record<ButtonAppearance, ButtonColorConfig>) => (
  <VisualSection>
    <VisualTitle>{title}</VisualTitle>
    <VisualGroups>
      {BUTTON_APPEARANCES.map((appearance) => (
        <VisualGroup key={appearance}>
          <VisualGroupTitle>{appearance}</VisualGroupTitle>
          <VisualSamples>
            {BUTTON_DIMENSIONS.map((dimension) => (
              <VisualSample key={dimension}>
                <VisualLabel>{dimension}</VisualLabel>
                <Button appearance={appearance} colorConfig={colorConfigs[appearance]} dimension={dimension}>
                  {title}
                </Button>
              </VisualSample>
            ))}
          </VisualSamples>
        </VisualGroup>
      ))}
      {[
        {
          label: 'solid / icon left',
          content: (
            <>
              <ServiceCheckOutline />
              {title}
            </>
          ),
        },
        {
          label: 'solid / icon right',
          content: (
            <>
              {title}
              <ServiceCheckOutline />
            </>
          ),
        },
        {
          label: 'solid / icon only',
          content: <ServiceCheckOutline />,
          square: true,
        },
      ].map(({ label, content, square }) => (
        <VisualGroup key={label}>
          <VisualGroupTitle>{label}</VisualGroupTitle>
          <VisualSamples>
            {BUTTON_DIMENSIONS.map((dimension) => (
              <VisualSample key={dimension}>
                <VisualLabel>{dimension}</VisualLabel>
                <Button
                  appearance="solid"
                  colorConfig={colorConfigs.solid}
                  dimension={dimension}
                  square={square}
                  aria-label={square ? title : undefined}
                >
                  {content}
                </Button>
              </VisualSample>
            ))}
          </VisualSamples>
        </VisualGroup>
      ))}
    </VisualGroups>
  </VisualSection>
);

export const ButtonVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Preset appearances and color modes</VisualTitle>
      <VisualGroups>{BUTTON_APPEARANCES.flatMap(renderPresetAppearance)}</VisualGroups>
    </VisualSection>
    {renderSemanticAppearance('Error Button', ERROR_COLOR_CONFIGS)}
    {renderSemanticAppearance('Success Button', SUCCESS_COLOR_CONFIGS)}
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualGroups>
        {[
          {
            label: 'disabled',
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button disabled dimension={dimension}>
                Button
              </Button>
            ),
          },
          {
            label: 'inactive',
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button inactive dimension={dimension}>
                Button
              </Button>
            ),
          },
          {
            label: 'loading center',
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button loading dimension={dimension}>
                Button
              </Button>
            ),
          },
          ...BUTTON_LOADING_POSITIONS.map((loadingPosition) => ({
            label: `loading ${loadingPosition}`,
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button loading loadingPosition={loadingPosition} dimension={dimension}>
                Button
              </Button>
            ),
          })),
          {
            label: 'skeleton',
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button skeleton dimension={dimension}>
                Button
              </Button>
            ),
          },
          {
            label: 'square',
            render: (dimension: (typeof BUTTON_DIMENSIONS)[number]) => (
              <Button square dimension={dimension} aria-label="Square button">
                B
              </Button>
            ),
          },
        ].map(({ label, render }) => (
          <VisualGroup key={label}>
            <VisualGroupTitle>{label}</VisualGroupTitle>
            <VisualSamples>
              {BUTTON_DIMENSIONS.map((dimension) => (
                <VisualSample key={dimension}>
                  <VisualLabel>{dimension}</VisualLabel>
                  {render(dimension)}
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

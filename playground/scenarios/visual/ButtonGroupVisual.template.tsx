import { ServiceCheckOutline, ServiceShareOutline } from '@admiral-ds/admiral3-icons';

import { Badge, Button, ButtonGroup, type ButtonGroupColorConfig } from '@admiral-ds/admiral3-components';

import {
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
  BUTTON_GROUP_APPEARANCES,
  BUTTON_GROUP_COLOR_MODES,
  BUTTON_GROUP_DIMENSIONS,
} from '../../../src/components/ButtonGroup/constants';

const renderButtons = () => (
  <>
    <Button>Первый</Button>
    <Button>Второй</Button>
    <Button>Третий</Button>
  </>
);

const CUSTOM_COLOR_CONFIG: ButtonGroupColorConfig = {
  borderColor: 'var(--admiral-color-error-stroke-1-rest)',
  textColor: 'var(--admiral-color-error-text-1-rest)',
};

const renderAppearanceMatrix = () =>
  BUTTON_GROUP_APPEARANCES.flatMap((appearance) =>
    BUTTON_GROUP_COLOR_MODES.map((colorMode) => (
      <VisualGroup key={`${appearance}-${colorMode}`}>
        <VisualGroupTitle>
          {appearance} / {colorMode}
        </VisualGroupTitle>
        <VisualSamples>
          {BUTTON_GROUP_DIMENSIONS.map((dimension) => (
            <VisualSample key={dimension}>
              <VisualLabel>{dimension}</VisualLabel>
              <ButtonGroup
                appearance={appearance}
                colorMode={colorMode}
                dimension={dimension}
                aria-label={`${appearance}, ${colorMode}, ${dimension}`}
              >
                {renderButtons()}
              </ButtonGroup>
            </VisualSample>
          ))}
        </VisualSamples>
      </VisualGroup>
    )),
  );

const renderStateMatrix = () =>
  BUTTON_GROUP_APPEARANCES.flatMap((appearance) =>
    BUTTON_GROUP_COLOR_MODES.map((colorMode) => (
      <VisualGroup key={`${appearance}-${colorMode}`}>
        <VisualGroupTitle>
          {appearance} / {colorMode}
        </VisualGroupTitle>
        <VisualSamples>
          <VisualSample>
            <VisualLabel>disabled</VisualLabel>
            <ButtonGroup appearance={appearance} colorMode={colorMode} aria-label="Disabled state">
              <Button>Первый</Button>
              <Button disabled>Disabled</Button>
              <Button>Третий</Button>
            </ButtonGroup>
          </VisualSample>
          <VisualSample>
            <VisualLabel>inactive</VisualLabel>
            <ButtonGroup appearance={appearance} colorMode={colorMode} aria-label="Inactive state">
              <Button>Первый</Button>
              <Button inactive>Inactive</Button>
              <Button>Третий</Button>
            </ButtonGroup>
          </VisualSample>
          <VisualSample>
            <VisualLabel>loading</VisualLabel>
            <ButtonGroup appearance={appearance} colorMode={colorMode} aria-label="Loading state">
              <Button>Первый</Button>
              <Button loading>Loading</Button>
              <Button>Третий</Button>
            </ButtonGroup>
          </VisualSample>
        </VisualSamples>
      </VisualGroup>
    )),
  );

export const ButtonGroupVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes, appearances and color modes</VisualTitle>
      <VisualGroups>{renderAppearanceMatrix()}</VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualGroups>{renderStateMatrix()}</VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Content and edge cases</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>Icons before text</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <ButtonGroup aria-label="Icons before text">
                <Button>
                  <ServiceCheckOutline aria-hidden="true" focusable="false" /> Первый
                </Button>
                <Button>
                  <ServiceCheckOutline aria-hidden="true" focusable="false" /> Второй
                </Button>
                <Button>
                  <ServiceCheckOutline aria-hidden="true" focusable="false" /> Третий
                </Button>
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Icons after text</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <ButtonGroup aria-label="Icons after text">
                <Button>
                  Первый <ServiceShareOutline aria-hidden="true" focusable="false" />
                </Button>
                <Button>
                  Второй <ServiceShareOutline aria-hidden="true" focusable="false" />
                </Button>
                <Button>
                  Третий <ServiceShareOutline aria-hidden="true" focusable="false" />
                </Button>
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Badges</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <ButtonGroup aria-label="Badges">
                <Button>
                  Первый <Badge appearance="whiteStatic">5</Badge>
                </Button>
                <Button>
                  Второй <Badge appearance="whiteStatic">3</Badge>
                </Button>
                <Button>
                  Третий <Badge appearance="whiteStatic">8</Badge>
                </Button>
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Icon only</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <ButtonGroup aria-label="Icon only">
                <Button square aria-label="Подтвердить">
                  <ServiceCheckOutline aria-hidden="true" focusable="false" />
                </Button>
                <Button square aria-label="Поделиться">
                  <ServiceShareOutline aria-hidden="true" focusable="false" />
                </Button>
                <Button square aria-label="Завершить">
                  <ServiceCheckOutline aria-hidden="true" focusable="false" />
                </Button>
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Single and long content</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <VisualLabel>single</VisualLabel>
              <ButtonGroup aria-label="Single button">
                <Button>Одна Button</Button>
              </ButtonGroup>
            </VisualSample>
            <VisualSample>
              <VisualLabel>long labels</VisualLabel>
              <ButtonGroup appearance="outline" aria-label="Long labels">
                <Button>Сохранить документ</Button>
                <Button>Скопировать ссылку</Button>
                <Button>Удалить документ</Button>
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>Custom colors</VisualGroupTitle>
          <VisualSamples>
            <VisualSample>
              <ButtonGroup appearance="outline" colorConfig={CUSTOM_COLOR_CONFIG} aria-label="Custom colors">
                {renderButtons()}
              </ButtonGroup>
            </VisualSample>
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

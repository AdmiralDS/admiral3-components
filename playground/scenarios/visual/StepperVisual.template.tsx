import styled from 'styled-components';

import { Step, Stepper } from '@admiral-ds/admiral3-components';

import {
  VisualGroup,
  VisualGroups,
  VisualGroupTitle,
  VisualLayout,
  VisualSamples,
  VisualSection,
  VisualTitle,
} from './VisualLayout';
import {
  STEPPER_COLOR_MODES,
  STEPPER_DIMENSIONS,
  STEPPER_ORIENTATIONS,
} from '../../../src/components/Stepper/constants';

const HorizontalSample = styled.div`
  width: 760px;
  padding: 4px;
`;
const VerticalSample = styled.div`
  width: 240px;
  padding: 4px;
`;
const MobileSample = styled.div`
  width: 320px;
`;
const TruncatedSample = styled.div`
  width: 240px;
`;

export const StepperVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Dimensions, orientations, color modes and states</VisualTitle>
      <VisualGroups>
        {STEPPER_ORIENTATIONS.flatMap((orientation) =>
          STEPPER_DIMENSIONS.flatMap((dimension) =>
            STEPPER_COLOR_MODES.map((colorMode) => {
              const Sample = orientation === 'horizontal' ? HorizontalSample : VerticalSample;
              const id = `${orientation}-${dimension}-${colorMode}`;
              return (
                <VisualGroup key={id}>
                  <VisualGroupTitle>{id}</VisualGroupTitle>
                  <VisualSamples>
                    <Sample>
                      <Stepper
                        activeStep={1}
                        orientation={orientation}
                        dimension={dimension}
                        colorMode={colorMode}
                        onStepChange={() => undefined}
                        aria-label={id}
                        data-stepper-visual={id}
                      >
                        <Step label="Done" description="Completed step" completed />
                        <Step label="Active" description="Current step" />
                        <Step label="Next" description="Future step" />
                        <Step label="Disabled" description="Unavailable step" disabled />
                        <Step label="Error" description="Check data" status="error" />
                        <Step label="Warning" description="Review data" status="warning" />
                      </Stepper>
                    </Sample>
                  </VisualSamples>
                </VisualGroup>
              );
            }),
          ),
        )}
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Content, connectors and mobile</VisualTitle>
      <VisualGroups>
        {STEPPER_ORIENTATIONS.flatMap((orientation) =>
          STEPPER_DIMENSIONS.flatMap((dimension) =>
            STEPPER_COLOR_MODES.map((colorMode) => {
              const Sample = orientation === 'horizontal' ? HorizontalSample : VerticalSample;
              const id = `${orientation}-${dimension}-${colorMode}`;
              return (
                <VisualGroup key={id}>
                  <VisualGroupTitle>{id} / redo and final line</VisualGroupTitle>
                  <VisualSamples>
                    <Sample>
                      <Stepper
                        activeStep={1}
                        orientation={orientation}
                        dimension={dimension}
                        colorMode={colorMode}
                        showLastStepLine
                        data-stepper-redo={id}
                      >
                        <Step label="Completed" description="Completed step" completed />
                        <Step label="Redo" description="Editing again" redo />
                        <Step label="Still completed" description="Completed step" completed />
                      </Stepper>
                    </Sample>
                  </VisualSamples>
                </VisualGroup>
              );
            }),
          ),
        )}
        {([1, 2, 3] as const).map((lineClamp) => (
          <VisualGroup key={lineClamp}>
            <VisualGroupTitle>Truncation / {lineClamp} lines</VisualGroupTitle>
            <VisualSamples>
              <TruncatedSample>
                <Stepper activeStep={0} lineClamp={lineClamp}>
                  <Step
                    label="Длинный заголовок шага"
                    description="Подробное описание шага, которое не помещается в доступную ширину и сокращается многоточием."
                  />
                  <Step label="Далее" description="Описание" />
                </Stepper>
              </TruncatedSample>
            </VisualSamples>
          </VisualGroup>
        ))}
        <VisualGroup>
          <VisualGroupTitle>Mobile / current step inset</VisualGroupTitle>
          <VisualSamples>
            <MobileSample>
              <Stepper activeStep={2} mobile>
                {Array.from({ length: 6 }, (_, index) => (
                  <Step key={index} label={`Шаг ${index + 1}`} completed={index < 2} description="Описание шага" />
                ))}
              </Stepper>
            </MobileSample>
          </VisualSamples>
        </VisualGroup>
        {STEPPER_ORIENTATIONS.flatMap((orientation) =>
          STEPPER_DIMENSIONS.map((dimension) => (
            <VisualGroup key={`headless-${orientation}-${dimension}`}>
              <VisualGroupTitle>
                Without heading / {orientation} / {dimension}
              </VisualGroupTitle>
              <VisualSamples>
                <TruncatedSample>
                  <Stepper
                    activeStep={0}
                    orientation={orientation}
                    dimension={dimension}
                    stepWidth={192}
                    data-stepper-headless={`${orientation}-${dimension}`}
                  >
                    <Step description="Завершенный шаг. Вторая строка." />
                  </Stepper>
                </TruncatedSample>
              </VisualSamples>
            </VisualGroup>
          )),
        )}
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

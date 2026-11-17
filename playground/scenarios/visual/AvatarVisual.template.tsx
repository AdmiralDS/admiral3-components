import { SystemPersonOutline } from '@admiral-ds/admiral3-icons';

import { ACTIVITY_AVATAR_DIMENSIONS, AVATAR_DIMENSIONS, AVATAR_STATUSES } from '#src/components/Avatar/constants';

import { ActivityAvatar, Avatar, type AvatarProps } from '@admiral-ds/admiral3-components';

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
import avatarImage from '../../assets/avatar.svg';

const userName = 'Иван Иванов';
const icon = <SystemPersonOutline width="100%" height="100%" aria-hidden="true" focusable="false" />;
const contentVariants = [
  { label: 'initials', props: {} },
  { label: 'custom initials', props: { userInitials: 'АБ' } },
  { label: 'icon', props: { icon } },
  { label: 'image', props: { href: avatarImage } },
] satisfies { label: string; props: Omit<AvatarProps, 'userName' | 'dimension'> }[];

const renderPair = (props: Omit<AvatarProps, 'userName' | 'dimension'>) => (
  <>
    <VisualSample>
      <VisualLabel>Avatar</VisualLabel>
      <Avatar userName={userName} showTooltip={false} {...props} />
    </VisualSample>
    <VisualSample>
      <VisualLabel>ActivityAvatar</VisualLabel>
      <ActivityAvatar userName={userName} showTooltip={false} {...props} showActivityRing />
    </VisualSample>
  </>
);

export const AvatarVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      <VisualGroups>
        {AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={dimension}>
            <VisualGroupTitle>size {dimension}</VisualGroupTitle>
            <VisualSamples>
              <VisualSample>
                <VisualLabel>primary</VisualLabel>
                <Avatar userName={userName} dimension={dimension} appearance="primary" showTooltip={false} />
              </VisualSample>
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Activity ring by dimension</VisualTitle>
      <VisualGroups>
        {ACTIVITY_AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={dimension}>
            <VisualGroupTitle>size {dimension}</VisualGroupTitle>
            <VisualSamples>
              {[false, true].map((showActivityRing) => (
                <VisualSample key={String(showActivityRing)}>
                  <VisualLabel>ring {showActivityRing ? 'visible' : 'hidden'}</VisualLabel>
                  <ActivityAvatar
                    userName={userName}
                    dimension={dimension}
                    showActivityRing={showActivityRing}
                    showTooltip={false}
                  />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Preset statuses by dimension</VisualTitle>
      <VisualGroups>
        {AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={`avatar-${dimension}`}>
            <VisualGroupTitle>Avatar {dimension}</VisualGroupTitle>
            <VisualSamples>
              {AVATAR_STATUSES.map((status) => (
                <VisualSample key={status}>
                  <VisualLabel>{status}</VisualLabel>
                  <Avatar userName={userName} dimension={dimension} status={status} showTooltip={false} />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
        {ACTIVITY_AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={`activity-${dimension}`}>
            <VisualGroupTitle>ActivityAvatar {dimension}</VisualGroupTitle>
            <VisualSamples>
              {AVATAR_STATUSES.map((status) => (
                <VisualSample key={status}>
                  <VisualLabel>{status}</VisualLabel>
                  <ActivityAvatar
                    userName={userName}
                    dimension={dimension}
                    status={status}
                    showActivityRing
                    showTooltip={false}
                  />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Content by dimension</VisualTitle>
      <VisualGroups>
        {AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={`avatar-${dimension}`}>
            <VisualGroupTitle>Avatar {dimension}</VisualGroupTitle>
            <VisualSamples>
              {contentVariants.map(({ label, props }) => (
                <VisualSample key={label}>
                  <VisualLabel>{label}</VisualLabel>
                  <Avatar userName={userName} dimension={dimension} showTooltip={false} {...props} />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
        {ACTIVITY_AVATAR_DIMENSIONS.map((dimension) => (
          <VisualGroup key={`activity-${dimension}`}>
            <VisualGroupTitle>ActivityAvatar {dimension}</VisualGroupTitle>
            <VisualSamples>
              {contentVariants.map(({ label, props }) => (
                <VisualSample key={label}>
                  <VisualLabel>{label}</VisualLabel>
                  <ActivityAvatar
                    userName={userName}
                    dimension={dimension}
                    status="success"
                    showActivityRing
                    showTooltip={false}
                    {...props}
                  />
                </VisualSample>
              ))}
            </VisualSamples>
          </VisualGroup>
        ))}
      </VisualGroups>
    </VisualSection>

    <VisualSection>
      <VisualTitle>Custom appearance and status</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>custom colors</VisualGroupTitle>
          <VisualSamples>
            {renderPair({
              appearance: {
                backgroundColor: 'var(--admiral-color-purple-base-1-rest)',
                textColor: 'var(--admiral-color-neutral-text-static-white-1)',
              },
              status: { backgroundColor: 'var(--admiral-color-warning-base-1-rest)' },
            })}
          </VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualGroups>
        <VisualGroup>
          <VisualGroupTitle>passive</VisualGroupTitle>
          <VisualSamples>{renderPair({})}</VisualSamples>
        </VisualGroup>
        <VisualGroup>
          <VisualGroupTitle>active with status</VisualGroupTitle>
          <VisualSamples>{renderPair({ onClick: () => undefined, status: 'success' })}</VisualSamples>
        </VisualGroup>
      </VisualGroups>
    </VisualSection>
  </VisualLayout>
);

import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { cssToken } from '../../../src/theme/cssToken';

const neutralStrokeSubtle = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const neutralText1 = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);
const neutralText2 = cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest);
const neutralTextInverted = cssToken(
  '--admiral-color-neutral-text-inverted-rest',
  (theme) => theme.color.neutral.text.inverted.rest,
);
const neutralTextStaticWhite = cssToken(
  '--admiral-color-neutral-text-static-white-1',
  (theme) => theme.color.neutral.text.staticWhite._1,
);
const neutralBase1 = cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest);
const neutralBase2 = cssToken('--admiral-color-neutral-base-2-rest', (theme) => theme.color.neutral.base._2.rest);
const neutralBaseInverted = cssToken(
  '--admiral-color-neutral-base-inverted-rest',
  (theme) => theme.color.neutral.base.inverted.rest,
);
const primaryBase1 = cssToken('--admiral-color-primary-base-1-rest', (theme) => theme.color.primary.base._1.rest);

export const VisualLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
`;

export const VisualSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

export const VisualTitle = styled.h2`
  ${textStyles.header.h6}
  margin: 0;
`;

export const VisualVariants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
`;

export const VisualVariant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${neutralStrokeSubtle};
  border-radius: 4px;
`;

export const VisualVariantDark = styled(VisualVariant)`
  color: ${neutralText1};
  background: ${neutralBase1};
`;

export const VisualLabel = styled.span`
  ${textStyles.caption.caption1}
  color: ${neutralText2};
`;

export const VisualGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const VisualGroup = styled.div.attrs<{ 'data-visual-group': string }>({ 'data-visual-group': '' })`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid ${neutralStrokeSubtle};
  border-radius: 8px;
`;

export const VisualGroupTitle = styled.h3`
  ${textStyles.body.body2Short}
  margin: 0;
`;

export const VisualSamples = styled.div.attrs<{ 'data-visual-samples': string }>({ 'data-visual-samples': '' })`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-self: flex-start;
  gap: 20px;
  width: fit-content;
  max-width: 100%;
`;

export const VisualSample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

export const VisualContrastSurface = styled.div`
  padding: 12px;
  border-radius: 4px;
  background: ${neutralBase2};
`;

export const VisualInvertedSurface = styled(VisualContrastSurface)`
  background: ${neutralBaseInverted};

  ${VisualLabel} {
    color: ${neutralTextInverted};
  }
`;

export const VisualPrimarySurface = styled(VisualContrastSurface)`
  background: ${primaryBase1};

  ${VisualLabel} {
    color: ${neutralTextStaticWhite};
  }
`;

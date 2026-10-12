import type { ButtonHTMLAttributes } from 'react';

import styled from 'styled-components';

import { HINT_CLOSE_BUTTON } from './constants';
import type { HintCloseButtonProps } from './types';
import { cssToken } from '../../theme/cssToken';
import { ClearInputIconButton } from '../_internal/InputAtoms';

const CloseButton = styled(ClearInputIconButton)`
  --admiral-input-icon-size: ${HINT_CLOSE_BUTTON.size}px;
  position: absolute;
  top: ${HINT_CLOSE_BUTTON.top}px;
  right: ${HINT_CLOSE_BUTTON.right}px;
  color: ${cssToken('--admiral-color-neutral-text-2-rest', (theme) => theme.color.neutral.text._2.rest)};
`;

type HintCloseButtonInternalProps = HintCloseButtonProps & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

// TODO: заменить временную ClearInputIconButton на CloseIconPlacementButton после появления компонента в admiral3-components.
export const HintCloseButton = (props: HintCloseButtonInternalProps) => <CloseButton aria-label="Закрыть" {...props} />;

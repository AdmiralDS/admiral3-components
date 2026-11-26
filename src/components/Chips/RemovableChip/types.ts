import type { HTMLAttributes } from 'react';

import type { ChipBaseProps } from '../types';

export interface RemovableChipProps extends Omit<ChipBaseProps, 'iconsAfter' | 'disabled' | 'readOnly'> {
  /** Обработчик удаления. */
  onClose: () => void;
  /** Отключённое состояние. Блокирует onClick, onKeyDown и onClose. */
  disabled?: boolean;
  /** Props кнопки закрытия. */
  closeButtonProps?: HTMLAttributes<SVGSVGElement>;
  /** Режим только для чтения. Блокирует onClick, onKeyDown и onClose, а также скрывает иконку удаления. */
  readOnly?: boolean;
}

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import {
  ServiceCheckSolid,
  ServiceShareSolid,
  SystemChevronDownOutline,
  SystemPersonSolid,
  SystemStarSolid,
  SystemTimeSolid,
} from '@admiral-ds/admiral3-icons';
import { textStyles } from '@admiral-ds/admiral3-tokens';
import styled from 'styled-components';

import { Pill, Pills, type PillAppearance, type PillsProps } from '@admiral-ds/admiral3-components';

import { cssToken } from '../../../theme/cssToken';
import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';
import { pillBorderRadius } from '../style';

interface Segment {
  label: string;
  appearance: PillAppearance;
  icon?: ReactNode;
  hasMenu?: boolean;
}

const SEGMENTS: ReadonlyArray<Segment> = [
  {
    label: 'First',
    appearance: 'error1',
    hasMenu: true,
    icon: <SystemPersonSolid aria-hidden="true" focusable="false" />,
  },
  { label: 'Second', appearance: 'neutral2', icon: <SystemStarSolid aria-hidden="true" focusable="false" /> },
  { label: 'Third', appearance: 'info1', icon: <SystemTimeSolid aria-hidden="true" focusable="false" /> },
  {
    label: 'Fourth',
    appearance: 'success1',
    icon: <ServiceCheckSolid aria-hidden="true" focusable="false" />,
  },
  {
    label: 'Fifth',
    appearance: 'warning1',
    icon: <ServiceShareSolid aria-hidden="true" focusable="false" />,
  },
];

const MENU_OPTIONS = ['Option one', 'Option two', 'Option three'] as const;

const menuBackground = cssToken('--admiral-color-neutral-base-1-rest', (theme) => theme.color.neutral.base._1.rest);
const menuItemHover = cssToken('--admiral-color-neutral-base-2-rest', (theme) => theme.color.neutral.base._2.rest);
const menuBorder = cssToken(
  '--admiral-color-neutral-stroke-subtle-rest',
  (theme) => theme.color.neutral.stroke.subtle.rest,
);
const menuText = cssToken('--admiral-color-neutral-text-1-rest', (theme) => theme.color.neutral.text._1.rest);

const KeyboardExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const BoundaryButton = styled.button`
  ${textStyles.body.body2Short}
  padding: 4px 8px;
`;

const ToolbarWrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  z-index: 1;
  top: calc(100% + 8px);
  left: 0;
  box-sizing: border-box;
  min-width: 160px;
  padding: 4px 0;
  border: 1px solid ${menuBorder};
  border-radius: ${pillBorderRadius};
  background: ${menuBackground};
  color: ${menuText};
`;

const MenuItem = styled.button`
  ${textStyles.body.body2Short}
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${menuItemHover};
  }
`;

export const PillsKeyboardNavigationTemplate = (args: PillsProps) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenuIndex !== null) {
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }
  }, [openMenuIndex]);

  const closeMenu = (restoreFocus = true) => {
    const triggerIndex = openMenuIndex;
    setOpenMenuIndex(null);

    if (restoreFocus && triggerIndex !== null) {
      triggerRefs.current[triggerIndex]?.focus();
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const currentIndex = items.indexOf(event.currentTarget);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[currentIndex === items.length - 1 ? 0 : currentIndex + 1]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[currentIndex === 0 ? items.length - 1 : currentIndex - 1]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items.at(-1)?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
    }
  };

  return (
    <StoryDemoContainer $direction="column" $gap="16px" $withBackground={false}>
      <StoryDemoDescription $textAlign="center">
        Tab переводит фокус на активный сегмент и следующим нажатием выводит его из группы. Стрелки{' '}
        <code>ArrowLeft</code> и <code>ArrowRight</code> перемещают фокус по кругу, <code>Home</code> и <code>End</code>{' '}
        — на первый и последний сегменты. <code>Enter</code>, <code>Space</code> и <code>ArrowDown</code> открывают меню
        только у сегментов, где оно предусмотрено. Открытое меню следует клавиатурным правилам Dropdown Menu.
      </StoryDemoDescription>
      <KeyboardExample>
        <BoundaryButton type="button" data-testid="before-pills-group">
          До группы
        </BoundaryButton>
        <ToolbarWrapper>
          <Pills connected {...args} aria-label="Статусы" data-testid="pills-keyboard-group">
            {SEGMENTS.map(({ label, appearance, icon, hasMenu }, index) => {
              const menuId = hasMenu ? `pills-menu-${index}` : undefined;
              const menuIsOpen = openMenuIndex === index;

              return (
                <Pill
                  key={label}
                  ref={(element) => {
                    triggerRefs.current[index] = element;
                  }}
                  appearance={appearance}
                  aria-haspopup={hasMenu ? 'menu' : undefined}
                  aria-expanded={hasMenu ? menuIsOpen : undefined}
                  aria-controls={menuId}
                  data-testid={`pills-segment-${index}`}
                  onClick={() => {
                    if (hasMenu) setOpenMenuIndex(index);
                  }}
                >
                  {icon}
                  {label}
                  {hasMenu && <SystemChevronDownOutline aria-hidden="true" focusable="false" />}
                </Pill>
              );
            })}
          </Pills>
          {openMenuIndex !== null && (
            <Menu ref={menuRef} id={`pills-menu-${openMenuIndex}`} role="menu" aria-label="Выбор статуса">
              {MENU_OPTIONS.map((option) => (
                <MenuItem
                  key={option}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => closeMenu()}
                  onKeyDown={handleMenuKeyDown}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          )}
        </ToolbarWrapper>
        <BoundaryButton type="button" data-testid="after-pills-group">
          После группы
        </BoundaryButton>
      </KeyboardExample>
    </StoryDemoContainer>
  );
};

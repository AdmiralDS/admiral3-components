import { Component, forwardRef, type ComponentPropsWithoutRef, type ForwardedRef } from 'react';

import { withTooltip, type WithTooltipProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

type ClassButtonProps = ComponentPropsWithoutRef<'button'> & {
  innerRef?: ForwardedRef<HTMLButtonElement>;
};

class ClassButton extends Component<ClassButtonProps> {
  render() {
    const { innerRef, children, type = 'button', ...props } = this.props;

    return (
      <button ref={innerRef} type={type} {...props}>
        {children}
      </button>
    );
  }
}

// Классовый компонент не может принять ref как обычный prop. Адаптер получает ref от withTooltip
// и передаёт его через innerRef на корневой HTML-элемент классового компонента.
const ClassButtonWithForwardedRef = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>((props, ref) => (
  <ClassButton {...props} innerRef={ref} />
));

const ClassButtonWithTooltip = withTooltip(ClassButtonWithForwardedRef);

export const WithTooltipClassComponentTemplate = (props: WithTooltipProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Классовый компонент не принимает специальный React-атрибут <code>ref</code> как обычный prop. Поэтому между ним и{' '}
      <code>withTooltip</code> нужен адаптер на основе <code>forwardRef</code>: он получает ref и передаёт его через{' '}
      <code>innerRef</code> корневому HTML-элементу.
    </StoryDemoDescription>
    <ClassButtonWithTooltip
      {...props}
      renderContent={() => 'Пример использования withTooltip с классовым компонентом.'}
    >
      Классовый компонент
    </ClassButtonWithTooltip>
  </StoryDemoContainer>
);

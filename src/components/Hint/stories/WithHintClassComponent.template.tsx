import { Component, forwardRef, type ComponentPropsWithoutRef, type ForwardedRef } from 'react';

import { withHint, type WithHintProps } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

type ClassButtonProps = ComponentPropsWithoutRef<'button'> & { innerRef?: ForwardedRef<HTMLButtonElement> };

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

const ClassButtonWithForwardedRef = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>((props, ref) => (
  <ClassButton {...props} innerRef={ref} />
));
const ClassButtonWithHint = withHint(ClassButtonWithForwardedRef);

export const WithHintClassComponentTemplate = (props: WithHintProps) => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Классовый компонент не принимает <code>ref</code> как обычный prop. Адаптер на основе <code>forwardRef</code>{' '}
      получает ref от <code>withHint</code> и передаёт его через <code>innerRef</code> корневому HTML-элементу.
    </StoryDemoDescription>
    <ClassButtonWithHint {...props}>Классовый компонент</ClassButtonWithHint>
  </StoryDemoContainer>
);

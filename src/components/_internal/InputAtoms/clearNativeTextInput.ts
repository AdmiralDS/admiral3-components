export type NativeTextInput = HTMLInputElement | HTMLTextAreaElement;

export const clearNativeTextInput = (control: NativeTextInput) => {
  const nativeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(control), 'value')?.set;

  nativeValueSetter?.call(control, '');
  control.dispatchEvent(new Event('input', { bubbles: true }));
  control.focus();
};

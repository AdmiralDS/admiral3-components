import styled from 'styled-components';

import { Input, type InputProps } from '@admiral-ds/admiral3-components';

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputEmailAndUrlTemplate = (args: InputProps) => (
  <InputsContainer>
    <Input
      {...args}
      type="email"
      name="email"
      placeholder="name@example.com"
      autoComplete="email"
      aria-label="Электронная почта"
    />
    <Input
      {...args}
      type="url"
      name="url"
      placeholder="https://example.com"
      autoComplete="url"
      aria-label="Адрес сайта"
    />
  </InputsContainer>
);

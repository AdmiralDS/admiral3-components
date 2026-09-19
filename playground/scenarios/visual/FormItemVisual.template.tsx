import styled from 'styled-components';

import { FormItem, Input } from '@admiral-ds/admiral3-components';

import { VisualLabel, VisualLayout, VisualSample, VisualSamples, VisualSection, VisualTitle } from './VisualLayout';
import { FORM_ITEM_DIMENSIONS } from '../../../src/components/FormItem/constants';

const ContentSample = styled(VisualSample)`
  width: 240px;
  align-items: stretch;
`;

export const FormItemVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      <VisualSamples>
        {FORM_ITEM_DIMENSIONS.map((dimension) => (
          <VisualSample key={dimension}>
            <VisualLabel>{dimension}</VisualLabel>
            <FormItem
              dimension={dimension}
              label="Подпись"
              additionalLabel="Дополнение"
              description="Дополнительный текст"
            >
              <Input dimension={dimension} placeholder="Введите значение" />
            </FormItem>
          </VisualSample>
        ))}
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>States</VisualTitle>
      <VisualSamples>
        <VisualSample>
          <VisualLabel>required</VisualLabel>
          <FormItem label="Подпись" required>
            <Input required />
          </FormItem>
        </VisualSample>
        <VisualSample>
          <VisualLabel>disabled</VisualLabel>
          <FormItem label="Подпись" additionalLabel="Дополнение" description="Дополнительный текст" disabled>
            <Input disabled />
          </FormItem>
        </VisualSample>
        <VisualSample>
          <VisualLabel>error</VisualLabel>
          <FormItem label="Подпись" status="error" description="Сообщение об ошибке">
            <Input status="error" defaultValue="Неверное значение" />
          </FormItem>
        </VisualSample>
        <VisualSample>
          <VisualLabel>success</VisualLabel>
          <FormItem label="Подпись" status="success" description="Значение принято">
            <Input status="success" defaultValue="Верное значение" />
          </FormItem>
        </VisualSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Content</VisualTitle>
      <VisualSamples>
        <ContentSample>
          <VisualLabel>long label</VisualLabel>
          <FormItem
            label="ОченьДлинноеНазваниеПоляБезПробеловОченьДлинноеНазваниеПоляБезПробелов"
            additionalLabel="Дополнение"
          >
            <Input />
          </FormItem>
        </ContentSample>
        <ContentSample>
          <VisualLabel>long description with counter</VisualLabel>
          <FormItem
            label="Подпись"
            description="https://example.org/very-long-address-without-spaces/very-long-address-without-spaces"
            maxLength={20}
          >
            <Input defaultValue="Пример названия!" />
          </FormItem>
        </ContentSample>
        <ContentSample>
          <VisualLabel>without label</VisualLabel>
          <FormItem description="Пояснение">
            <Input aria-label="Название" />
          </FormItem>
        </ContentSample>
      </VisualSamples>
    </VisualSection>
    <VisualSection>
      <VisualTitle>Disabled combinations</VisualTitle>
      <VisualSamples>
        {([undefined, 'error', 'success'] as const).map((status) => (
          <VisualSample key={status ?? 'default'}>
            <VisualLabel>{`required ${status ?? 'default'}`}</VisualLabel>
            <FormItem
              label="Подпись"
              additionalLabel="Дополнение"
              description="Пояснение"
              maxLength={20}
              status={status}
              required
              disabled
            >
              <Input status={status} required disabled defaultValue="Пример названия!" />
            </FormItem>
          </VisualSample>
        ))}
      </VisualSamples>
    </VisualSection>
  </VisualLayout>
);

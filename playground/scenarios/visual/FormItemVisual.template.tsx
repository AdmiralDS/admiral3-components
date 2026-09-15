import { FormItem, Input } from '@admiral-ds/admiral3-components';

import { VisualLabel, VisualLayout, VisualSample, VisualSamples, VisualSection, VisualTitle } from './VisualLayout';
import { FORM_ITEM_DIMENSIONS } from '../../../src/components/FormItem/constants';

export const FormItemVisualTemplate = () => (
  <VisualLayout>
    <VisualSection>
      <VisualTitle>Sizes and appearances</VisualTitle>
      <VisualSamples>
        {FORM_ITEM_DIMENSIONS.map((dimension) => (
          <VisualSample key={dimension}>
            <VisualLabel>{dimension}</VisualLabel>
            <FormItem dimension={dimension} label="Подпись" description="Дополнительный текст">
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
            <Input />
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
  </VisualLayout>
);

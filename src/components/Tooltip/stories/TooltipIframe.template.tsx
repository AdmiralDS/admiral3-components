import { type ReactNode, useCallback, useState } from 'react';

import admiralTokensCssUrl from '@admiral-ds/admiral3-tokens/css?url';
import { FontsVTBGroup } from '@admiral-ds/admiral3-tokens/fonts';
import { createPortal } from 'react-dom';
import styled, { StyleSheetManager } from 'styled-components';

import { Tooltip, Button, useTooltip } from '@admiral-ds/admiral3-components';

import { StoryDemoContainer, StoryDemoDescription } from '../../stories/StoryContainers';

type IframeTooltipProps = {
  redirectStyles: boolean;
};

type IframeStyleProviderProps = {
  children: ReactNode;
  targetDocument: Document;
  tokensStylesheetHref: string;
};

const IframeStyleProvider = ({ children, targetDocument, tokensStylesheetHref }: IframeStyleProviderProps) => (
  <>
    {createPortal(
      <>
        <link href={tokensStylesheetHref} rel="stylesheet" />
        <FontsVTBGroup />
      </>,
      targetDocument.head,
    )}
    <StyleSheetManager target={targetDocument.head}>{children}</StyleSheetManager>
  </>
);

const Comparison = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  inline-size: 100%;
`;

const Example = styled.div`
  display: grid;
  gap: 12px;
  min-inline-size: 0;
`;

const Frame = styled.iframe`
  inline-size: 100%;
  block-size: 220px;
  border: 1px solid #9aa9bc;
`;

const frameSource = `<!doctype html>
<html lang="ru">
  <head>
    <style>
      html, body { height: 100%; }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        margin: 0;
        padding: 32px;
        background: var(--admiral-color-neutral-base-2-rest, #f5f7f9);
      }
    </style>
  </head>
  <body></body>
</html>`;

const IframeTooltip = ({ redirectStyles }: IframeTooltipProps) => {
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const { isVisible, targetProps, tooltipProps } = useTooltip<HTMLButtonElement>();

  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIframeDocument(event.currentTarget.contentDocument);
  }, []);

  const tooltip = isVisible ? <Tooltip {...tooltipProps}>Tooltip отрисован в document iframe</Tooltip> : null;

  const iframeContent = (
    <>
      <StoryDemoDescription style={{ marginBottom: '16px' }}>
        {redirectStyles
          ? 'В iframe перенесены стили компонентов, CSS-токены и шрифт.'
          : 'Классы появятся в iframe, но их CSS останется в документе Storybook.'}
      </StoryDemoDescription>
      <Button {...targetProps}>Наведите указатель</Button>
      {tooltip}
    </>
  );

  const content = iframeDocument
    ? createPortal(
        redirectStyles ? (
          <IframeStyleProvider targetDocument={iframeDocument} tokensStylesheetHref={admiralTokensCssUrl}>
            {iframeContent}
          </IframeStyleProvider>
        ) : (
          iframeContent
        ),
        iframeDocument.body,
      )
    : null;

  return (
    <Example>
      <StoryDemoDescription>
        {redirectStyles ? 'С перенаправлением стилей' : 'Без перенаправления стилей'}
      </StoryDemoDescription>
      <Frame
        onLoad={handleLoad}
        srcDoc={frameSource}
        title={redirectStyles ? 'Iframe со стилями' : 'Iframe без стилей'}
      />
      {content}
    </Example>
  );
};

export const TooltipIframeTemplate = () => (
  <StoryDemoContainer $direction="column" $gap="24px">
    <StoryDemoDescription>
      Tooltip можно использовать для целевого элемента внутри same-origin iframe. При этом iframe является отдельным
      контекстом документа и не наследует стили React-приложения.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Если компоненты портируются из внешнего React-приложения, обязательно направьте их styled-components-правила в
      <code> head</code> iframe через <code>StyleSheetManager</code>. Без этого в iframe появятся только имена классов,
      а Tooltip потеряет оформление и корректное позиционирование. Глобальные ресурсы — CSS-переменные дизайн-токенов и
      шрифты — также подключаются отдельно. В примере это делает <code>IframeStyleProvider</code>.
    </StoryDemoDescription>
    <StoryDemoDescription>
      Настройки темы в примере не синхронизируются. Если приложение поддерживает смену темы, её атрибуты и другие
      глобальные настройки также необходимо передать в iframe.
    </StoryDemoDescription>
    <Comparison>
      <IframeTooltip redirectStyles={false} />
      <IframeTooltip redirectStyles />
    </Comparison>
  </StoryDemoContainer>
);

import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@excalidraw/excalidraw/index.css';
import { Excalidraw } from '@excalidraw/excalidraw';

interface ExcalidrawArticleData {
  elements: readonly any[];
  appState?: any;
  files?: Record<string, any>;
}

interface Props {
  articleData: ExcalidrawArticleData;
}

const ExcalidrawArticle: React.FC<Props> = ({ articleData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const initialData = useMemo(() => {
    const files = (articleData as any).files ?? {};
    const appState = {
      ...(articleData.appState || {}),
      theme: (articleData.appState && articleData.appState.theme) ? articleData.appState.theme : 'light',
    };

    const data = {
      elements: articleData.elements ?? [],
      appState,
      files,
      scrollToContent: true,
    } as any;

    return data;
  }, [articleData]);

  useEffect(() => {
    const el = containerRef.current;
    const parent = el?.parentElement as HTMLElement | null;

    const measure = () => {
      const width = parent?.getBoundingClientRect().width || window.innerWidth;
      if (width && width > 0) setContainerWidth(Math.floor(width));
    };

    // Logs de depuración
    // eslint-disable-next-line no-console
    console.log('[ExcalidrawArticle] elements:', Array.isArray(articleData?.elements) ? articleData.elements.length : 'no-array');
    // eslint-disable-next-line no-console
    console.log('[ExcalidrawArticle] has files:', !!(articleData as any)?.files);

    measure();
    const ro = parent ? new ResizeObserver(measure) : null;
    if (parent && ro) ro.observe(parent);

    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 200);

    return () => {
      if (ro && parent) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [articleData]);

  const styleWidth = containerWidth ? `${containerWidth}px` : '100vw';

  return (
    <div ref={containerRef} style={{ height: '85vh', width: styleWidth }}>
      <Excalidraw
        initialData={initialData}
        viewModeEnabled={true}
        zenModeEnabled={true}
        theme={initialData?.appState?.theme || 'light'}
        autoFocus={true}
      />
    </div>
  );
};

export default ExcalidrawArticle;

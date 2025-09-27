import React, { useEffect, useRef } from 'react';
import { exportToSvg } from '@excalidraw/excalidraw';

type ExcalData = {
  elements: any[];
  appState?: any;
  files?: Record<string, any> | null;
};

interface Props {
  data: string | ExcalData; // JSON string o objeto
  height?: number; // altura fija del viewport de preview
}

const ExcalPreview: React.FC<Props> = ({ data, height = 112 }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parsed: ExcalData = typeof data === 'string' ? JSON.parse(data || '{}') : data;
        const svg = await exportToSvg({
          elements: parsed?.elements || [],
          appState: { ...(parsed?.appState || {}), viewBackgroundColor: null },
          files: parsed?.files || null,
        });
        if (cancelled) return;
        // Ajustar al ancho, cortar por alto
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.pointerEvents = 'none';
        if (boxRef.current) boxRef.current.replaceChildren(svg);
      } catch {
        // noop
      }
    })();
    return () => { cancelled = true; };
  }, [data]);

  return (
    <div
      ref={boxRef}
      style={{ height }}
      className="w-full overflow-hidden bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800"
      data-excal
    />
  );
};

export default ExcalPreview;

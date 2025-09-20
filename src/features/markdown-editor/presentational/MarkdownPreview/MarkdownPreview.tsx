'use client';

import { useCallback, useRef, useEffect } from 'react';
import { parseMarkdown } from '../../lib/parser';
import styles from './MarkdownPreview.module.css';

interface MarkdownPreviewProps {
  markdown: string;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  scrollTop?: number;
  className?: string;
}

export const MarkdownPreview = ({
  markdown,
  onScroll,
  scrollTop,
  className,
}: MarkdownPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const htmlContent = parseMarkdown(markdown);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (onScroll) {
        const target = event.target as HTMLDivElement;
        onScroll(target.scrollTop, target.scrollHeight);
      }
    },
    [onScroll]
  );

  useEffect(() => {
    if (containerRef.current && typeof scrollTop === 'number') {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div
        ref={containerRef}
        className={styles.preview}
        onScroll={handleScroll}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
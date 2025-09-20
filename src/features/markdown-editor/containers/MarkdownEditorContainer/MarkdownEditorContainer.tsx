'use client';

import { useCallback } from 'react';
import { MarkdownInput } from '../../presentational/MarkdownInput';
import { MarkdownPreview } from '../../presentational/MarkdownPreview';
import { useMarkdownEditor } from './useMarkdownEditor';
import styles from './MarkdownEditorContainer.module.css';

interface MarkdownEditorContainerProps {
  initialMarkdown?: string;
  className?: string;
}

export const MarkdownEditorContainer = ({
  initialMarkdown = '',
  className,
}: MarkdownEditorContainerProps) => {
  const {
    markdown,
    htmlContent,
    setMarkdown,
    isProcessing,
  } = useMarkdownEditor(initialMarkdown);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
  }, [setMarkdown]);

  const handleInputScroll = useCallback((scrollTop: number, scrollHeight: number) => {
    // スクロール同期機能は後のフェーズで実装
  }, []);

  const handlePreviewScroll = useCallback((scrollTop: number, scrollHeight: number) => {
    // スクロール同期機能は後のフェーズで実装
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.inputSection}>
        <MarkdownInput
          value={markdown}
          onChange={handleMarkdownChange}
          onScroll={handleInputScroll}
          placeholder="マークダウンを入力してください..."
          disabled={isProcessing}
        />
      </div>
      
      <div className={styles.previewSection}>
        <MarkdownPreview
          markdown={markdown}
          onScroll={handlePreviewScroll}
        />
      </div>
      
      {isProcessing && (
        <div className={styles.processingIndicator}>
          処理中...
        </div>
      )}
    </div>
  );
};
'use client';

import { useState, useMemo, useCallback } from 'react';
import { parseMarkdown } from '../../lib/parser';

interface UseMarkdownEditorReturn {
  markdown: string;
  htmlContent: string;
  isPreviewMode: boolean;
  setMarkdown: (value: string) => void;
  togglePreviewMode: () => void;
  isProcessing: boolean;
}

export const useMarkdownEditor = (initialMarkdown = ''): UseMarkdownEditorReturn => {
  const [markdown, setMarkdownState] = useState<string>(initialMarkdown);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isProcessing] = useState<boolean>(false);

  const htmlContent = useMemo(() => {
    if (!markdown.trim()) {
      return '';
    }
    
    try {
      const result = parseMarkdown(markdown);
      return result;
    } catch (error) {
      console.error('Markdown processing error:', error);
      return '<p>マークダウンの処理中にエラーが発生しました。</p>';
    }
  }, [markdown]);

  const setMarkdown = useCallback((value: string) => {
    setMarkdownState(value);
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  return {
    markdown,
    htmlContent,
    isPreviewMode,
    setMarkdown,
    togglePreviewMode,
    isProcessing,
  };
};
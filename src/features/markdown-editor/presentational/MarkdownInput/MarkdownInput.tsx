'use client';

import { useCallback, useRef } from 'react';
import styles from './MarkdownInput.module.css';

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const MarkdownInput = ({
  value,
  onChange,
  onScroll,
  className,
  placeholder = 'マークダウンを入力してください...',
  disabled = false,
}: MarkdownInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
      
      onChange(newValue);
    },
    [onChange]
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLTextAreaElement>) => {
      if (onScroll) {
        const target = event.target as HTMLTextAreaElement;
        onScroll(target.scrollTop, target.scrollHeight);
      }
    },
    [onScroll]
  );

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.textarea}
        spellCheck={false}
        wrap="soft"
      />
    </div>
  );
};
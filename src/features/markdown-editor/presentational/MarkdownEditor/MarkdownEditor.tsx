'use client';

import { MarkdownEditorContainer } from '../../containers/MarkdownEditorContainer';
import styles from './MarkdownEditor.module.css';

interface MarkdownEditorProps {
  initialMarkdown?: string;
  className?: string;
}

export const MarkdownEditor = ({
  initialMarkdown = '',
  className,
}: MarkdownEditorProps) => {
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>マークダウンエディタ</h1>
        <div className={styles.info}>
          左側でマークダウンを入力すると、右側にプレビューが表示されます
        </div>
      </header>
      
      <main className={styles.main}>
        <MarkdownEditorContainer
          initialMarkdown={initialMarkdown}
          className={styles.editorContainer}
        />
      </main>
    </div>
  );
};
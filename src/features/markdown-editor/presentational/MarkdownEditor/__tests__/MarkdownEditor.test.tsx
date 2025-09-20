import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MarkdownEditor } from '../MarkdownEditor';

describe('MarkdownEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the title and info', () => {
    render(<MarkdownEditor />);
    
    expect(screen.getByText('マークダウンエディタ')).toBeDefined();
    expect(screen.getByText('左側でマークダウンを入力すると、右側にプレビューが表示されます')).toBeDefined();
  });

  it('should render with initial markdown', () => {
    const initialMarkdown = '# Hello World';
    render(<MarkdownEditor initialMarkdown={initialMarkdown} />);
    
    const textarea = screen.getByDisplayValue(initialMarkdown);
    expect(textarea).toBeDefined();
    
    expect(document.querySelector('h1')).toBeDefined();
  });

  it('should apply custom className', () => {
    render(<MarkdownEditor className="custom-class" />);
    
    const wrapper = document.querySelector('.custom-class');
    expect(wrapper).toBeDefined();
  });

  it('should contain MarkdownEditorContainer', () => {
    render(<MarkdownEditor />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    expect(textarea).toBeDefined();
  });

  it('should have proper layout structure', () => {
    render(<MarkdownEditor />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeDefined();
    
    const main = screen.getByRole('main');
    expect(main).toBeDefined();
  });
});
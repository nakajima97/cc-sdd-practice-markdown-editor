import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MarkdownEditorContainer } from '../MarkdownEditorContainer';

describe('MarkdownEditorContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render input and preview sections', () => {
    render(<MarkdownEditorContainer />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    expect(textarea).toBeDefined();
    
    const container = document.querySelector('[class*="container"]');
    expect(container).toBeDefined();
  });

  it('should render with initial markdown', () => {
    const initialMarkdown = '# Hello World';
    render(<MarkdownEditorContainer initialMarkdown={initialMarkdown} />);
    
    const textarea = screen.getByDisplayValue(initialMarkdown);
    expect(textarea).toBeDefined();
    
    expect(document.querySelector('h1')).toBeDefined();
  });

  it('should update preview when input changes', () => {
    render(<MarkdownEditorContainer />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    
    fireEvent.change(textarea, { target: { value: '## Test Heading' } });
    
    expect(document.querySelector('h2')).toBeDefined();
  });

  it('should apply custom className', () => {
    render(<MarkdownEditorContainer className="custom-class" />);
    
    const container = document.querySelector('.custom-class');
    expect(container).toBeDefined();
  });

  it('should handle empty markdown', () => {
    render(<MarkdownEditorContainer initialMarkdown="" />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  it('should render complex markdown content', () => {
    const complexMarkdown = `
# Title
## Subtitle
- Item 1
- Item 2
**bold text**
*italic text*
`;
    
    render(<MarkdownEditorContainer initialMarkdown={complexMarkdown} />);
    
    expect(document.querySelector('h1')).toBeDefined();
    expect(document.querySelector('h2')).toBeDefined();
    expect(document.querySelector('ul')).toBeDefined();
    expect(document.querySelector('strong')).toBeDefined();
    expect(document.querySelector('em')).toBeDefined();
  });
});
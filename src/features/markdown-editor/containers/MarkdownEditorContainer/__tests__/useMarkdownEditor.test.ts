import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMarkdownEditor } from '../useMarkdownEditor';

describe('useMarkdownEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMarkdownEditor());
    
    expect(result.current.markdown).toBe('');
    expect(result.current.htmlContent).toBe('');
    expect(result.current.isPreviewMode).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('should initialize with provided markdown', () => {
    const initialMarkdown = '# Hello World';
    const { result } = renderHook(() => useMarkdownEditor(initialMarkdown));
    
    expect(result.current.markdown).toBe(initialMarkdown);
    expect(result.current.htmlContent).toContain('<h1>Hello World</h1>');
  });

  it('should update markdown content', () => {
    const { result } = renderHook(() => useMarkdownEditor());
    
    act(() => {
      result.current.setMarkdown('## New Content');
    });
    
    expect(result.current.markdown).toBe('## New Content');
    expect(result.current.htmlContent).toContain('<h2>New Content</h2>');
  });

  it('should toggle preview mode', () => {
    const { result } = renderHook(() => useMarkdownEditor());
    
    expect(result.current.isPreviewMode).toBe(false);
    
    act(() => {
      result.current.togglePreviewMode();
    });
    
    expect(result.current.isPreviewMode).toBe(true);
    
    act(() => {
      result.current.togglePreviewMode();
    });
    
    expect(result.current.isPreviewMode).toBe(false);
  });

  it('should return empty html for empty markdown', () => {
    const { result } = renderHook(() => useMarkdownEditor(''));
    
    expect(result.current.htmlContent).toBe('');
  });

  it('should handle markdown parsing', () => {
    const { result } = renderHook(() => useMarkdownEditor());
    
    act(() => {
      result.current.setMarkdown('**bold** and *italic*');
    });
    
    expect(result.current.htmlContent).toContain('<strong>bold</strong>');
    expect(result.current.htmlContent).toContain('<em>italic</em>');
  });

  it('should handle complex markdown content', () => {
    const { result } = renderHook(() => useMarkdownEditor());
    
    const complexMarkdown = `
# Title
## Subtitle
- Item 1
- Item 2
\`\`\`javascript
const x = 1;
\`\`\`
`;

    act(() => {
      result.current.setMarkdown(complexMarkdown);
    });
    
    expect(result.current.htmlContent).toContain('<h1>Title</h1>');
    expect(result.current.htmlContent).toContain('<h2>Subtitle</h2>');
    expect(result.current.htmlContent).toContain('<ul>');
    expect(result.current.htmlContent).toContain('<pre>');
  });
});
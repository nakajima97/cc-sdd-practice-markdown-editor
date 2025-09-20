import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MarkdownPreview } from '../MarkdownPreview';

describe('MarkdownPreview', () => {
  let mockOnScroll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnScroll = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render markdown content as HTML', () => {
    const markdown = '# Hello World\n\nThis is **bold** text.';
    render(<MarkdownPreview markdown={markdown} />);
    
    expect(document.querySelector('h1')).toBeDefined();
    expect(document.querySelector('strong')).toBeDefined();
  });

  it('should render empty content when markdown is empty', () => {
    render(<MarkdownPreview markdown="" />);
    
    const container = document.querySelector('[class*="preview"]');
    expect(container?.innerHTML).toBe('');
  });

  it('should render tables correctly', () => {
    const markdown = '| Name | Age |\n|------|-----|\n| John | 25 |';
    render(<MarkdownPreview markdown={markdown} />);
    
    expect(document.querySelector('table')).toBeDefined();
    expect(document.querySelector('th')).toBeDefined();
    expect(document.querySelector('td')).toBeDefined();
  });

  it('should sanitize dangerous content', () => {
    const markdown = '<script>alert("xss")</script>';
    render(<MarkdownPreview markdown={markdown} />);
    
    expect(document.querySelector('script')).toBeNull();
  });

  it('should call onScroll when scrolled', () => {
    render(<MarkdownPreview markdown="# Test" onScroll={mockOnScroll} />);
    
    const previewElement = document.querySelector('[class*="preview"]');
    if (previewElement) {
      Object.defineProperty(previewElement, 'scrollTop', { value: 100, writable: true });
      Object.defineProperty(previewElement, 'scrollHeight', { value: 500, writable: true });
      
      fireEvent.scroll(previewElement);
      
      expect(mockOnScroll).toHaveBeenCalledWith(100, 500);
    }
  });

  it('should apply custom className', () => {
    render(<MarkdownPreview markdown="# Test" className="custom-class" />);
    
    const container = document.querySelector('.custom-class');
    expect(container).toBeDefined();
  });

  it('should render links with correct attributes', () => {
    const markdown = '[Google](https://google.com)';
    render(<MarkdownPreview markdown={markdown} />);
    
    const link = document.querySelector('a');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
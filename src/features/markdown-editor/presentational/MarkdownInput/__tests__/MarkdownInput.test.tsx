import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MarkdownInput } from '../MarkdownInput';

describe('MarkdownInput', () => {
  let mockOnChange: ReturnType<typeof vi.fn>;
  let mockOnScroll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnChange = vi.fn();
    mockOnScroll = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('should render textarea with correct placeholder', () => {
    render(<MarkdownInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    expect(textarea).toBeDefined();
  });

  it('should display the provided value', () => {
    const value = '# Hello World';
    render(<MarkdownInput value={value} onChange={mockOnChange} />);
    
    const textarea = screen.getByDisplayValue(value);
    expect(textarea).toBeDefined();
  });

  it('should call onChange when input changes', () => {
    render(<MarkdownInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    fireEvent.change(textarea, { target: { value: 'New content' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('New content');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MarkdownInput value="" onChange={mockOnChange} disabled={true} />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
  });

  it('should call onScroll when scrolled', () => {
    render(<MarkdownInput value="" onChange={mockOnChange} onScroll={mockOnScroll} />);
    
    const textarea = screen.getByPlaceholderText('マークダウンを入力してください...');
    Object.defineProperty(textarea, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(textarea, 'scrollHeight', { value: 500, writable: true });
    
    fireEvent.scroll(textarea);
    
    expect(mockOnScroll).toHaveBeenCalledWith(100, 500);
  });
});
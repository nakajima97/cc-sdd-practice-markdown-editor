import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../parser';

describe('parseMarkdown', () => {
  it('should parse basic markdown syntax', () => {
    const markdown = '# Hello\n\nThis is **bold** and *italic*.';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<h1>Hello</h1>');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('should parse lists', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
    expect(result).toContain('<li>Item 3</li>');
  });

  it('should parse code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<pre>');
    expect(result).toContain('class="language-javascript"');
    expect(result).toContain('const x = 1;');
  });

  it('should parse links', () => {
    const markdown = '[Google](https://google.com)';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<a href=');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('should parse GFM tables', () => {
    const markdown = '| Name | Age |\n|------|-----|\n| John | 25 |\n| Jane | 30 |';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<table>');
    expect(result).toContain('<thead>');
    expect(result).toContain('<tbody>');
    expect(result).toContain('<th>Name</th>');
    expect(result).toContain('<td>John</td>');
  });

  it('should parse strikethrough', () => {
    const markdown = '~~strikethrough~~';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<del>strikethrough</del>');
  });

  it('should sanitize dangerous scripts', () => {
    const markdown = '<script>alert("xss")</script>';
    const result = parseMarkdown(markdown);
    
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should handle empty input', () => {
    const result = parseMarkdown('');
    expect(result).toBe('');
  });

  it('should handle invalid markdown gracefully', () => {
    const markdown = '# Unclosed [link';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<h1>');
    expect(result).toContain('Unclosed [link');
  });

  it('should parse blockquotes', () => {
    const markdown = '> This is a quote';
    const result = parseMarkdown(markdown);
    
    expect(result).toContain('<blockquote>');
    expect(result).toContain('This is a quote');
  });
});
import { marked } from 'marked';

// markedの設定
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
});

// リンクレンダラーの設定（後処理で対応）
const processLinks = (html: string): string => {
  return html.replace(
    /<a\s+href="([^"]*)"([^>]*)>([^<]*)<\/a>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"$2>$3</a>'
  );
};

const sanitizeHtml = (html: string): string => {
  // サーバーサイドではサニタイゼーションをスキップ
  if (typeof window === 'undefined') {
    return html;
  }
  
  // クライアントサイドでDOMPurifyを動的にインポート
  try {
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'del', 'code',
        'pre', 'blockquote', 'ul', 'ol', 'li',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img', 'hr',
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'title',
        'src', 'alt', 'width', 'height',
        'class', 'id',
      ],
    });
  } catch (error) {
    console.warn('DOMPurify not available, skipping sanitization');
    return html;
  }
};

export const parseMarkdown = (markdown: string): string => {
  try {
    const html = marked(markdown) as string;
    const processedHtml = processLinks(html);
    return sanitizeHtml(processedHtml);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p>マークダウンの解析中にエラーが発生しました。</p>';
  }
};
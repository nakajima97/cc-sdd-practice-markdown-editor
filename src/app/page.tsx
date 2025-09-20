import { MarkdownEditor } from '@/features/markdown-editor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'マークダウンエディタ',
  description: 'リアルタイムプレビュー機能付きのマークダウンエディタ。GitHub Flavored Markdownをサポートし、デスクトップ・タブレット・モバイルに対応しています。',
  keywords: ['markdown', 'editor', 'preview', 'GFM', 'GitHub'],
  openGraph: {
    title: 'マークダウンエディタ',
    description: 'リアルタイムプレビュー機能付きのマークダウンエディタ',
    type: 'website',
  },
};

const sampleMarkdown = `# マークダウンエディタへようこそ！

このエディタでは、左側でマークダウンを編集すると、右側にリアルタイムでプレビューが表示されます。

## 主な機能

- **リアルタイムプレビュー**: 入力と同時にプレビューが更新
- **GitHub Flavored Markdown (GFM)**: テーブル、取り消し線などをサポート
- **レスポンシブデザイン**: デスクトップ・タブレット・モバイルに対応

## マークダウン記法の例

### 見出し
\`# H1\`, \`## H2\`, \`### H3\`

### 強調
**太字** または *斜体*

### リスト
- 項目1
- 項目2
- 項目3

### コードブロック
\`\`\`javascript
const message = "Hello, World!";
console.log(message);
\`\`\`

### テーブル
| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 25 | エンジニア |
| 佐藤 | 30 | デザイナー |

### リンク
[GitHub](https://github.com)

---

**使い方**: 左側のテキストエリアを編集して、様々なマークダウン記法を試してみてください！
`;

export default function Home() {
  return <MarkdownEditor initialMarkdown={sampleMarkdown} />;
}

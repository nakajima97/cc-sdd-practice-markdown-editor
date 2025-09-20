# マークダウンエディタ設計書

**プロジェクト**: マークダウンエディタ  
**作成日**: 2025-09-20  
**ステータス**: ドラフト  
**フェーズ**: Design  
**前提**: 要件書（requirements.md）レビュー完了

## 1. アーキテクチャ設計

### 1.1 システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                    ブラウザ (Client)                          │
├─────────────────────────────────────────────────────────────┤
│                Next.js App Router                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Input Panel   │  │  Preview Panel  │                  │
│  │                 │  │                 │                  │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │                  │
│  │ │MarkdownInput│ │  │ │MarkdownPrev │ │                  │
│  │ │  Component  │ │  │ │   Component │ │                  │
│  │ └─────────────┘ │  │ └─────────────┘ │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                      │                         │
│           └──────────┬───────────┘                         │
│                      │                                     │
│            ┌─────────▼─────────┐                           │
│            │MarkdownEditor     │                           │
│            │   Container       │                           │
│            └─────────┬─────────┘                           │
│                      │                                     │
│            ┌─────────▼─────────┐                           │
│            │ useMarkdownEditor │                           │
│            │      Hook         │                           │
│            └─────────┬─────────┘                           │
│                      │                                     │
│            ┌─────────▼─────────┐                           │
│            │   Markdown        │                           │
│            │   Parser/Utils    │                           │
│            └───────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技術スタック詳細

| レイヤー | 技術 | 選定理由 |
|---------|------|----------|
| **フレームワーク** | Next.js 15.3.3 (App Router) | 要件で指定、SSG対応、TypeScript統合 |
| **言語** | TypeScript | 要件で指定、型安全性 |
| **状態管理** | React Hooks (useState, useCallback) | シンプルな状態、外部ライブラリ不要 |
| **スタイリング** | CSS Modules | Next.jsとの親和性、スコープ化 |
| **マークダウンパーサー** | marked | 軽量、GFM対応、拡張性 |
| **シンタックスハイライト** | Prism.js | 軽量、言語サポート豊富 |
| **パッケージマネージャー** | pnpm | 要件で指定 |
| **テスト** | Vitest + Testing Library | 要件で指定、Next.js App Router対応 |
| **Linter** | Biome | 要件で指定 |

### 1.3 レイヤー分離

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  ← UI Components
├─────────────────────────────────────────┤
│            Container Layer              │  ← Business Logic
├─────────────────────────────────────────┤
│             Service Layer               │  ← Markdown Processing
├─────────────────────────────────────────┤
│              Utility Layer              │  ← Helper Functions
└─────────────────────────────────────────┘
```

## 2. コンポーネント設計

### 2.1 コンポーネント階層

```
MarkdownEditorPage (app/page.tsx)
└── MarkdownEditorContainer
    ├── MarkdownInput
    │   ├── TextArea
    │   └── SyntaxHighlighter (optional)
    └── MarkdownPreview
        ├── HTMLRenderer
        └── CodeBlockHighlighter
```

### 2.2 コンポーネント仕様

#### 2.2.1 MarkdownEditorContainer

**責任**: アプリケーションの状態管理と子コンポーネントの統合

```typescript
interface MarkdownEditorContainerProps {
  initialValue?: string;
  className?: string;
}

interface MarkdownEditorState {
  markdown: string;
  isPreviewMode: boolean; // モバイル用
  syncScroll: boolean;
}
```

**主要機能**:
- マークダウンテキストの状態管理
- リアルタイムプレビューの制御
- レスポンシブ表示モードの管理

#### 2.2.2 MarkdownInput

**責任**: マークダウンテキストの入力受付

```typescript
interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

**主要機能**:
- テキストエリアの制御
- スクロールイベントの発火
- 入力イベントのデバウンス処理
- キーボードショートカット（Tab処理等）

#### 2.2.3 MarkdownPreview

**責任**: マークダウンのHTMLレンダリング表示

```typescript
interface MarkdownPreviewProps {
  markdown: string;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  scrollTop?: number;
  className?: string;
}
```

**主要機能**:
- マークダウン→HTML変換
- サニタイゼーション
- コードブロックのシンタックスハイライト
- スクロール同期処理

### 2.3 レスポンシブ設計

#### デスクトップ (1200px以上)
```
┌─────────────────────────────────────────────────────────┐
│                     Header                              │
├─────────────────────┬───────────────────────────────────┤
│                     │                                   │
│    Input Panel      │      Preview Panel                │
│      (50%)          │         (50%)                     │
│                     │                                   │
│                     │                                   │
└─────────────────────┴───────────────────────────────────┘
```

#### タブレット (768px〜1199px)
```
┌─────────────────────────────────────────────────────────┐
│                     Header                              │
├─────────────────────┬───────────────────────────────────┤
│                     │                                   │
│    Input Panel      │      Preview Panel                │
│      (45%)          │         (55%)                     │
│                     │                                   │
└─────────────────────┴───────────────────────────────────┘
```

#### モバイル (767px以下)
```
┌─────────────────────────────────────────────────────────┐
│                Header + Toggle                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         Active Panel (Input OR Preview)                │
│                   (100%)                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 3. データフロー設計

### 3.1 状態管理フロー

```
[User Input] → [MarkdownInput] → [onChange] → [Container State]
                                                     │
                                                     ▼
[HTML Output] ← [MarkdownPreview] ← [markdown] ← [useMarkdownEditor]
```

### 3.2 useMarkdownEditor Hook

```typescript
interface UseMarkdownEditorReturn {
  // State
  markdown: string;
  htmlContent: string;
  isPreviewMode: boolean;
  syncScroll: boolean;
  
  // Actions
  setMarkdown: (value: string) => void;
  togglePreviewMode: () => void;
  toggleSyncScroll: () => void;
  
  // Scroll Sync
  handleInputScroll: (scrollTop: number, scrollHeight: number) => void;
  handlePreviewScroll: (scrollTop: number, scrollHeight: number) => void;
  inputScrollTop: number;
  previewScrollTop: number;
  
  // Performance
  isProcessing: boolean;
}
```

### 3.3 マークダウン変換フロー

```
[Raw Markdown] → [marked.parse()] → [Raw HTML] → [Sanitize] → [Safe HTML]
                       │                             │
                       ▼                             ▼
              [GFM Extensions]                [DOMPurify/Custom]
              [Table, Strikethrough]          [XSS Prevention]
```

## 4. API/インターフェース設計

### 4.1 マークダウンパーサー設定

```typescript
// lib/markdown/parser.ts
interface MarkdownParserConfig {
  gfm: boolean;
  breaks: boolean;
  sanitize: boolean;
  highlight?: (code: string, language: string) => string;
}

interface MarkdownParser {
  parse(markdown: string): string;
  parseInline(markdown: string): string;
}
```

### 4.2 シンタックスハイライト設定

```typescript
// utils/syntax-highlight.ts
interface SyntaxHighlighter {
  highlight(code: string, language: string): string;
  getSupportedLanguages(): string[];
  loadLanguage(language: string): Promise<void>;
}
```

### 4.3 スクロール同期API

```typescript
// hooks/useScrollSync.ts
interface ScrollSyncAPI {
  syncInputToPreview(inputScrollRatio: number): void;
  syncPreviewToInput(previewScrollRatio: number): void;
  calculateScrollRatio(scrollTop: number, scrollHeight: number): number;
}
```

## 5. パフォーマンス設計

### 5.1 最適化戦略

| 領域 | 手法 | 実装方法 |
|------|------|----------|
| **レンダリング** | デバウンス | 入力から300ms後に変換実行 |
| **メモ化** | useMemo | HTML変換結果のキャッシュ |
| **コールバック** | useCallback | イベントハンドラーの最適化 |
| **バンドルサイズ** | Dynamic Import | シンタックスハイライト動的読み込み |
| **DOM操作** | Virtual Scrolling | 大きなドキュメント用（Phase 3） |

### 5.2 パフォーマンス監視ポイント

```typescript
interface PerformanceMetrics {
  parseTime: number;        // マークダウン変換時間
  renderTime: number;       // DOM更新時間
  memoryUsage: number;      // メモリ使用量
  bundleSize: number;       // バンドルサイズ
}
```

### 5.3 メモリ管理

- 大きなドキュメント（10,000文字以上）でのガベージコレクション考慮
- イベントリスナーの適切な解除
- useEffectクリーンアップ関数の実装

## 6. セキュリティ設計

### 6.1 XSS対策

```typescript
// セキュリティレイヤー
interface SecurityConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  forbiddenTags: string[];
}

// 実装例
const SECURITY_CONFIG: SecurityConfig = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'del', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  allowedAttributes: {
    'a': ['href', 'title'],
    'img': ['src', 'alt', 'title'],
    'code': ['class'],
    'pre': ['class']
  },
  forbiddenTags: ['script', 'style', 'iframe', 'object', 'embed']
};
```

### 6.2 CSP設定

```typescript
// next.config.js セキュリティヘッダー
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
];
```

## 7. エラーハンドリング設計

### 7.1 エラー境界

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// コンポーネントレベルのエラーバウンダリ
class MarkdownEditorErrorBoundary extends React.Component<Props, ErrorBoundaryState>
```

### 7.2 エラーシナリオ

| シナリオ | 対応 |
|----------|------|
| **マークダウン変換エラー** | フォールバック表示、ログ出力 |
| **大量テキスト入力** | プログレス表示、分割処理 |
| **ネットワークエラー** | オフライン対応メッセージ |
| **メモリ不足** | 警告表示、テキスト制限 |

## 8. テスト設計

### 8.1 テスト戦略

```
┌─────────────────────────────────────────┐
│              E2E Tests                  │  ← Playwright/Cypress
├─────────────────────────────────────────┤
│         Integration Tests               │  ← Testing Library
├─────────────────────────────────────────┤
│            Unit Tests                   │  ← Vitest
├─────────────────────────────────────────┤
│         Static Analysis                 │  ← TypeScript/Biome
└─────────────────────────────────────────┘
```

### 8.2 テストケース設計

#### ユニットテスト
- マークダウンパーサーのテスト
- ユーティリティ関数のテスト
- Hookのテスト

#### インテグレーションテスト
- コンポーネント間の連携テスト
- 状態管理のテスト
- レスポンシブ動作のテスト

#### E2Eテスト
- ユーザージャーニーのテスト
- ブラウザ互換性テスト
- パフォーマンステスト

## 9. デプロイメント設計

### 9.1 ビルド戦略

```
Development → Type Check → Lint → Unit Test → Build → E2E Test → Deploy
```

### 9.2 最適化設定

```typescript
// next.config.js
const nextConfig = {
  output: 'export', // 静的エクスポート
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['marked', 'prismjs']
  }
};
```

## 10. 運用設計

### 10.1 監視項目

- バンドルサイズ（1MB以下）
- ページロード時間（2秒以下）
- メモリ使用量（100MB以下）
- マークダウン変換時間（100ms以下）

### 10.2 ログ設計

```typescript
interface AppLog {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}
```

## 11. フォルダ構造詳細

```
src/
├── app/
│   ├── page.tsx                           # メインページ
│   ├── layout.tsx                         # ルートレイアウト
│   ├── globals.css                        # グローバルスタイル
│   └── error.tsx                          # エラーページ
├── features/
│   └── markdown-editor/
│       ├── presentational/                # プレゼンテーション層
│       │   ├── MarkdownInput/
│       │   │   ├── index.tsx
│       │   │   ├── MarkdownInput.module.css
│       │   │   ├── MarkdownInput.test.tsx
│       │   │   └── MarkdownInput.stories.tsx
│       │   ├── MarkdownPreview/
│       │   │   ├── index.tsx
│       │   │   ├── MarkdownPreview.module.css
│       │   │   ├── MarkdownPreview.test.tsx
│       │   │   └── MarkdownPreview.stories.tsx
│       │   └── MarkdownEditor/
│       │       ├── index.tsx
│       │       ├── MarkdownEditor.module.css
│       │       ├── MarkdownEditor.test.tsx
│       │       └── MarkdownEditor.stories.tsx
│       ├── containers/                    # コンテナ層
│       │   └── MarkdownEditorContainer/
│       │       ├── index.tsx
│       │       ├── MarkdownEditorContainer.test.tsx
│       │       └── useMarkdownEditor.ts
│       ├── hooks/                         # カスタムフック
│       │   ├── useMarkdownSync.ts
│       │   ├── useMarkdownSync.test.ts
│       │   ├── useDebounce.ts
│       │   └── useScrollSync.ts
│       ├── types/                         # 型定義
│       │   ├── markdown.ts
│       │   └── editor.ts
│       ├── lib/                           # ライブラリ設定
│       │   ├── parser.ts
│       │   ├── parser.test.ts
│       │   └── security.ts
│       └── utils/                         # ユーティリティ
│           ├── markdown.ts
│           ├── markdown.test.ts
│           ├── syntax-highlight.ts
│           └── performance.ts
├── components/                            # 共有コンポーネント
│   └── presentational/
│       ├── ErrorBoundary/
│       ├── LoadingSpinner/
│       └── ResponsiveLayout/
├── lib/                                   # アプリ全体設定
│   └── markdown/
│       ├── config.ts
│       └── plugins.ts
├── styles/                                # 共有スタイル
│   ├── globals.css
│   ├── variables.css
│   └── markdown.css
└── __tests__/                             # テスト
    ├── setup.ts
    ├── e2e/
    └── utils/
```

## 12. 実装フェーズ詳細

### Phase 1: MVP実装 (1週間)
- [ ] 基本的な２カラムレイアウト
- [ ] マークダウン入力機能
- [ ] リアルタイムプレビュー
- [ ] 基本的なGFM対応
- [ ] レスポンシブ対応（基本）

### Phase 2: 品質向上 (1週間)
- [ ] スタイリング改善
- [ ] パフォーマンス最適化
- [ ] エラーハンドリング
- [ ] テストカバレッジ80%達成
- [ ] アクセシビリティ対応

### Phase 3: 拡張機能 (1週間)
- [ ] シンタックスハイライト
- [ ] スクロール同期
- [ ] 高度なパフォーマンス最適化
- [ ] E2Eテスト
- [ ] デプロイメント準備

---

**承認フロー**:
- [ ] 設計レビュー完了
- [ ] アーキテクチャ承認
- [ ] 技術スタック承認
- [ ] タスク分解フェーズへ移行承認

**次のフェーズ**: タスク書（tasks.md）の作成
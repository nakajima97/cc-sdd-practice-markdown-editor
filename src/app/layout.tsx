import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'マークダウンエディタ',
  description: 'リアルタイムプレビュー機能付きのマークダウンエディタ。GitHub Flavored Markdownをサポートし、デスクトップ・タブレット・モバイルに対応しています。',
  keywords: ['markdown', 'editor', 'preview', 'GFM', 'GitHub'],
  authors: [{ name: 'Markdown Editor Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  openGraph: {
    title: 'マークダウンエディタ',
    description: 'リアルタイムプレビュー機能付きのマークダウンエディタ',
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

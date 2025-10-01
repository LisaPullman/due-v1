import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FoxAI记账软件',
  description: '智能个人记账软件，具备风险提醒功能',
  keywords: '记账, 理财, FoxAI, 风险管理',
  authors: [{ name: 'FoxAI' }],
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#FF6B35',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B35" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FoxAI记账" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
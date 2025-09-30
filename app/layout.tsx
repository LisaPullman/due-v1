import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ToastContainer from '@/components/Toast'

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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FoxAI记账" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}
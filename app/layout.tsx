import type { Metadata } from 'next'
import './globals.css'
import MobileOptimizer from '@/components/mobile-optimizer'

export const metadata: Metadata = {
  title: 'HCI',
  description: 'HCI',
  generator: 'HoloLens',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <MobileOptimizer />
        {children}
      </body>
    </html>
  )
}

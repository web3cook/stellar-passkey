import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'SealPass — Smart Wallet',
  description: 'Your Stellar smart wallet, secured by passkey',
  icons: { icon: '/logo1.jpeg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} font-[var(--font-geist)] antialiased`}
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        {children}
      </body>
    </html>
  )
}

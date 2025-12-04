import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RitualOS - Micro-Ritual Operating System for Focused Gen Z',
  description: 'Combat digital overwhelm with tiny, intentional actions. Not another habit tracker—a personal operating system for your attention, anxiety, and energy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

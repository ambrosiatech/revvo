import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Revvo — Automate Your Google Reviews',
  description:
    'Send automated Google review requests via SMS and email. Built for local service businesses.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


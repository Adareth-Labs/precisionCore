import type { Metadata, Viewport } from 'next'
import { GlobalNav } from '@/components/nav/GlobalNav'
import { Footer } from '@/components/layout/Footer'
import { GDPRBanner } from '@/components/layout/GDPRBanner'
import { SkipNav } from '@/components/shared/SkipNav'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#1a1c1e' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://precisioncore.com'),
  title: {
    default:  'PrecisionCore Automotive — Tier 1 Manufacturing',
    template: '%s | PrecisionCore',
  },
  description: "Advanced component engineering and manufacturing for the world's most demanding OEMs.",
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         process.env.NEXT_PUBLIC_SITE_URL ?? 'https://precisioncore.com',
    siteName:    'PrecisionCore Automotive',
    title:       'PrecisionCore Automotive — Tier 1 Manufacturing',
    description: "Advanced component engineering and manufacturing for the world's most demanding OEMs.",
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SkipNav />
        <GlobalNav />
        <main id="main-content" className="pt-nav min-h-screen">
          {children}
        </main>
        <Footer />
        <GDPRBanner />
      </body>
    </html>
  )
}
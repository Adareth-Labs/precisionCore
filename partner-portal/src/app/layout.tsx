// src/app/layout.tsx
// No auth provider wrapper needed — Supabase sessions live in cookies,
// managed by middleware and the SSR client.
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default:  'Partner Portal — PrecisionCore Automotive',
    template: '%s | PrecisionCore Automotive Partner Portal',
  },
  description: 'Secure supplier collaboration platform for Tier 1–3 automotive partners.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

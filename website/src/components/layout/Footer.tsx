'use client';
import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Legal',          href: '/legal' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Supplier Portal', href: process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://portal.precisioncore.com' },
  { label: 'Compliance',     href: '/governance' },
  { label: 'Whistleblower',  href: '/whistleblower' },
] as const

export function Footer() {
  return (
    <footer
      className="bg-surface-highest border-t border-stroke py-12"
      aria-label="Site footer"
    >
      <div className="max-w-platform mx-auto px-12 grid grid-cols-2 gap-8">
        <div>
          <div className="font-display text-xl font-medium tracking-tight text-ink-primary mb-3">
            PRECISIONCORE
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            © {new Date().getFullYear()} PrecisionCore Automotive. All Rights Reserved.
            <br />
            ISO 9001:2015 &amp; IATF 16949 Certified.
          </p>
        </div>
        <nav
          className="flex flex-wrap justify-end items-start gap-x-6 gap-y-2"
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="text-sm text-ink-secondary hover:text-ink-primary hover:underline transition-colors"
            onClick={() => {
              // Re-trigger GDPR banner
              document.dispatchEvent(new CustomEvent('pc:show-consent'))
            }}
          >
            Manage cookies
          </button>
        </nav>
      </div>
    </footer>
  )
}

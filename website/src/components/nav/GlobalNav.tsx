'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { clsx } from 'clsx'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://portal.precisioncore.com'

const LANGUAGES = [
  { code: 'EN', label: 'English',         locale: 'en' },
  { code: 'DE', label: 'Deutsch',         locale: 'de' },
  { code: 'FR', label: 'Français',        locale: 'fr' },
  { code: 'ZH', label: '中文（简体）',     locale: 'zh' },
  { code: 'JA', label: '日本語',           locale: 'ja' },
  { code: 'KO', label: '한국어',           locale: 'ko' },
  { code: 'ES', label: 'Español',         locale: 'es' },
  { code: 'PT', label: 'Português',       locale: 'pt' },
  { code: 'PL', label: 'Polski',          locale: 'pl' },
  { code: 'CS', label: 'Čeština',         locale: 'cs' },
] as const

const COMPANY_ITEMS = [
  { label: 'About & Footprint', href: '/company' },
  { label: 'Investors & ESG',   href: '/company/investors' },
  { label: 'Governance',        href: '/governance' },
  { label: 'Newsroom',          href: '/newsroom' },
] as const

interface NavLinkProps {
  href: string
  children: React.ReactNode
  exact?: boolean
}

function NavLink({ href, children, exact }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={clsx(
        'relative text-sm text-ink-secondary hover:text-ink-primary transition-colors duration-150 py-1.5 px-2.5',
        isActive && [
          'text-ink-primary font-medium',
          'after:absolute after:bottom-[-2px] after:left-2.5 after:right-2.5 after:h-0.5 after:bg-ink-primary',
        ]
      )}
    >
      {children}
    </Link>
  )
}

export function GlobalNav() {
  const [companyOpen, setCompanyOpen] = useState(false)
  const [langOpen,    setLangOpen]    = useState(false)
  const [isDark,      setIsDark]      = useState(false)
  const [rfqOpen,     setRfqOpen]     = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)

  const companyRef = useRef<HTMLDivElement>(null)
  const langRef    = useRef<HTMLDivElement>(null)

  // Dark mode — reads persisted preference
  useEffect(() => {
    const stored = localStorage.getItem('pc-dk')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dk = stored === '1' || (!stored && prefersDark)
    setIsDark(dk)
    document.documentElement.classList.toggle('dark', dk)
  }, [])

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('pc-dk', next ? '1' : '0')
      return next
    })
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdowns on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCompanyOpen(false)
        setLangOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* ── Alert banner ─────────────────────────────────────── */}
      {alertVisible && (
        <div
          className="metrics-bar flex items-center justify-between px-12 py-2.5 font-mono text-xs uppercase tracking-widest"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-base" aria-hidden="true">campaign</span>
            MATERIAL ANNOUNCEMENT: Q3 2024 Financial Filings Now Available on Investor Portal.
            <Link
              href="/company/investors"
              className="border border-current px-2 py-0.5 text-xs hover:opacity-75 transition-opacity"
            >
              View Filings
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setAlertVisible(false)}
            aria-label="Dismiss announcement"
            className="opacity-70 hover:opacity-100 transition-opacity flex items-center"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
          </button>
        </div>
      )}

      {/* ── Main navigation ───────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-nav border-b border-stroke bg-white dark:bg-surface"
        aria-label="Main navigation"
        style={{ top: alertVisible ? '40px' : '0' }}
      >
        <div className="max-w-platform mx-auto px-12 h-full flex items-center gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="font-display text-lg font-medium tracking-tight text-ink-primary whitespace-nowrap"
            aria-label="PrecisionCore — home"
          >
            PRECISIONCORE
          </Link>

          {/* Search */}
          <div
            className="flex items-center gap-2 bg-surface-low border border-stroke px-3 py-1.5 flex-1 max-w-xs focus-within:border-ink-primary transition-colors"
            role="search"
          >
            <span className="material-symbols-outlined text-lg text-ink-secondary" aria-hidden="true">search</span>
            <input
              type="search"
              placeholder="Search solutions, certs, docs..."
              aria-label="Site search"
              className="bg-transparent border-0 outline-none text-sm text-ink-primary placeholder:text-ink-secondary w-full font-body"
            />
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1 ml-auto" role="menubar">
            <NavLink href="/solutions">Solutions</NavLink>
            <NavLink href="/innovation">Innovation</NavLink>

            {/* Company dropdown */}
            <div className="relative" ref={companyRef}>
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={companyOpen}
                onClick={() => setCompanyOpen((o) => !o)}
                className="relative text-sm text-ink-secondary hover:text-ink-primary transition-colors duration-150 py-1.5 px-2.5 flex items-center gap-0.5"
              >
                Company
                <span className="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span>
              </button>
              {companyOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] left-0 bg-white dark:bg-surface border border-stroke min-w-[200px] z-10"
                  role="menu"
                >
                  {COMPANY_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-ink-secondary hover:bg-surface-low hover:text-ink-primary transition-colors"
                      onClick={() => setCompanyOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/newsroom">Newsroom</NavLink>
            <NavLink href="/careers">Careers</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="border border-stroke text-ink-secondary hover:border-ink-primary hover:text-ink-primary transition-all p-1.5 flex items-center"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
                onClick={() => setLangOpen((o) => !o)}
                className="font-mono text-xs text-ink-secondary hover:text-ink-primary flex items-center gap-1 px-2 py-1.5"
              >
                EN
                <span className="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span>
              </button>
              {langOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-surface border border-stroke w-[220px] z-10"
                  role="listbox"
                  aria-label="Select language"
                >
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.code}
                      role="option"
                      aria-selected={lang.code === 'EN'}
                      className="flex justify-between items-center px-4 py-2.5 cursor-pointer hover:bg-surface-low transition-colors text-sm"
                      onClick={() => setLangOpen(false)}
                    >
                      <span className={lang.code === 'EN' ? 'font-medium' : ''}>
                        {lang.code === 'EN' && <span className="mr-1.5" aria-hidden="true">●</span>}
                        {lang.label}
                      </span>
                      <span className="font-mono text-xs text-ink-secondary">{lang.code}</span>
                    </div>
                  ))}
                  <div className="border-t border-stroke px-4 py-2.5 text-xs text-ink-secondary cursor-pointer hover:bg-surface-low">
                    Request a language →
                  </div>
                </div>
              )}
            </div>

            {/* Request RFQ */}
            <a
              href={`${PORTAL_URL}/rfq/new`}
              className="bg-action text-white border border-action font-mono text-xs uppercase tracking-widest font-medium px-4 py-2.5 hover:opacity-85 transition-opacity whitespace-nowrap"
            >
              Request RFQ
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

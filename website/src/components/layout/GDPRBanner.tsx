'use client'

import { useState, useEffect } from 'react'

interface ConsentState {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: false
  ts: number
}

const COOKIE_NAME = 'pc_consent'
const COOKIE_EXPIRY_DAYS = 365

function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  if (!match) return null
  try { return JSON.parse(decodeURIComponent(match[1])) } catch { return null }
}

function writeConsent(state: Omit<ConsentState, 'ts'>): void {
  const full: ConsentState = { ...state, ts: Date.now() }
  const maxAge = COOKIE_EXPIRY_DAYS * 24 * 60 * 60
  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(full))}`,
    `path=/`,
    `max-age=${maxAge}`,
    `SameSite=Lax`,
    `Secure`,
  ].join('; ')
}

export function GDPRBanner() {
  const [visible,   setVisible]   = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [functional, setFunctional] = useState(true)

  useEffect(() => {
    const existing = readConsent()
    // Show if no consent or expired (> 365 days)
    const expired = existing
      ? (Date.now() - existing.ts) > COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      : true
    if (!existing || expired) setVisible(true)

    // Listen for "Manage cookies" trigger from footer
    function show() { setVisible(true) }
    document.addEventListener('pc:show-consent', show)
    return () => document.removeEventListener('pc:show-consent', show)
  }, [])

  function acceptSelected() {
    writeConsent({ necessary: true, functional, analytics, marketing: false })
    setVisible(false)
  }

  function acceptAll() {
    writeConsent({ necessary: true, functional: true, analytics: true, marketing: false })
    setVisible(false)
  }

  function declineAll() {
    writeConsent({ necessary: true, functional: false, analytics: false, marketing: false })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface border-t border-stroke px-12 py-6"
      role="region"
      aria-label="Cookie consent preferences"
      aria-live="polite"
    >
      <div className="max-w-platform mx-auto grid grid-cols-2 gap-12 items-start">
        {/* Left — description */}
        <div>
          <h2 className="text-base font-medium mb-2">We use cookies</h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-3">
            We use strictly necessary cookies to operate this site, and optional analytics
            cookies to improve your experience. We do not use advertising or retargeting cookies.
          </p>
          <a href="/privacy" className="text-sm text-ink-primary underline">
            Read our privacy policy
          </a>
        </div>

        {/* Right — toggles and actions */}
        <div>
          <div className="flex flex-col gap-3.5 mb-4">
            <Toggle
              id="c-necessary"
              label="Strictly necessary"
              description="Required for the site to function. Cannot be disabled."
              checked={true}
              disabled
              onChange={() => {}}
            />
            <Toggle
              id="c-functional"
              label="Functional"
              description="Remembers your language preference and session settings."
              checked={functional}
              onChange={setFunctional}
            />
            <Toggle
              id="c-analytics"
              label="Analytics"
              description="Helps us understand how procurement teams use the site. No personal data shared."
              checked={analytics}
              onChange={setAnalytics}
            />
            <div className="opacity-40">
              <Toggle
                id="c-marketing"
                label="Marketing — not in use"
                description="We currently run no retargeting campaigns."
                checked={false}
                disabled
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mb-2">
            <button
              type="button"
              onClick={acceptSelected}
              className="bg-transparent text-ink-primary border border-ink-primary font-mono text-xs uppercase tracking-widest font-medium px-4 py-2 hover:bg-surface-mid transition-colors"
            >
              Accept Selected
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="bg-action text-white border border-action font-mono text-xs uppercase tracking-widest font-medium px-4 py-2 hover:opacity-85 transition-opacity"
            >
              Accept All
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={declineAll}
              className="text-xs text-ink-secondary underline"
            >
              Decline all optional cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToggleProps {
  id: string
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}

function Toggle({ id, label, description, checked, disabled, onChange }: ToggleProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink-primary cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-ink-secondary mt-0.5">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          'relative w-10 h-[22px] rounded-full transition-colors duration-150 flex-shrink-0',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary',
          'disabled:cursor-not-allowed',
          checked ? 'bg-action' : 'bg-stroke',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform duration-150',
            checked ? 'translate-x-[18px]' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

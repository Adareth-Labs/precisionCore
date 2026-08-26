'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  message: string
  linkLabel?: string
  linkHref?:  string
}

export function AlertBanner({ message, linkLabel, linkHref }: Props) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div
      className="metrics-bar flex items-center justify-between px-12 py-2.5 font-mono text-xs uppercase tracking-widest"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-base" aria-hidden="true">campaign</span>
        {message}
        {linkLabel && linkHref && (
          <Link
            href={linkHref}
            className="border border-current px-2 py-0.5 text-xs hover:opacity-75 transition-opacity ml-2"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="opacity-70 hover:opacity-100 transition-opacity flex items-center"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
      </button>
    </div>
  )
}
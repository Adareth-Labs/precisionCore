'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

export interface DropdownItem {
  label: string
  href:  string
}

interface Props {
  label:    string
  items:    DropdownItem[]
  isActive?: boolean
}

export function NavDropdown({ label, items, isActive }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'relative text-sm text-ink-secondary hover:text-ink-primary',
          'transition-colors duration-150 py-1.5 px-2.5',
          'flex items-center gap-0.5',
          isActive && [
            'text-ink-primary font-medium',
            'after:absolute after:bottom-[-2px] after:left-2.5 after:right-2.5',
            'after:h-0.5 after:bg-ink-primary',
          ]
        )}
      >
        {label}
        <span
          className={clsx(
            'material-symbols-outlined text-sm transition-transform duration-150',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 bg-white dark:bg-surface border border-stroke min-w-[200px] z-10"
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-ink-secondary hover:bg-surface-low hover:text-ink-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'

const LANGUAGES = [
  { code: 'EN', label: 'English'         },
  { code: 'DE', label: 'Deutsch'         },
  { code: 'FR', label: 'Français'        },
  { code: 'ZH', label: '中文（简体）'     },
  { code: 'JA', label: '日本語'           },
  { code: 'KO', label: '한국어'           },
  { code: 'ES', label: 'Español'         },
  { code: 'PT', label: 'Português'       },
  { code: 'PL', label: 'Polski'          },
  { code: 'CS', label: 'Čeština'         },
] as const

export function LangSelector() {
  const [open, setOpen]     = useState(false)
  const [active, setActive] = useState<string>('EN')
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
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((o) => !o)}
        className="font-mono text-xs text-ink-secondary hover:text-ink-primary flex items-center gap-1 px-2 py-1.5 transition-colors"
      >
        {active}
        <span className="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-surface border border-stroke w-[220px] z-10"
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              role="option"
              aria-selected={lang.code === active}
              tabIndex={0}
              className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-surface-low transition-colors"
              onClick={() => { setActive(lang.code); setOpen(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setActive(lang.code); setOpen(false) } }}
            >
              <span className={lang.code === active ? 'font-medium' : ''}>
                {lang.code === active && <span className="mr-1.5" aria-hidden="true">●</span>}
                {lang.label}
              </span>
              <span className="font-mono text-xs text-ink-secondary">{lang.code}</span>
            </div>
          ))}
          <div className="border-t border-stroke px-4 py-2.5 text-xs text-ink-secondary cursor-pointer hover:bg-surface-low transition-colors">
            Request a language →
          </div>
        </div>
      )}
    </div>
  )
}
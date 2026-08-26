'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import type { TechnologyDomain } from '@/types'

const DOMAINS: { value: TechnologyDomain | 'all'; label: string; icon: string }[] = [
  { value: 'all',                   label: 'All Domains',         icon: 'category' },
  { value: 'powertrain',            label: 'Powertrain',          icon: 'settings' },
  { value: 'safety-systems',        label: 'Safety Systems',      icon: 'security' },
  { value: 'adas-autonomy',         label: 'ADAS & Autonomy',     icon: 'driving' },
  { value: 'thermal-management',    label: 'Thermal Management',  icon: 'thermostat' },
  { value: 'electrical-electronics',label: 'Electrical',          icon: 'memory' },
  { value: 'body-chassis',          label: 'Body & Chassis',      icon: 'directions_car' },
  { value: 'interiors',             label: 'Interiors',           icon: 'chair' },
]

const CERTS = ['IATF 16949','ISO 9001:2015','ISO 14001'] as const

export function DomainFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const active = (params.get('domain') ?? 'all') as TechnologyDomain | 'all'
  const activeCerts = params.getAll('cert')

  function setDomain(value: TechnologyDomain | 'all') {
    const p = new URLSearchParams(params.toString())
    value === 'all' ? p.delete('domain') : p.set('domain', value)
    p.delete('page')
    router.push(`${pathname}?${p}`, { scroll: false })
  }

  function toggleCert(cert: string) {
    const p = new URLSearchParams(params.toString())
    const certs = p.getAll('cert')
    if (certs.includes(cert)) { p.delete('cert'); certs.filter(c => c !== cert).forEach(c => p.append('cert', c)) }
    else p.append('cert', cert)
    p.delete('page')
    router.push(`${pathname}?${p}`, { scroll: false })
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-low border-r border-stroke py-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto" aria-label="Solutions filter">
      <div className="px-4 pb-4 border-b border-stroke mb-2">
        <span className="section-label" style={{fontSize:'10px'}}>Technical Filter</span>
        <div className="font-mono text-xs text-ink-secondary">Component Catalog v4.2</div>
      </div>
      <div>
        {DOMAINS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDomain(d.value)}
            className={clsx(
              'flex items-center gap-2.5 px-4 py-3 w-full text-left text-sm transition-colors',
              active === d.value
                ? 'bg-action text-white'
                : 'text-ink-secondary hover:bg-surface-high hover:text-ink-primary'
            )}
          >
            <span className="material-symbols-outlined text-lg flex-shrink-0" aria-hidden="true">{d.icon}</span>
            {d.label}
          </button>
        ))}
      </div>
      <div className="px-4 pt-4 border-t border-stroke mt-2">
        <span className="section-label" style={{fontSize:'10px',marginBottom:'10px'}}>Certifications</span>
        {CERTS.map((cert) => (
          <label key={cert} className="flex items-center gap-2 mb-2.5 text-sm text-ink-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={activeCerts.includes(cert)}
              onChange={() => toggleCert(cert)}
              className="accent-action"
            />
            {cert}
          </label>
        ))}
      </div>
    </aside>
  )
}

import type { SiteMetrics } from '@/types'

interface Props { metrics: SiteMetrics | null }

export function MetricsBar({ metrics }: Props) {
  const m = metrics ?? {
    revenueRunRate: '$4.2B USD', revenueYear: 'Q3 2024',
    facilityCount: 42, headcount: 18450,
    iatfCertifiedCount: 38, countryCount: 24,
    lastUpdated: new Date().toISOString(),
  }
  return (
    <div className="metrics-bar" role="region" aria-label="Company metrics">
      <div className="max-w-platform mx-auto px-12 py-5 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="live-dot" role="status" aria-label="Live network status: operational" />
          <span className="font-mono text-xs uppercase tracking-widest opacity-70">Live Network Status</span>
        </div>
        <div className="flex gap-12 flex-wrap">
          {[
            { label: `${m.revenueYear} Revenue Run Rate`, value: m.revenueRunRate },
            { label: 'Global Active Sites',  value: `${m.facilityCount} Facilities` },
            { label: 'Total Headcount',      value: m.headcount.toLocaleString() },
            { label: 'IATF-Certified Sites', value: `${m.iatfCertifiedCount} of ${m.facilityCount}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-xs uppercase tracking-widest opacity-70 mb-0.5">{label}</div>
              <div className="text-2xl font-medium tracking-tight">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

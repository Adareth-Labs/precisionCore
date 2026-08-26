import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { Solution, ProductionStatus } from '@/types'

const statusVariant: Record<ProductionStatus, 'success'|'warning'|'neutral'|'danger'> = {
  'active-production':   'success',
  'beta-validation':     'warning',
  'engineering-sample':  'neutral',
  'end-of-life':         'danger',
}
const statusLabel: Record<ProductionStatus, string> = {
  'active-production':   'Active Production',
  'beta-validation':     'Beta Validation',
  'engineering-sample':  'Engineering Sample',
  'end-of-life':         'End of Life',
}

interface Props { solution: Solution; fullWidth?: boolean }

export function ProductCard({ solution, fullWidth }: Props) {
  const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://portal.precisioncore.com'

  return (
    <article className={`card card-hover flex flex-col ${fullWidth ? 'col-span-2 flex-row' : ''}`}>
      <div className={`h-1 ${solution.status === 'beta-validation' ? 'bg-warning' : 'bg-action'}`} />
      <div className={`p-6 flex-1 flex flex-col ${fullWidth ? 'flex-row gap-8' : ''}`}>
        <div className={fullWidth ? 'flex-1' : ''}>
          <div className="flex gap-2 mb-4">
            <Badge variant={statusVariant[solution.status]} dot>
              {statusLabel[solution.status]}
            </Badge>
            {solution.certifications.slice(0, 1).map((c) => (
              <Badge key={c} variant="neutral">{c}</Badge>
            ))}
          </div>
          <h2 className="text-xl font-medium mb-2">
            <Link href={`/solutions/${solution.slug}`} className="hover:underline">
              {solution.name}
            </Link>
          </h2>
          <p className="text-md text-ink-secondary mb-5">{solution.shortDescription}</p>
          <div className="flex gap-3 mt-auto">
            <a
              href={`${PORTAL_URL}/rfq/new?product=${solution.slug}`}
              className="bg-action text-white border border-action font-mono text-xs uppercase tracking-widest font-medium px-4 py-2 hover:opacity-85 transition-opacity flex-1 text-center"
            >
              Initiate RFQ
            </a>
            {solution.technicalDataSheetUrl && (
              <a
                href={solution.technicalDataSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download technical data sheet for ${solution.name}`}
                className="bg-transparent text-ink-primary border border-ink-primary font-mono text-xs uppercase tracking-widest font-medium px-3 py-2 hover:bg-surface-mid transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">download</span>
                TDS
              </a>
            )}
          </div>
        </div>
        {solution.specifications.length > 0 && (
          <div className={`bg-surface-low p-4 ${fullWidth ? 'w-72 flex-shrink-0' : 'mt-5'}`}>
            <span className="section-label mb-3">Specifications</span>
            <dl>
              {solution.specifications.slice(0, fullWidth ? 4 : 4).map((spec) => (
                <div key={spec.label} className="spec-row">
                  <dt className="spec-label">{spec.label}</dt>
                  <dd className="spec-value">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </article>
  )
}

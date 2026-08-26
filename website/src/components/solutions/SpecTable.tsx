import type { SpecificationRow } from '@/types'

interface Props {
  specs:     SpecificationRow[]
  heading?:  string
  maxRows?:  number
  className?: string
}

export function SpecTable({ specs, heading = 'Performance Specifications', maxRows, className }: Props) {
  const rows = maxRows ? specs.slice(0, maxRows) : specs

  return (
    <div className={`bg-surface-low p-4 ${className ?? ''}`}>
      {heading && <span className="section-label mb-3">{heading}</span>}
      <dl>
        {rows.map((spec) => (
          <div key={spec.label} className="spec-row">
            <dt className="spec-label">{spec.label}</dt>
            <dd className="spec-value">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
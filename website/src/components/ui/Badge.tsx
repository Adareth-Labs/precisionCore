import { clsx } from 'clsx'

type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantClasses: Record<Variant, string> = {
  neutral: 'text-ink-secondary bg-surface-mid border-stroke',
  success: 'text-success bg-success-bg border-success',
  warning: 'text-warning bg-warning-bg border-warning',
  danger:  'text-danger  bg-danger-bg  border-danger',
  info:    'text-ink-secondary bg-surface-low border-stroke',
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1',
        'font-mono text-xs uppercase tracking-widest font-medium',
        'px-2 py-0.5 border',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger'  && 'bg-danger',
            variant === 'neutral' && 'bg-ink-secondary',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

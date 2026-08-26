import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-action text-action-on border-action hover:opacity-85',
  secondary: 'bg-transparent text-ink-primary border-ink-primary hover:bg-surface-mid',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-6 py-3   text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  loading,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5',
        'font-mono uppercase font-medium tracking-widest',
        'border transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        </>
      ) : children}
    </button>
  )
}

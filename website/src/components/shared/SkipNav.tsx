export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={[
        'absolute top-[-100%] left-4 z-50',
        'bg-white text-ink-primary',
        'px-4 py-2 border border-ink-primary',
        'font-mono text-xs',
        'focus:top-2',
        'transition-none',
      ].join(' ')}
    >
      Skip to main content
    </a>
  )
}

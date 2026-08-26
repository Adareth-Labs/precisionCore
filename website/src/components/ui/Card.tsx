import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'article' | 'section'
  padding?: 'sm' | 'md' | 'lg'
}

const padClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, className, hover, as: Tag = 'div', padding = 'md' }: CardProps) {
  return (
    <Tag
      className={clsx(
        'card',
        padClasses[padding],
        hover && 'card-hover',
        className
      )}
    >
      {children}
    </Tag>
  )
}
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/Badge'

interface Props {
  href: string
  title: string
  summary: string
  attribution: string
  readTime: number
  publishedAt: string
  category: string
  categoryVariant?: 'neutral'|'success'|'warning'
}
export function ArticleRow({ href, title, summary, attribution, readTime, publishedAt, category, categoryVariant = 'neutral' }: Props) {
  return (
    <Link href={href} className="article-row">
      <div className="flex-shrink-0 w-24">
        <time className="font-mono text-xs text-ink-secondary" dateTime={publishedAt}>
          {format(new Date(publishedAt), 'yyyy-MM-dd')}
        </time>
        <div className="mt-1">
          <Badge variant={categoryVariant} className="text-[9px]">{category}</Badge>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium leading-snug mb-1.5">{title}</h3>
        <p className="text-sm text-ink-secondary mb-2">{summary}</p>
        <div className="font-mono text-xs text-ink-secondary">{attribution} · {readTime} min read</div>
      </div>
    </Link>
  )
}
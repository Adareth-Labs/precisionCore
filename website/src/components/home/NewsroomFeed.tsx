import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/Badge'
import type { NewsArticle } from '@/types'

interface Props { articles: NewsArticle[] }

const categoryVariant: Record<string, 'neutral'|'success'|'warning'> = {
  technical: 'neutral', corporate: 'neutral', esg: 'success',
  financial: 'neutral', partnerships: 'neutral',
}

export function NewsroomFeed({ articles }: Props) {
  return (
    <section className="bg-surface-low border-t border-stroke py-12" aria-labelledby="news-feed-heading">
      <div className="max-w-platform mx-auto px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="section-label">Latest</span>
            <h2 id="news-feed-heading" className="text-xl font-medium">Newsroom</h2>
          </div>
          <Link href="/newsroom" className="text-sm text-ink-secondary hover:text-ink-primary flex items-center gap-1 transition-colors">
            Full Archive
            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <Link key={article.sys.id} href={`/newsroom/${article.slug}`} className="card block p-6 hover:border-ink-primary transition-colors">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={categoryVariant[article.category] ?? 'neutral'}>
                  {article.category}
                </Badge>
                <time className="font-mono text-xs text-ink-secondary" dateTime={article.publishedAt}>
                  {format(new Date(article.publishedAt), 'yyyy-MM-dd')}
                </time>
              </div>
              <h3 className="text-base font-medium leading-snug mb-2">{article.title}</h3>
              <p className="text-sm text-ink-secondary">{article.summary}</p>
              <div className="mt-4 font-mono text-xs text-ink-secondary">
                {article.attribution} · {article.readTimeMinutes} min read
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Article, getMediaUrl } from '../lib/strapi'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  article: Article
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
}

function timeAgo(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
}

function CategoryBadge({ category }: { category: Article['attributes']['category'] }) {
  if (!category?.data) return null
  const { name, color } = category.data.attributes
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium"
      style={{ color, border: `1px solid ${color}30`, backgroundColor: `${color}10` }}
    >
      {name}
    </span>
  )
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const { title, slug, excerpt, publishedAt, readTime, cover, author, category, tags } = article.attributes
  const coverUrl = getMediaUrl(cover)
  const authorName = author?.data?.attributes?.name || 'Équipe TechPulse'

  if (variant === 'featured') {
    return (
      <Link href={`/article/${slug}`} className="group block relative overflow-hidden rounded-lg bg-surface border border-border hover:border-acid/30 transition-all duration-300">
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-surface to-void group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: coverUrl !== '/placeholder.jpg' ? `url(${coverUrl})` : undefined }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
          {/* Category + time */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <CategoryBadge category={category} />
            {article.attributes.featured && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-acid text-void font-medium">À LA UNE</span>
            )}
          </div>
          {/* Placeholder art */}
          {coverUrl === '/placeholder.jpg' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[120px] opacity-5 text-white leading-none select-none">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-6">
          <h2 className="font-display text-3xl text-white group-hover:text-acid transition-colors leading-tight mb-3">
            {title}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center justify-between text-xs font-mono text-muted">
            <span>{authorName}</span>
            <div className="flex items-center gap-3">
              <span>{readTime} min</span>
              <span>{timeAgo(publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${slug}`} className="group flex items-start gap-4 py-4 border-b border-border hover:border-acid/20 transition-colors last:border-0">
        <div className="flex-1 min-w-0">
          <CategoryBadge category={category} />
          <h3 className="font-display text-lg text-white group-hover:text-acid transition-colors mt-1 leading-tight line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs font-mono text-muted">
            <span>{readTime} min</span>
            <span>·</span>
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>
        <div
          className="w-16 h-16 flex-shrink-0 rounded bg-surface border border-border flex items-center justify-center overflow-hidden"
        >
          <span className="font-display text-3xl opacity-20 text-white">{title.charAt(0)}</span>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/article/${slug}`} className="group flex gap-5 p-5 rounded-lg bg-surface border border-border hover:border-acid/30 transition-all duration-200">
        <div
          className="w-24 h-24 flex-shrink-0 rounded bg-void border border-dim flex items-center justify-center overflow-hidden"
        >
          <span className="font-display text-4xl opacity-20 text-white">{title.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={category} />
          <h3 className="font-display text-xl text-white group-hover:text-acid transition-colors mt-1 leading-tight">
            {title}
          </h3>
          <p className="text-muted text-xs mt-1 line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-3 mt-2 text-xs font-mono text-muted">
            <span>{authorName}</span>
            <span>·</span>
            <span>{readTime} min</span>
            <span>·</span>
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>
      </Link>
    )
  }

  // default card
  return (
    <Link href={`/article/${slug}`} className="group block rounded-lg bg-surface border border-border hover:border-acid/30 transition-all duration-200 overflow-hidden">
      <div className="h-40 bg-void border-b border-border flex items-center justify-center relative overflow-hidden">
        <span className="font-display text-8xl opacity-10 text-white group-hover:opacity-20 transition-opacity">{title.charAt(0)}</span>
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
          style={{ backgroundColor: category?.data?.attributes?.color || '#00FF85' }}
        />
      </div>
      <div className="p-5">
        <CategoryBadge category={category} />
        <h3 className="font-display text-xl text-white group-hover:text-acid transition-colors mt-2 leading-tight">
          {title}
        </h3>
        <p className="text-muted text-sm mt-2 leading-relaxed line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between mt-4 text-xs font-mono text-muted">
          <span>{authorName}</span>
          <div className="flex items-center gap-2">
            <span>{readTime} min</span>
            <span>·</span>
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-dim rounded text-xs font-mono text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

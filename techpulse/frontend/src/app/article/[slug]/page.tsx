import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import ArticleCard from '../../../components/ArticleCard'
import { MOCK_ARTICLES } from '../../../lib/strapi'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // En production : getArticleBySlug(params.slug)
  const article = MOCK_ARTICLES.find(a => a.attributes.slug === params.slug)
  if (!article) return { title: 'Article non trouvé' }
  return {
    title: article.attributes.title,
    description: article.attributes.excerpt,
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = MOCK_ARTICLES.find(a => a.attributes.slug === params.slug)
  if (!article) notFound()

  const { title, excerpt, content, publishedAt, readTime, author, category, tags } = article.attributes
  const authorName = author?.data?.attributes?.name || 'Équipe TechPulse'
  const catData = category?.data?.attributes
  const related = MOCK_ARTICLES.filter(
    a => a.id !== article.id && a.attributes.category?.data?.id === category?.data?.id
  ).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-muted mb-8">
          <Link href="/" className="hover:text-acid transition-colors">Accueil</Link>
          <span>/</span>
          {catData && (
            <>
              <Link href={`/category/${catData.slug}`} className="hover:text-acid transition-colors">
                {catData.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white truncate max-w-xs">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article content */}
          <article className="lg:col-span-2">
            {/* Category */}
            {catData && (
              <Link
                href={`/category/${catData.slug}`}
                className="inline-flex items-center gap-2 text-sm font-mono mb-4 hover:opacity-80 transition-opacity"
                style={{ color: catData.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catData.color }} />
                {catData.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-6 animate-slide-up">
              {title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted leading-relaxed mb-8 border-l-2 border-acid pl-5">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between py-4 border-y border-border mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-dim flex items-center justify-center font-display text-white">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{authorName}</p>
                  <p className="text-xs font-mono text-muted">
                    {format(new Date(publishedAt), 'd MMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span>{readTime} min de lecture</span>
                <span className="text-muted">·</span>
                <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: fr })}</span>
              </div>
            </div>

            {/* Cover placeholder */}
            <div className="w-full aspect-[16/9] rounded-lg bg-surface border border-border flex items-center justify-center mb-10 overflow-hidden">
              <span className="font-display text-[200px] opacity-5 text-white leading-none">{title.charAt(0)}</span>
            </div>

            {/* Content */}
            <div className="prose-techpulse">
              {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h2 key={i} className="font-display text-4xl text-white mt-10 mb-4">{line.slice(2)}</h2>
                if (line.startsWith('## ')) return <h3 key={i} className="font-display text-2xl text-white mt-8 mb-3">{line.slice(3)}</h3>
                if (line === '') return <div key={i} className="h-4" />
                return <p key={i} className="text-muted leading-relaxed mb-4">{line}</p>
              })}
              {/* Demo content */}
              <p className="text-muted leading-relaxed mb-4">
                Cet article est un exemple de contenu. En production, le contenu riche vient de Strapi et est rendu avec <code className="bg-surface px-1.5 py-0.5 rounded text-acid font-mono text-sm">react-markdown</code> ou un renderer MDX personnalisé.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Strapi stocke le contenu en Markdown ou en blocs structurés (Blocks). Le composant React récupère ce contenu via l'API REST ou GraphQL et l'affiche dans cette mise en page.
              </p>
              <h2 className="font-display text-4xl text-white mt-10 mb-4">Comment ça marche</h2>
              <p className="text-muted leading-relaxed mb-4">
                Le frontend Next.js utilise <code className="bg-surface px-1.5 py-0.5 rounded text-acid font-mono text-sm">fetch()</code> avec le cache de Next.js pour récupérer les articles depuis l'API Strapi. La revalidation est configurée à 60 secondes par défaut.
              </p>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-surface border border-border rounded font-mono text-xs text-muted hover:text-acid hover:border-acid/30 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
              <span className="text-xs font-mono text-muted">Partager :</span>
              {['Twitter', 'LinkedIn', 'Copier le lien'].map(s => (
                <button
                  key={s}
                  className="px-3 py-1.5 bg-surface border border-border rounded text-xs font-mono text-muted hover:text-acid hover:border-acid/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Author card */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="font-mono text-xs text-acid uppercase tracking-widest mb-4">Auteur·e</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-dim flex items-center justify-center font-display text-2xl text-white">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{authorName}</p>
                  <p className="text-muted text-xs">Journaliste tech</p>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-display text-xl text-white mb-4">À lire aussi</h3>
                <div className="space-y-3">
                  {related.map(a => (
                    <ArticleCard key={a.id} article={a} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ArticleCard from '../components/ArticleCard'
import { MOCK_ARTICLES, MOCK_CATEGORIES } from '../lib/strapi'

export const metadata: Metadata = {
  title: 'TechPulse — Actualité Tech & Dev',
}

export default async function HomePage() {
  // En production : remplacer par getFeaturedArticles() et getArticles()
  const featured = MOCK_ARTICLES.filter(a => a.attributes.featured).slice(0, 3)
  const latest = MOCK_ARTICLES.slice(0, 6)
  const trending = MOCK_ARTICLES.slice(2, 5)

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ─── HERO ─── */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main featured */}
            <div className="lg:col-span-2 animate-slide-up">
              {featured[0] && <ArticleCard article={featured[0]} variant="featured" />}
            </div>
            {/* Secondary featured */}
            <div className="space-y-4">
              {featured.slice(1, 3).map((article, i) => (
                <div key={article.id} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                  <ArticleCard article={article} variant="default" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATÉGORIES ─── */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-2xl text-white tracking-wide">Rubriques</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOCK_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.attributes.slug}`}
                className="group p-4 rounded-lg border border-border hover:border-opacity-50 bg-surface transition-all duration-200 hover:bg-void"
                style={{ '--cat-color': cat.attributes.color } as React.CSSProperties}
              >
                <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: cat.attributes.color }} />
                <p className="font-display text-xl text-white group-hover:opacity-80 transition-opacity">
                  {cat.attributes.name}
                </p>
                <p className="text-muted text-xs mt-1">{cat.attributes.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Latest articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-2xl text-white tracking-wide">Derniers articles</h2>
              <div className="flex-1 h-px bg-border" />
              <Link href="/articles" className="text-xs font-mono text-acid hover:text-white transition-colors">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latest.map((article, i) => (
                <div key={article.id} className="animate-slide-up opacity-0-init" style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: 'forwards' }}>
                  <ArticleCard article={article} variant="default" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            {/* Trending */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-dot" />
                <h3 className="font-display text-xl text-white tracking-wide">Tendances</h3>
              </div>
              <div className="bg-surface rounded-lg border border-border p-4">
                {trending.map(article => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="relative p-6 rounded-lg border border-acid/20 bg-acid/5 overflow-hidden">
              <div className="absolute top-0 right-0 font-display text-[120px] leading-none text-acid opacity-5 select-none pointer-events-none">
                @
              </div>
              <h3 className="font-display text-2xl text-acid mb-2">Newsletter</h3>
              <p className="text-muted text-sm mb-4">
                Les meilleures actu dev chaque semaine. Pas de spam, désabonnement en 1 clic.
              </p>
              <form onSubmit={e => e.preventDefault()} className="space-y-2">
                <input
                  type="email"
                  placeholder="ton@email.dev"
                  className="w-full bg-void border border-dim rounded px-3 py-2 text-sm font-mono text-white placeholder-muted focus:outline-none focus:border-acid transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-acid text-void font-mono text-sm font-medium py-2 rounded hover:bg-white transition-colors"
                >
                  S'abonner →
                </button>
              </form>
              <p className="text-muted text-xs mt-2 font-mono">3 200+ devs abonnés</p>
            </div>

            {/* Tags cloud */}
            <div>
              <h3 className="font-display text-xl text-white tracking-wide mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'Docker', 'Kubernetes', 'Rust', 'Python', 'Next.js', 'AI', 'GraphQL', 'PostgreSQL', 'Tailwind'].map(tag => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.toLowerCase()}`}
                    className="px-2.5 py-1 bg-surface border border-border rounded text-xs font-mono text-muted hover:text-acid hover:border-acid/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

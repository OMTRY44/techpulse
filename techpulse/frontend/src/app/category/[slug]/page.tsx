import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import ArticleCard from '../../../components/ArticleCard'
import { MOCK_ARTICLES, MOCK_CATEGORIES } from '../../../lib/strapi'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = MOCK_CATEGORIES.find(c => c.attributes.slug === params.slug)
  if (!cat) return { title: 'Catégorie non trouvée' }
  return { title: `${cat.attributes.name} — TechPulse` }
}

export default function CategoryPage({ params }: Props) {
  const cat = MOCK_CATEGORIES.find(c => c.attributes.slug === params.slug)
  if (!cat) notFound()

  const articles = MOCK_ARTICLES.filter(
    a => a.attributes.category?.data?.attributes?.slug === params.slug
  )

  const { name, color, description } = cat.attributes

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-12 pb-10 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color }}>Rubrique</span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-3">{name}</h1>
          <p className="text-muted text-lg max-w-lg">{description}</p>
          <p className="font-mono text-xs text-muted mt-3">{articles.length} article{articles.length > 1 ? 's' : ''}</p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-4xl text-muted">Aucun article pour l'instant</p>
            <Link href="/" className="mt-4 inline-block text-acid font-mono text-sm hover:text-white transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, i) => (
              <div
                key={article.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ArticleCard article={article} variant={i === 0 ? 'featured' : 'default'} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

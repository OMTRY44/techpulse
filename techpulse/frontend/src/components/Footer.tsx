import Link from 'next/link'
import { MOCK_CATEGORIES } from '../lib/strapi'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-acid rounded-sm flex items-center justify-center">
                <span className="font-display text-void text-lg leading-none">T</span>
              </div>
              <span className="font-display text-2xl tracking-wider text-white">TECHPULSE</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Le média indépendant des développeurs. Actualité tech, tutoriels, benchmarks et analyses — sans bullshit, sans pub.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {['Twitter/X', 'GitHub', 'RSS'].map(s => (
                <Link key={s} href="#" className="text-muted hover:text-acid transition-colors text-xs font-mono">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-mono text-xs text-acid uppercase tracking-widest mb-4">Rubriques</h4>
            <ul className="space-y-2">
              {MOCK_CATEGORIES.map(c => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.attributes.slug}`}
                    className="text-muted hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: c.attributes.color }} />
                    {c.attributes.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs text-acid uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-muted text-sm mb-4">Les meilleures actu tech chaque semaine.</p>
            <form className="space-y-2" onSubmit={e => e.preventDefault()}>
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
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <span>© {new Date().getFullYear()} TechPulse — Fait avec ☕ et Next.js</span>
          <div className="flex items-center gap-4">
            <span>Propulsé par Strapi + Vercel</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-dot" />
              Tous systèmes opérationnels
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

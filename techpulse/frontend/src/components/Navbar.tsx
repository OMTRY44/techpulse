'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MOCK_CATEGORIES } from '../lib/strapi'

const NAV_LINKS = MOCK_CATEGORIES.map(c => ({
  label: c.attributes.name,
  href: `/category/${c.attributes.slug}`,
  color: c.attributes.color,
}))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Breaking news ticker */}
      <div className="bg-acid text-void text-xs font-mono py-1.5 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-8 mr-8">
              <span>🔴 LIVE — CVE critique OpenSSH : patch disponible</span>
              <span>⚡ Bun 1.2 — 3x plus rapide que Node.js sur HTTP</span>
              <span>🤖 Claude 4 Opus disponible en API</span>
              <span>🚀 React 19 — compilateur stable en production</span>
              <span>☁️ Google Cloud Next : annonces serverless majeures</span>
            </span>
          ))}
        </div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/95 backdrop-blur-md border-b border-border shadow-xl shadow-black/50' : 'bg-void border-b border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-acid rounded-sm flex items-center justify-center">
                <span className="font-display text-void text-lg leading-none">T</span>
              </div>
              <span className="font-display text-2xl tracking-wider text-white group-hover:text-acid transition-colors">
                TECHPULSE
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-body text-muted hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-px scale-x-0 group-hover:scale-x-100 transition-transform"
                    style={{ backgroundColor: link.color }}
                  />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-muted hover:text-acid transition-colors p-2"
                aria-label="Rechercher"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <Link
                href="/newsletter"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-acid text-void text-sm font-mono font-medium rounded hover:bg-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-void animate-pulse-dot" />
                Newsletter
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-muted hover:text-white p-2"
              >
                <div className="space-y-1.5">
                  <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-4 h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  autoFocus
                  className="w-full bg-surface border border-border rounded px-4 py-3 text-sm font-mono text-white placeholder-muted focus:outline-none focus:border-acid transition-colors pr-10"
                />
                <svg className="absolute right-3 top-3.5 text-muted" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-surface animate-slide-up">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-muted hover:text-white hover:bg-void transition-colors border-b border-border"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: link.color }} />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}

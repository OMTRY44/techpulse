import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TechPulse — Actualité Tech & Dev',
    template: '%s | TechPulse',
  },
  description: 'Le média indépendant de référence sur le développement web, le DevOps, l\'IA et la cybersécurité.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'TechPulse',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}

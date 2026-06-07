const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

export interface StrapiMedia {
  data: {
    id: number
    attributes: {
      url: string
      alternativeText: string
      width: number
      height: number
    }
  } | null
}

export interface Author {
  id: number
  attributes: {
    name: string
    bio: string
    avatar: StrapiMedia
  }
}

export interface Category {
  id: number
  attributes: {
    name: string
    slug: string
    color: string
    description: string
  }
}

export interface Article {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: string
    publishedAt: string
    readTime: number
    featured: boolean
    cover: StrapiMedia
    author: { data: Author }
    category: { data: Category }
    tags: string[]
  }
}

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

async function fetchStrapi<T>(
  path: string,
  options: RequestInit = {}
): Promise<StrapiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  }

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers,
    next: { revalidate: 60 },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Strapi error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export function getMediaUrl(media: StrapiMedia): string {
  if (!media?.data) return '/placeholder.jpg'
  const url = media.data.attributes.url
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

// Articles
export async function getArticles(params: {
  page?: number
  pageSize?: number
  category?: string
  featured?: boolean
} = {}): Promise<StrapiResponse<Article[]>> {
  const { page = 1, pageSize = 10, category, featured } = params
  
  let query = `?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`
  
  if (category) {
    query += `&filters[category][slug][$eq]=${category}`
  }
  if (featured !== undefined) {
    query += `&filters[featured][$eq]=${featured}`
  }

  return fetchStrapi<Article[]>(`/articles${query}`)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetchStrapi<Article[]>(
    `/articles?populate=*&filters[slug][$eq]=${slug}`
  )
  return res.data[0] || null
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const res = await getArticles({ featured: true, pageSize: 5 })
  return res.data
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetchStrapi<Category[]>('/categories?populate=*')
  return res.data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetchStrapi<Category[]>(
    `/categories?filters[slug][$eq]=${slug}`
  )
  return res.data[0] || null
}

// Search
export async function searchArticles(query: string): Promise<Article[]> {
  const res = await fetchStrapi<Article[]>(
    `/articles?populate=*&filters[$or][0][title][$containsi]=${query}&filters[$or][1][excerpt][$containsi]=${query}&sort=publishedAt:desc`
  )
  return res.data
}

// ---- MOCK DATA for demo / development without Strapi ----
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, attributes: { name: 'Frontend', slug: 'frontend', color: '#00FF85', description: 'React, Vue, CSS & UI' } },
  { id: 2, attributes: { name: 'Backend', slug: 'backend', color: '#0066FF', description: 'Node, APIs & databases' } },
  { id: 3, attributes: { name: 'DevOps', slug: 'devops', color: '#FF6B00', description: 'Cloud, Docker & CI/CD' } },
  { id: 4, attributes: { name: 'IA & ML', slug: 'ia-ml', color: '#FF0066', description: 'Intelligence artificielle' } },
  { id: 5, attributes: { name: 'Sécurité', slug: 'securite', color: '#9B59B6', description: 'Cybersécurité & vulnérabilités' } },
]

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    attributes: {
      title: 'React 19 : tout ce qui change avec le compilateur',
      slug: 'react-19-compilateur',
      excerpt: 'Le nouveau compilateur React transforme radicalement la façon d\'optimiser les rendus. Plus besoin de useMemo ou useCallback dans 90% des cas.',
      content: '# React 19 et le compilateur\n\nLe compilateur React est enfin stable...',
      publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      readTime: 8,
      featured: true,
      cover: { data: null },
      author: { data: { id: 1, attributes: { name: 'Sophie Martin', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[0] },
      tags: ['React', 'JavaScript', 'Performance'],
    },
  },
  {
    id: 2,
    attributes: {
      title: 'Bun 1.2 écrase Node.js sur les benchmarks HTTP',
      slug: 'bun-1-2-benchmarks',
      excerpt: 'Bun 1.2 affiche des performances HTTP 3x supérieures à Node.js 22 sur les routes simples. On a testé en conditions réelles.',
      content: '# Bun 1.2 vs Node.js\n\nLes chiffres parlent d\'eux-mêmes...',
      publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      readTime: 12,
      featured: true,
      cover: { data: null },
      author: { data: { id: 2, attributes: { name: 'Karim Bensaid', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[1] },
      tags: ['Bun', 'Node.js', 'Performance', 'Backend'],
    },
  },
  {
    id: 3,
    attributes: {
      title: 'Google Cloud Run vs Vercel : lequel choisir en 2025 ?',
      slug: 'cloud-run-vs-vercel-2025',
      excerpt: 'Déploiement, pricing, cold starts, régions... On compare les deux plateformes sur 12 critères concrets pour vous aider à choisir.',
      content: '# Cloud Run vs Vercel\n\nDeux philosophies très différentes...',
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      readTime: 15,
      featured: false,
      cover: { data: null },
      author: { data: { id: 1, attributes: { name: 'Sophie Martin', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[2] },
      tags: ['Cloud', 'Vercel', 'Google Cloud', 'DevOps'],
    },
  },
  {
    id: 4,
    attributes: {
      title: 'Claude 4 : les développeurs testent les artifacts en prod',
      slug: 'claude-4-artifacts-prod',
      excerpt: 'Des équipes early adopters partagent leur retour d\'expérience sur l\'intégration de Claude 4 dans leurs workflows de développement.',
      content: '# Claude 4 en production\n\nRetour d\'expérience...',
      publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      readTime: 10,
      featured: true,
      cover: { data: null },
      author: { data: { id: 3, attributes: { name: 'Léa Dumont', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[3] },
      tags: ['IA', 'Claude', 'LLM', 'Développement'],
    },
  },
  {
    id: 5,
    attributes: {
      title: 'CVE critique dans OpenSSH : patchez maintenant',
      slug: 'cve-openssh-critique',
      excerpt: 'Une vulnérabilité RCE critique (CVSS 9.8) affecte toutes les versions d\'OpenSSH antérieures à 9.8. Voici comment vous protéger.',
      content: '# CVE OpenSSH\n\nCette vulnérabilité est sérieuse...',
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      readTime: 6,
      featured: false,
      cover: { data: null },
      author: { data: { id: 2, attributes: { name: 'Karim Bensaid', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[4] },
      tags: ['Sécurité', 'OpenSSH', 'CVE', 'Linux'],
    },
  },
  {
    id: 6,
    attributes: {
      title: 'Tailwind CSS v4 : la révolution du CSS-first',
      slug: 'tailwind-v4-css-first',
      excerpt: 'Tailwind abandonne le fichier de config JS au profit du CSS natif. Cascade layers, container queries, design tokens... tout change.',
      content: '# Tailwind v4\n\nUne réécriture complète...',
      publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      readTime: 9,
      featured: false,
      cover: { data: null },
      author: { data: { id: 3, attributes: { name: 'Léa Dumont', bio: '', avatar: { data: null } } } },
      category: { data: MOCK_CATEGORIES[0] },
      tags: ['Tailwind', 'CSS', 'Frontend'],
    },
  },
]

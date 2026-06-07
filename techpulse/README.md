# TechPulse 🚀

Média tech full-stack avec **Next.js 14** (frontend) + **Strapi v4** (CMS headless).

```
techpulse/
├── frontend/          # Next.js 14 + Tailwind CSS
├── backend/           # Strapi v4 (CMS + API REST)
├── docker-compose.yml # Dev local tout-en-un
└── README.md
```

---

## ⚡ Démarrage rapide (dev local)

### Option A — Docker (recommandé)

```bash
# 1. Cloner et configurer les env
cp backend/.env.example backend/.env
# Remplis les APP_KEYS etc. dans backend/.env

# 2. Lancer tout
docker compose up -d

# Frontend → http://localhost:3000
# Strapi admin → http://localhost:1337/admin
# Adminer DB → http://localhost:8080
```

### Option B — Sans Docker

```bash
# Terminal 1 : Backend Strapi
cd backend
cp .env.example .env     # configure tes clés
npm install
npm run develop          # http://localhost:1337/admin

# Terminal 2 : Frontend Next.js
cd frontend
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
```

---

## 🔧 Configuration Strapi

### 1. Premier lancement
Ouvre `http://localhost:1337/admin` → crée ton compte admin.

### 2. Créer les Content Types
Les schémas sont déjà définis dans `backend/src/api/`. Strapi les détecte automatiquement :
- **Article** : title, slug, excerpt, content, cover, featured, readTime, tags, author, category
- **Category** : name, slug, description, color
- **Author** : name, bio, avatar, twitter

### 3. Permissions API publiques
Settings → Users & Permissions Plugin → Roles → **Public**

Cocher `find` et `findOne` pour : Article, Category, Author

### 4. Générer un API Token
Settings → API Tokens → Create API Token  
Type : **Read-only** — Copie le token dans `frontend/.env.local`

### 5. Connecter au frontend
Dans `frontend/.env.local` :
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=xxxx
```

Dans `frontend/src/app/page.tsx`, remplace le mock par les vraies données :
```typescript
// Avant (mock)
const articles = MOCK_ARTICLES

// Après (Strapi)
const { data: articles } = await getArticles({ pageSize: 6 })
const featured = await getFeaturedArticles()
```

---

## 🌐 Déploiement

### Frontend → Vercel (recommandé)

```bash
cd frontend
npx vercel

# Variables d'environnement dans le dashboard Vercel :
# NEXT_PUBLIC_STRAPI_URL = https://ton-strapi.run.app
# STRAPI_API_TOKEN       = ton_token
```

Ou via GitHub : connecte le repo → Vercel détecte Next.js automatiquement.

---

### Backend Strapi → Google Cloud Run

#### Prérequis
- Google Cloud SDK installé (`gcloud`)
- Projet GCP créé
- Cloud SQL (PostgreSQL) configuré OU utilise [Railway](https://railway.app) / [Supabase](https://supabase.com) pour la DB

#### Étapes

```bash
cd backend

# 1. Configurer le projet GCP
gcloud config set project TON_PROJECT_ID

# 2. Build et push l'image Docker
gcloud builds submit --tag gcr.io/TON_PROJECT/techpulse-strapi

# 3. Déployer sur Cloud Run
gcloud run deploy techpulse-strapi \
  --image gcr.io/TON_PROJECT/techpulse-strapi \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 1337 \
  --memory 1Gi \
  --set-env-vars "DATABASE_CLIENT=postgres,DATABASE_URL=postgresql://..." \
  --set-env-vars "APP_KEYS=...,JWT_SECRET=...,API_TOKEN_SALT=..." \
  --set-env-vars "FRONTEND_URL=https://ton-site.vercel.app"
```

> 💡 **Uploads média** : en prod sur Cloud Run, utilise **Google Cloud Storage** pour les fichiers uploadés.  
> Installe `@strapi/provider-upload-google-cloud-storage` et configure-le dans `backend/config/plugins.js`.

---

### Backend Strapi → Railway (plus simple)

1. Va sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Sélectionne le dossier `backend/`
4. Ajoute un service **PostgreSQL** depuis Railway
5. Configure les variables d'environnement
6. Railway génère une URL publique → copie-la dans Vercel

---

## 📁 Structure du frontend

```
frontend/src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── article/[slug]/page.tsx     # Page article
│   ├── category/[slug]/page.tsx    # Page catégorie
│   └── layout.tsx                  # Layout global
├── components/
│   ├── Navbar.tsx                  # Navigation + ticker + search
│   ├── ArticleCard.tsx             # Carte article (4 variantes)
│   └── Footer.tsx                  # Footer + newsletter
├── lib/
│   └── strapi.ts                   # Client API + types TypeScript
└── styles/
    └── globals.css                 # CSS global + variables
```

## 🎨 Design System

- **Police display** : Bebas Neue (titres)
- **Police body** : DM Sans (texte)
- **Police mono** : JetBrains Mono (meta, code)
- **Couleur accent** : `#00FF85` (acid green)
- **Fond** : `#080808` (void)
- **Surface** : `#111111`

## 🔌 API Strapi — Endpoints utiles

```
GET /api/articles?populate=*&sort=publishedAt:desc
GET /api/articles?filters[slug][$eq]=mon-slug&populate=*
GET /api/articles?filters[featured][$eq]=true&populate=*
GET /api/articles?filters[category][slug][$eq]=frontend&populate=*
GET /api/categories?populate=*
```

## 📦 Stack technique

| Couche | Techno |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| CMS/API | Strapi v4, REST API |
| Base de données | SQLite (dev), PostgreSQL (prod) |
| Déploiement frontend | Vercel |
| Déploiement backend | Google Cloud Run / Railway |
| Dev local | Docker Compose |

---

Made with ☕ — Licence MIT

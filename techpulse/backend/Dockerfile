# ── Strapi Backend Dockerfile ──
# Compatible Google Cloud Run

FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Dépendances
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build admin panel
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist
COPY . .

# Port Cloud Run
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start"]

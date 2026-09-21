FROM node:20-alpine AS base

# ── deps: install production + dev dependencies ───────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── builder: compile the app ──────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── runner: minimal production image ─────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# NESHAN_API_KEY is deliberately NOT set here. app/map/static/route.ts reads it
# at RUNTIME, so it belongs in the container's environment (docker-compose
# `environment:`), not baked into an image layer — rotating the key then needs
# no rebuild, and the secret never ships inside the image.
#
# It used to be a build-time value, because /map/static was a rewrite and
# next.config.ts bakes rewrite destinations — key and all — into
# .next/routes-manifest.json during `next build`. The route handler replaced
# that so the response could carry its own Cache-Control, which moved when the
# key is needed. Nothing ever supplied it: the deploy workflow passes no
# --build-arg, so production served Neshan's 480 "API Key not found" from the
# day the map shipped until 2026-09-21.
#
# Unset → Neshan 480s → CourtMap hides the map and keeps مسیریابی, which needs
# no key.

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

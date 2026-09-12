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

# next.config.ts resolves rewrites() during `next build` and bakes the result
# into .next/routes-manifest.json, so the Neshan key has to exist HERE, at build
# time. Setting it only on the running container does nothing — the destination
# URL is already written, with an empty key, and every court map 480s.
# Passed by CI as --build-arg from the NESHAN_API_KEY CI/CD variable.
ARG NESHAN_API_KEY=""
ENV NESHAN_API_KEY=$NESHAN_API_KEY

RUN npm run build

# ── runner: minimal production image ─────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

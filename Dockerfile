# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM --platform=$TARGETPLATFORM node:18.14.2-bullseye-slim AS base
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node

FROM base AS builder
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node next.config.js ./
COPY --chown=node:node middleware.ts ./
COPY --chown=node:node components components
COPY --chown=node:node config config
COPY --chown=node:node containers containers
COPY --chown=node:node modules modules
COPY --chown=node:node pages pages
COPY --chown=node:node public public
# TODO: Sad workaround
ARG ENV_FILE=.env
COPY --chown=node:node $ENV_FILE ./.env
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

#########################################

FROM base

USER root
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN rm /app/.env

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
RUN echo "$COMMIT_SHA" > ./public/__commit_sha__
LABEL commit-sha="$COMMIT_SHA"

EXPOSE 3000

ENV PORT 3000

USER nextjs

ENTRYPOINT ["/tini", "--"]
CMD ["node", "server.js"]

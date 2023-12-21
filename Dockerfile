ARG NODE_VERSION
FROM node:${NODE_VERSION}
WORKDIR /app
COPY . .
RUN corepack enable pnpm \
  && pnpm install --frozen-lockfile \
  && pnpm build \
  && npm i -g ./apps/registry
ENV NODE_ENV=production
CMD ["pnpm", "start"]

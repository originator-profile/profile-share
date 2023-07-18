ARG NODE_VERSION
FROM node:${NODE_VERSION} as builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile \
  && yarn build \
  && yarn workspace @originator-profile/registry pack \
  && mv apps/registry/originator-profile-registry-v*.tgz profile-registry.tgz

FROM node:${NODE_VERSION}
WORKDIR /app
COPY --from=builder /app/profile-registry.tgz ./
RUN npm install profile-registry.tgz
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
CMD ["npx", "profile-registry", "start"]

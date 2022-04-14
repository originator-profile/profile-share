ARG NODE_IMAGE
FROM ${NODE_IMAGE} as builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM ${NODE_IMAGE}
WORKDIR /app
COPY --from=builder /app/apps/registry/dist .
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN npm install @prisma/client
CMD ["index.js"]

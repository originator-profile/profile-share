import { FastifySchema, FastifyRequest } from "fastify";

const schema: FastifySchema = {
  tags: ["internal"],
  description: "アプリケーションのバージョン情報を取得します。",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      properties: {
        version: {
          type: "string",
          description: "アプリケーションのバージョン",
        },
        commitHash: { type: "string", description: "Git のコミットハッシュ" },
        prismaMigration: {
          type: "string",
          description: "最新の Prisma マイグレーション",
        },
      },
      required: ["version", "commitHash", "prismaMigration"],
    },
  },
};

async function get({ server }: FastifyRequest) {
  const versionInfo = {
    version: server.config.APP_VERSION || "unknown",
    commitHash: server.config.GIT_COMMIT_HASH || "unknown",
    prismaMigration: server.config.PRISMA_MIGRATION || "unknown",
  };

  return versionInfo;
}

export { get, schema };

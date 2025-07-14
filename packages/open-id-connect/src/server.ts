import Fastify from "fastify";
import { FastifyInstance } from "fastify";

export const createServer = (): FastifyInstance => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(async function (fastify) {
    await fastify.register(import("./routes/auth"), { prefix: "/auth" });
  });

  return fastify;
};

// 開発用サーバー起動
if (require.main === module) {
  const server = createServer();

  const start = async () => {
    try {
      console.log("Starting OpenID Connect server...");
      await server.listen({ port: 3000, host: "0.0.0.0" });
      console.log("Server is running on http://localhost:3000");
      console.log("Login endpoint: http://localhost:3000/auth/login");
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  start();
}

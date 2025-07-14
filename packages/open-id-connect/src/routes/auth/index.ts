import { FastifyPluginAsync } from "fastify";
import * as client from "openid-client";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /auth/login - ログイン開始（認可URLへリダイレクト）
  fastify.get("/login", async (request, reply) => {
    console.log("GET /auth/login endpoint called");

    // TODO: OpenID Connect認可URL生成とリダイレクト処理を実装
  });

  // GET /auth/callback - 認可コールバック（認可コード受け取り）
  fastify.get("/callback", async (request, reply) => {
    console.log("GET /auth/callback endpoint called");

    // TODO: 認可コード処理とトークン取得を実装
  });
};

export default authRoutes;

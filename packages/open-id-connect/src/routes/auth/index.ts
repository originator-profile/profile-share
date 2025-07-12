import { FastifyPluginAsync } from 'fastify';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /auth/login - ログイン開始（認可URLへリダイレクト）
  fastify.get('/login', async (request, reply) => {
    console.log('GET /auth/login endpoint called');

    // TODO: OpenID Connect認可URL生成とリダイレクト処理を実装
  });


  // GET /auth/callback - 認可コールバック（認可コード受け取り）
  fastify.get('/callback', async (request, reply) => {
    console.log('GET /auth/callback endpoint called');

    // TODO: 認可コード処理とトークン取得を実装
  });

  // POST /auth/refresh - トークンリフレッシュ
  fastify.post('/refresh', async (request, reply) => {
    console.log('POST /auth/refresh endpoint called');

    // TODO: トークンリフレッシュ処理を実装
  });

  // GET /auth/logout - ログアウト
  fastify.get('/logout', async (request, reply) => {
    console.log('GET /auth/logout endpoint called');

    // TODO: ログアウト処理を実装
  });

  // GET /auth/status - 認証状態確認
  fastify.get('/status', async (request, reply) => {
    console.log('GET /auth/status endpoint called');

    // TODO: 認証状態確認処理を実装
  });
};

export default authRoutes;

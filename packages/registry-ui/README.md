# Profile Registry UI

レジストリのフロントエンドのソースコードです。

- 開発時は apps/registry のサーバーを起動すると HMR サーバーが起動するのでそれを使ってください。
  - 本番環境向けのビルドは `pnpm build`

フレームワークとして[vite](https://vitejs.dev/)を使っています。

## 環境変数

AUTH0_DOMAIN
: Auth0のテナントのドメイン名 (Auth0 dashboard -> Application -> Settings -> Domain)

AUTH0_AUDIENCE
: レジストリのURL (Auth0 dashboard -> Applications -> APIs)

AUTH0_CLIENT_ID
: Auth0 Client ID (Auth0 dashboard -> Application -> Settings -> Client ID)

REGISTRY_OPS
: Core Profileのイシュアーの公開鍵を含むOPS

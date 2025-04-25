# Profile Registry UI

レジストリのフロントエンドのソースコードです。

- 開発時は apps/registry のサーバーを起動すると HMR サーバーが起動するのでそれを使ってください。
  - 本番環境向けのビルドは `pnpm --filter @originator-profile/registry ui:build`
- 依存パッケージのインストールはこのディレクトリで行ってください。

フレームワークとして[vite](https://vitejs.dev/)を使っています。
その設定ファイルは apps/registry/ 配下にあります。

## 環境変数

VITE_AUTH0_DOMAIN
: Auth0のテナントのドメイン名 (Auth0 dashboard -> Application -> Settings -> Domain)

VITE_AUTH0_AUDIENCE
: レジストリのURL (Auth0 dashboard -> Applications -> APIs)

VITE_AUTH0_CLIENT_ID
: Auth0 Client ID (Auth0 dashboard -> Application -> Settings -> Client ID)

VITE_REGISTRY_OPS
: Core Profileのイシュアーの公開鍵を含むOPS

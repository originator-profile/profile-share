# demo-page

複数のOPS/CASを含むデモページを作成します。

フレームワークとして[vite](https://vitejs.dev/)を使っています。

- 開発時は `pnpm dev` 後、 http://localhost:5173/ にアクセスすることでデモページを閲覧できます。
- サイトのビルドは `pnpm build` です。
- `pnpm preview` 後、 http://localhost4173/ にアクセスすることで、ビルドしたものを閲覧できます。
- デモページは、Cloudflareにてデプロイされています( https://demo.exp.originator-profile.org/ にて閲覧できます)。
- ./images にはデモページにて使用する画像ファイル、./public/imagaes には PA/WMPに使用した画像ファイルが格納されています。

## インストール

依存関係にあるパッケージのインストールを行います。

```bash
# pnpm
pnpm install
```

## 手動デプロイ方法

```bash
# wranglerにログインします。
npx wrangler login

# ログインしたアカウントを確認します。
npx wrangler whoami

# ./wrangler.toml の ${CF_ACCOUNT_ID}部分にデプロイしたいアカウントIDを設定します。

# デプロイします。
# ※ ./dist の内容がデプロイされますので、pnpm build 後にデプロイしてください。
npx wrangler deploy
```

---
sidebar_position: 2
---

# レジストリ DB 参照

現状は前述した役割が誰であっても、このリポジトリを clone して コマンドラインで作業を行うことになります。
詳しくは[開発ガイド](/development/)を参照してください。

あらかじめ以下の環境変数を apps/registry/.env に設定します。

| 環境変数     | 内容                                           |
| ------------ | ---------------------------------------------- |
| DATABASE_URL | [PostgreSQL 接続 URL][postgres_connection_url] |

PostgreSQL 接続 URL は、 [Heroku Data][heroku_data_url] の Settings -> Administration -> Database Credentials -> URI を指定する。

[postgres_connection_url]: https://www.prisma.io/docs/reference/database-connectors/connection-urls/
[heroku_data_url]: https://data.heroku.com/

### DB の内容の参照

Prisma Studio を使用して DB の内容を参照する。

```sh
cd apps/registry
npm i -g .
profile-registry db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

Prisma Studio が起動します。現在レジストリ側に登録されている OP / DP 情報が閲覧できます。

<img width="1552" alt="Prisma Studioの画面が起動した" src="https://user-images.githubusercontent.com/281424/193489958-76ffdb86-3e58-4442-a230-740402c5fcad.png" />

今回は`roleValue`の列に`certifier`と役割を担っている`oprexpt.originator-profile.org`に認証を受けるというシチュエーションを例に作業を解説します。

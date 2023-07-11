---
sidebar_position: 2
---

# レジストリ DB 参照

CLI の一部操作はレジストリ DB の参照が必要です。本ページではレジストリ DB 参照のための設定方法を説明します。

CLI のインストールを含む開発環境の構築方法については、[開発ガイド](/development/)を参照してください。

以下の環境変数を .env ファイルに設定します。

| 環境変数     | 内容                                           |
| ------------ | ---------------------------------------------- |
| DATABASE_URL | [PostgreSQL 接続 URL][postgres_connection_url] |

Heroku Postgres を使用している場合は、PostgreSQL 接続 URL を [Heroku Data][heroku_data_url] の Settings -> Administration -> Database Credentials -> URI から参照します。

[postgres_connection_url]: https://www.prisma.io/docs/reference/database-connectors/connection-urls/
[heroku_data_url]: https://data.heroku.com/

### DB の内容の参照

以下のコマンドを実行すると、Prisma Studio を使用して DB の内容を参照することができます。

```sh
profile-registry db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

レジストリに登録されている ops テーブルのレコードや、 dps テーブルのレコードなどが閲覧できます。

<img width="1552" alt="Prisma Studioの画面が起動した" src="https://user-images.githubusercontent.com/281424/193489958-76ffdb86-3e58-4442-a230-740402c5fcad.png" />

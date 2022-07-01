# Profile Registry 操作手順

あらかじめ以下の環境変数を apps/registry/.env に設定する。

| 環境変数     | 内容                                           |
| ------------ | ---------------------------------------------- |
| DATABASE_URL | [PostgreSQL 接続 URL][postgres_connection_url] |

PostgreSQL 接続 URL は、 [Heroku Data][heroku_data_url] の Settings -> Administration -> Database Credentials -> URI を指定する。

[postgres_connection_url]: https://www.prisma.io/docs/reference/database-connectors/connection-urls/
[heroku_data_url]: https://data.heroku.com/

## DB の内容の参照

Prisma Studio を使用して DB の内容を参照する。

```bash
cd apps/registry
yarn dotenv -e .env bin/dev db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

## OP 登録手順

Profile Registry を使用して OP を登録する。
下記のコマンドは apps/registry ディレクトリで実行する。

### 会員登録

OP に登録する内容の JSON ファイルを作成し以下のコマンドで登録を行う。

```console
$ yarn dotenv -e .env bin/dev account -i account.json -o create
UUID: daab5a08-d513-400d-aaaa-e1c1493e0421
```

account.json の例
[account.example.json](https://github.com/webdino/profile/blob/main/apps/registry/account.example.json)

### 鍵作成と登録

```console
$ yarn dotenv -e .env bin/dev key-gen -o key
$ yarn dotenv -e .env bin/dev account:register-key -k key.pub.json --id daab5a08-d513-400d-aaaa-e1c1493e0421
```

id には会員登録時の UUID を指定する。

### OP 発行

```bash
yarn dotenv -e .env bin/dev cert:issue \
  -i key \
  --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e \
  --holder daab5a08-d513-400d-aaaa-e1c1493e0421
```

https://oprdev.herokuapp.com の場合であれば --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e を指定する。

-i は、作成した秘密鍵、--holder は会員登録時の UUID を指定する。

### 配置

サイトに配置する際は、トップディレクトリの .well-known に以下のファイルを配置する。

jwks.json

```jsonc
{
  "keys": [
    {
      // <- 鍵作成の手順で作成した公開鍵
      "kty": "EC",
      "crv": "P-256",
      "x": "RgL8PBexMWj8IC813OJQDBgrv9V13KyzHifkzZv4RzM",
      "y": "-gyrOp0An5EzvdoBqNxkutBUqDhLMbWODyUERNz6ckk"
    }
  ]
}
```

op-document

```jsonc
{
  "@context": "https://oprdev.herokuapp.com/context",
  "main": ["https://examples.demosites.pages.dev"], // <- 会員登録時に指定した URL
  "profile": [
    // <- 発行した OP の値 ops - jwt の値
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
  ]
}
```

登録した OP は Prisma Studio で見ることができる。

### logo の登録

DB の logos テーブルに内容を追加する。

```json
{
  "url": "https://yomiuri.demosites.pages.dev/logos/logs.png",
  "isMain": true,
  "accountId": "759fa613-3c70-485a-abfc-172b25c9d1fa" <- 登録したい会員の ID を指定する
}
```

上記は、よみうりの場合(log ファイルを `https://yomiuri.demosites.pages.dev/logos/logs.png` に配置)

DB を編集後 OP を再発行する。

### OP 削除

DB 対象の値を Prisma Studio を立ち上げて削除する。

## DP 登録手順

### DP の発行

予め account の key 登録と OP の発行を行っている必要がある。

上記で登録した daab5a08-d513-400d-aaaa-e1c1493e0421 の会員に対して https://yomiuri.demosites.pages.dev/1 の DP を発行する例

```json
{
  "url": "https://yomiuri.demosites.pages.dev/1",
  "location": "[itemprop=articleBody]",
  "bodyFormat": { "connect": { "value": "text" } },
  "body": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "title": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "description": "https://yomiuri.demosites.pages.dev/1 の備考",
  "author": "前木 理一郎",
  "category": "スポーツ > 野球",
  "editor": "デジタル編集部"
}
```

```bash
yarn dotenv -e .env bin/dev publisher:website \
  -i key \
  --id daab5a08-d513-400d-aaaa-e1c1493e0421 \
  --input website.json \
  -o create
```

website.json の例
[website.example.json](https://github.com/webdino/profile/blob/main/apps/registry/website.example.json)

オプションについては、[apps/registry/README.md](https://github.com/webdino/profile/tree/main/apps/registry) を参照

### 配置

上記のコマンドを実行すると DB の dps にエントリが生成される。
生成されたエントリの jwt を op-document の profile に追加する。

op-document

```jsonc
{
  "@context": "https://oprdev.herokuapp.com/context",
  "main": ["https://examples.demosites.pages.dev"], // <- 会員登録時に指定した URL
  "profile": [
    "eyJhbGciOiJFUzI1NiIsInR7cCI6IkpXVCJ9..."
    // <- 発行した DP の値 dps - jwt の値を追加する
  ]
}
```

---
sidebar_position: 2
sidebar_label: 操作説明書
---

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

```console
cd apps/registry
yarn dotenv -e .env bin/dev db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

## Profiles Set 作成手順

Profile Registry を使用して Signed Originator Profile、Signed Document Profile を発行し、Profiles Set を作成する手順について。

下記のコマンドは apps/registry ディレクトリで実行する。

### 会員登録

会員登録する内容の JSON ファイルを作成し以下のコマンドで登録を行う。

```console
yarn dotenv -e .env bin/dev account -i account.json -o create
{
  "id": "daab5a08-d513-400d-aaaa-e1c1493e0421",
  ...
}
```

#### account.json の例

[account.example.json](https://github.com/webdino/profile/blob/main/apps/registry/account.example.json)

#### トヨタ登録時の例

```jsonc
{
  "url": "https://toyota.demosites.pages.dev",
  "roleValue": "group",
  "name": "トヨタ自動車株式会社",
  "description": "トヨタ自動車株式会社詳細",
  "email": null,
  "phoneNumber": "0565-28-2121",
  "postalCode": "471-8571",
  "addressCountry": "JP",
  "addressRegion": "愛知県",
  "addressLocality": "豊田市",
  "streetAddress": "トヨタ町1番地",
  "contactTitle": "FAQ・お問い合わせ",
  "contactUrl": "https://global.toyota/jp/faq",
  "privacyPolicyTitle": "プライバシー",
  "privacyPolicyUrl": "https://global.toyota/jp/sustainability/privacy",
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null,
  "logos": {
    "create": [
      {
        "url": "https://toyota.demosites.pages.dev/logos/horizontal-toyota.svg",
        "isMain": true
      }
    ]
  }
}
```

「トヨタ」は、トヨタ自動車株式会社の登録商標です。

### 鍵ペアの生成

```console
yarn dotenv -e .env bin/dev key-gen -o key
```

key には出力ファイル名を指定する。

### 公開鍵の登録

```console
yarn dotenv -e .env bin/dev account:register-key -k key.pub.json --id daab5a08-d513-400d-aaaa-e1c1493e0421
```

--id には登録を行う会員の UUID を指定する。

### Signed Originator Profile 発行

```console
yarn dotenv -e .env bin/dev cert:issue \
  -i key \
  --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e \
  --holder daab5a08-d513-400d-aaaa-e1c1493e0421
```

https://oprdev.herokuapp.com の場合であれば --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e を指定する。

-i は、certifier の秘密鍵、--holder は会員登録時の UUID を指定する。

削除を行う場合は、Prisma Studio を立ち上げ削除する。

### Signed Document Profile 登録手順

予め会員登録、公開鍵の登録、Signed Originator Profile 発行を行っておく必要がある。

上記で登録した daab5a08-d513-400d-aaaa-e1c1493e0421 の会員に対して https://yomiuri.demosites.pages.dev/1 の Signed Document Profile を発行する例

```console
yarn dotenv -e .env bin/dev publisher:website \
  -i key \
  --id daab5a08-d513-400d-aaaa-e1c1493e0421 \
  --input website.json \
  -o create
```

オプションについては、[apps/registry/README.md](https://github.com/webdino/profile/tree/main/apps/registry) を参照

#### website.json の例

[website.example.json](https://github.com/webdino/profile/blob/main/apps/registry/website.example.json)

#### 読売新聞社の記事登録の例

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

「読売新聞社」は、株式会社読売新聞東京本社の登録商標です。

### デプロイ用 Profiles Set の作成

サイトに配置する際は、トップディレクトリの .well-known に以下のファイルを配置する。

- jwks.json
- op-document

または、HTML 中に Profiles Set への \<link\> 要素を追加する。

#### jwks.json

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

#### op-document

ページ内に複数の DP が存在する場合があるので、それぞれの jwt の値は profile の配列に記述する。

```jsonc
{
  "@context": "https://oprdev.herokuapp.com/context",
  "main": ["https://examples.demosites.pages.dev"],
  "profile": [
    // <- 発行した Signed Originator Profile の値 ops - jwt の値
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
    // <- 発行した Signed Document Profile の値 dps - jwt の値
    "eaXQbGciOiJFUzI1NiaXQiOlsiY6IkpXVCaX..."
  ]
}
```

[\<link\>](https://github.com/webdino/profile/blob/main/docs/spec.md#link) 要素の追加方法はリンク先に参照

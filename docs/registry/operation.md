# 操作手順

apps/registry 実行時に以下の環境変数を apps/registry/.env に設定する

| 環境変数     | 内容            |
| ------------ | --------------- |
| DATABASE_URL | DATABASE 接続先 |

DATABASE 接続先は、data.heroku.com の Settings -> Administration -> Database Credentials -> URI を指定する

## DB の内容参照

studio の起動を起動して DB の内容を参照する

```bash
cd apps/registry
yarn dotenv -e .env bin/dev db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

## OP 登録手順

apps/registry を使って OP を登録する手順 apps/registry ディレクトリで実行する

### アカウント登録

OP に登録する内容の JSON ファイルを作成し以下のコマンドで登録を行う

```bash
$ yarn dotenv -e .env bin/dev account:register -i account.json
{
"id": "daab5a08-d513-400d-aaaa-e1c1493e0421",
...
}
```

account.json の例
[account.example.json](https://github.com/webdino/profile/blob/main/apps/registry/account.example.json)

### 鍵作成と登録

```bash
$ yarn dotenv -e .env bin/dev key-gen -o key
$ yarn dotenv -e .env bin/dev account:register-key -k key.pub.json --id daab5a08-d513-400d-aaaa-e1c1493e0421
```

id には account:register 実行時の id を使用する

### OP 発行

```bash
yarn dotenv -e .env bin/dev cert:issue --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e -i key --holder daab5a08-d513-400d-aaaa-e1c1493e0421
```

https://oprdev.herokuapp.com　の場合であれば --certifier 48a40d8c-4fb0-4f32-9bf4-9e85f07ae54e を指定する。
発行者を作成し別途指定することもできる。その場合、ISSUER_UUID を指定する必要がある [#7](https://github.com/webdino/profile-samples/issues/7#issuecomment-1114494665)

-i は、作成した秘密鍵、--holder はアカウント登録時の id を指定する。

### 配置

サイトに配置する際は、トップディレクトリの .well-known に以下のファイルを配置する。

jwks.json

```json
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

```json
{
  "@context": "https://oprdev.herokuapp.com/context",
  "main": ["https://suntory.demosites.pages.dev"], // <- アカウント登録時に指定した URL
  "profile": [
    // <- 発行した OP の値 ops - jwt の値
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...6zNuTzuaVP5r7RkGYWjcKUx7TRCXZGRiHSF10PFaBe3Et8BqRdITxVZfbBy2Ho0l0Nu0zS3E7PeY6_jjmYrRg"
  ]
}
```

登録した OP は studio で見ることができる

### OP 削除

DB 対象の値を studio を立ち上げて削除する

OP(ops, publications), accounts, keys の削除以下の順番で削除を行う

publications -> ops
keys -> accounts

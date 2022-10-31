# Profile Registry

Originator Profile と Document Profile の管理を行うシステムです。

デモ: https://oprdev.herokuapp.com/

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/webdino/profile)

- [Dependencies](#dependencies)
- [Usage](#usage)
- [Commands](#commands)

## Dependencies

[開発ガイド](https://github.com/webdino/profile/blob/main/docs/development.md)を参照してください。

## Usage

```
$ bin/dev COMMAND
running command...
```

以降、`bin/dev` は `profile-registry` と表記します。

## Commands

<!-- prettier-ignore-start -->
<!-- commands -->
* [`profile-registry account`](#profile-registry-account)
* [`profile-registry account:register-key`](#profile-registry-accountregister-key)
* [`profile-registry admin:create`](#profile-registry-admincreate)
* [`profile-registry admin:delete`](#profile-registry-admindelete)
* [`profile-registry cert:issue`](#profile-registry-certissue)
* [`profile-registry db:init`](#profile-registry-dbinit)
* [`profile-registry db:prisma`](#profile-registry-dbprisma)
* [`profile-registry db:seed`](#profile-registry-dbseed)
* [`profile-registry help [COMMAND]`](#profile-registry-help-command)
* [`profile-registry key-gen`](#profile-registry-key-gen)
* [`profile-registry openapi-gen [OUTPUT]`](#profile-registry-openapi-gen-output)
* [`profile-registry publisher:website`](#profile-registry-publisherwebsite)
* [`profile-registry start`](#profile-registry-start)

## `profile-registry account`

会員の作成・表示・更新・削除

```
USAGE
  $ profile-registry account -i <value> -o create|read|update|delete

FLAGS
  -i, --input=<value>                          (required) [default: account.example.json] JSON file
  -o, --operation=(create|read|update|delete)  (required) 操作

DESCRIPTION
  会員の作成・表示・更新・削除

FLAG DESCRIPTIONS
  -i, --input=<value>  JSON file

    Prisma.accountsCreateInput または Prisma.accountsUpdateInput
    詳細はTSDocを参照してください。
    https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma
```

## `profile-registry account:register-key`

公開鍵の登録

```
USAGE
  $ profile-registry account:register-key -k <value> --id <value>

FLAGS
  -k, --key=<value>  (required) JWK 公開鍵ファイル
  --id=<value>       (required) 会員 (UUID)

DESCRIPTION
  公開鍵の登録
```

## `profile-registry admin:create`

管理者の作成

```
USAGE
  $ profile-registry admin:create [--id <value>] [--password <value>]

FLAGS
  --id=<value>        会員 (デフォルト: ISSUER_UUID)
  --password=<value>  パスフレーズ

DESCRIPTION
  管理者の作成
```

## `profile-registry admin:delete`

管理者権限の削除

```
USAGE
  $ profile-registry admin:delete [--id <value>]

FLAGS
  --id=<value>  会員 (デフォルト: ISSUER_UUID)

DESCRIPTION
  管理者権限の削除
```

## `profile-registry cert:issue`

OP の発行

```
USAGE
  $ profile-registry cert:issue -i <value> --certifier <value> --holder <value> [--credential <value>]
    [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>  (required) PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル
  --certifier=<value>     (required) 認証機関 (UUID)
  --credential=<value>    認証機関の報告書 JSON ファイル
  --expired-at=<value>    有効期限 (ISO 8601)
  --holder=<value>        (required) 発行対象の会員 (UUID)
  --issued-at=<value>     発行日時 (ISO 8601)

DESCRIPTION
  OP の発行
```

## `profile-registry db:init`

データベースの初期化

```
USAGE
  $ profile-registry db:init [--schema <value>] [--seed]

FLAGS
  --schema=<value>  [default: node_modules/@webdino/profile-registry/dist/prisma/schema.prisma] Prisma schema file
  --[no-]seed       Seed database

DESCRIPTION
  データベースの初期化
```

## `profile-registry db:prisma`

Prisma CLI

```
USAGE
  $ profile-registry db:prisma

DESCRIPTION
  Prisma CLI
  see: https://www.prisma.io/docs/reference/api-reference/command-reference
```

## `profile-registry db:seed`

Seed database

```
USAGE
  $ profile-registry db:seed

DESCRIPTION
  Seed database
```

## `profile-registry help [COMMAND]`

Display help for profile-registry.

```
USAGE
  $ profile-registry help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for profile-registry.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.17/src/commands/help.ts)_

## `profile-registry key-gen`

鍵ペアの生成

```
USAGE
  $ profile-registry key-gen -o <value>

FLAGS
  -o, --output=<value>  (required) 秘密鍵の保存先

DESCRIPTION
  鍵ペアの生成
```

## `profile-registry openapi-gen [OUTPUT]`

OpenAPI ドキュメント生成

```
USAGE
  $ profile-registry openapi-gen [OUTPUT]

ARGUMENTS
  OUTPUT  [default: dist/openapi.json] 出力先ファイル ("-": 標準出力)

DESCRIPTION
  OpenAPI ドキュメント生成
```

## `profile-registry publisher:website`

ウェブページの作成・表示・更新・削除

```
USAGE
  $ profile-registry publisher:website -i <value> --id <value> --input <value> -o create|read|update|delete
    [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>                       (required) PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル
  -o, --operation=(create|read|update|delete)  (required) 操作
  --expired-at=<value>                         有効期限 (ISO 8601)
  --id=<value>                                 (required) 会員 (UUID)
  --input=<value>                              (required) [default: website.example.json] JSON file
  --issued-at=<value>                          発行日時 (ISO 8601)

DESCRIPTION
  ウェブページの作成・表示・更新・削除

FLAG DESCRIPTIONS
  --input=<value>  JSON file

    Prisma.websitesCreateInput または Prisma.websitesUpdateInput
    詳細はTSDocを参照してください。
    https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma
```

## `profile-registry start`

API サーバーの起動

```
USAGE
  $ profile-registry start [--schema <value>] [--seed] [-p <value>]

FLAGS
  -p, --port=<value>  [default: 8080] Listen port
  --schema=<value>    [default: node_modules/@webdino/profile-registry/dist/prisma/schema.prisma] Prisma schema file
  --[no-]seed         Seed database

DESCRIPTION
  API サーバーの起動
```
<!-- commandsstop -->
<!-- prettier-ignore-end -->

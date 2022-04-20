# Profile Registry

Originator Profile の管理を行うシステムです。

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/webdino/profile)

- [Usage](#usage)
- [Commands](#commands)
- [Dependencies](#dependencies)

## Usage

<!-- prettier-ignore-start -->
<!-- usage -->
```sh-session
$ npm install -g @webdino/profile-registry
$ profile-registry COMMAND
running command...
$ profile-registry (--version)
@webdino/profile-registry/0.0.0 linux-x64 node-v16.14.2
$ profile-registry --help [COMMAND]
USAGE
  $ profile-registry COMMAND
...
```
<!-- usagestop -->
<!-- prettier-ignore-end -->

## Commands

<!-- prettier-ignore-start -->
<!-- commands -->
* [`profile-registry account:register`](#profile-registry-accountregister)
* [`profile-registry account:register-key`](#profile-registry-accountregister-key)
* [`profile-registry cert:issue`](#profile-registry-certissue)
* [`profile-registry db:init`](#profile-registry-dbinit)
* [`profile-registry db:prisma`](#profile-registry-dbprisma)
* [`profile-registry db:seed`](#profile-registry-dbseed)
* [`profile-registry help [COMMAND]`](#profile-registry-help-command)
* [`profile-registry key-gen`](#profile-registry-key-gen)
* [`profile-registry openapi-gen [OUTPUT]`](#profile-registry-openapi-gen-output)
* [`profile-registry start`](#profile-registry-start)

## `profile-registry account:register`

アカウントの登録

```
USAGE
  $ profile-registry account:register -i <value>

FLAGS
  -i, --input=<value>  (required) [default: account.example.json] Prisma.accountsCreateManyInput (JSON) file

DESCRIPTION
  アカウントの登録
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

## `profile-registry cert:issue`

OP の発行

```
USAGE
  $ profile-registry cert:issue -i <value> --certifier <value> --holder <value> [--credential <value>]
    [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>  (required) PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル
  --certifier=<value>     (required) 認証機構 (UUID)
  --credential=<value>    認証機構の報告書 JSON ファイル
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
  --seed            Seed database

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

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

## `profile-registry start`

API サーバーの起動

```
USAGE
  $ profile-registry start [--schema <value>] [--seed] [-p <value>] [--basic-auth-token <value>]

FLAGS
  -p, --port=<value>          [default: 8080] Listen port
  --basic-auth-token=<value>  Basic 認証用のトークン (デフォルト: 無効)
  --schema=<value>            [default: node_modules/@webdino/profile-registry/dist/prisma/schema.prisma] Prisma schema
                              file
  --seed                      Seed database

DESCRIPTION
  API サーバーの起動
```
<!-- commandsstop -->
<!-- prettier-ignore-end -->

## Dependencies

- 開発用サーバーを起動するには、[Docker](https://www.docker.com/get-started) と [Compose v2](https://docs.docker.com/compose/cli-command/) がインストールされ、Docker が起動している必要があります

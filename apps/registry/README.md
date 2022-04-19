# Profile Registry

Originator Profile の管理を行うシステムです。

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?https://github.com/webdino/profile)

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
* [`profile-registry db:init`](#profile-registry-dbinit)
* [`profile-registry db:prisma`](#profile-registry-dbprisma)
* [`profile-registry help [COMMAND]`](#profile-registry-help-command)
* [`profile-registry openapi-gen [OUTPUT]`](#profile-registry-openapi-gen-output)
* [`profile-registry start`](#profile-registry-start)

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

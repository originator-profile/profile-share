# Profile Registry

Originator Profile と Document Profile の管理を行うシステムです。

- [Deployment](#deployment)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Commands](#commands)

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/originator-profile/profile)

### 公式デプロイ

- OP レジストリサーバー: [oprexpt.originator-profile.org](https://oprexpt.originator-profile.org/)
- DP レジストリサーバー: [dprexpt.originator-profile.org](https://dprexpt.originator-profile.org/)
- 試験運用版: [oprdev.originator-profile.org](https://oprdev.originator-profile.org/) (本リポジトリの `main` ブランチへのコミットごとにデプロイされています)

不具合の報告・脆弱性の報告は [GitHub Issues](https://github.com/originator-profile/profile/issues) にてお寄せください。

## Dependencies

[開発ガイド](https://docs.originator-profile.org/development/)を参照してください。

## Usage

```
# CLI を含む Profile レジストリのビルド
$ pnpm build
# CLI のグローバルインストール
$ npm i -g .
# CLI の実行
$ profile-registry COMMAND
running command...
```

## Development Guide

```
# 自動ビルドの実行と開発用サーバーの起動
$ pnpm dev
# CLI の実行 (本ドキュメント内の profile-registry は bin/dev で置き換え可能です)
$ bin/dev COMMAND
running command...
```

## Commands

<!-- prettier-ignore-start -->
<!-- commands -->
* [`profile-registry account`](#profile-registry-account)
* [`profile-registry account:register-credential`](#profile-registry-accountregister-credential)
* [`profile-registry account:register-key`](#profile-registry-accountregister-key)
* [`profile-registry account:register-op`](#profile-registry-accountregister-op)
* [`profile-registry admin:create`](#profile-registry-admincreate)
* [`profile-registry admin:delete`](#profile-registry-admindelete)
* [`profile-registry advertiser:sign`](#profile-registry-advertisersign)
* [`profile-registry cert:issue`](#profile-registry-certissue)
* [`profile-registry db:init`](#profile-registry-dbinit)
* [`profile-registry db:prisma`](#profile-registry-dbprisma)
* [`profile-registry db:seed`](#profile-registry-dbseed)
* [`profile-registry help [COMMANDS]`](#profile-registry-help-commands)
* [`profile-registry key-gen`](#profile-registry-key-gen)
* [`profile-registry openapi-gen [OUTPUT]`](#profile-registry-openapi-gen-output)
* [`profile-registry publisher:category`](#profile-registry-publishercategory)
* [`profile-registry publisher:extract-category [OUTPUT]`](#profile-registry-publisherextract-category-output)
* [`profile-registry publisher:extract-website`](#profile-registry-publisherextract-website)
* [`profile-registry publisher:profile-set`](#profile-registry-publisherprofile-set)
* [`profile-registry publisher:sign`](#profile-registry-publishersign)
* [`profile-registry publisher:website`](#profile-registry-publisherwebsite)
* [`profile-registry start`](#profile-registry-start)

## `profile-registry account`

会員の作成・表示・更新・削除

```
USAGE
  $ profile-registry account -i <value> -o create|read|update|delete

FLAGS
  -i, --input=<value>       (required) [default: account.example.json] JSON file
  -o, --operation=<option>  (required) 操作
                            <options: create|read|update|delete>

DESCRIPTION
  会員の作成・表示・更新・削除

FLAG DESCRIPTIONS
  -i, --input=<value>  JSON file

    Prisma.accountsCreateInput または Prisma.accountsUpdateInput
    詳細はTSDocを参照してください。
    https://docs.originator-profile.org/ts/modules/_originator_profile_registry_db.default.Prisma
    "id" フィールドの値には会員 ID またはドメイン名を指定可能です。

  -o, --operation=create|read|update|delete  操作

    操作を指定します。

    read, update, delete を指定した場合、--input で指定した JSON ファイルの中に id を必ず含めてください。
    create の場合、id を省略できます。その場合 id は自動的に生成されます。
```

## `profile-registry account:register-credential`

資格情報を登録します

```
USAGE
  $ profile-registry account:register-credential --id <value> --certifier <value> --verifier <value> --name <value> [--url
    <value>] [--image <value>] [--issued-at <value>] [--expired-at <value>]

FLAGS
  --certifier=<value>   (required) 認証機関の ID またはドメイン名
  --expired-at=<value>  有効期限 (ISO 8601)
  --id=<value>          (required) アカウントの ID またはドメイン名
  --image=<value>       画像URL
  --issued-at=<value>   発行日時 (ISO 8601)
  --name=<value>        (required) 資格名
  --url=<value>         説明情報のURL
  --verifier=<value>    (required) 検証機関の ID またはドメイン名

DESCRIPTION
  資格情報を登録します

FLAG DESCRIPTIONS
  --certifier=<value>  認証機関の ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  アカウントの ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。

  --image=<value>  画像URL

    拡張機能Webページへの埋め込みが可能な(CORSが許可されている)画像URL

  --verifier=<value>  検証機関の ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry account:register-key`

公開鍵の登録

```
USAGE
  $ profile-registry account:register-key -k <value> --id <value>

FLAGS
  -k, --key=<value>  (required) JWK 公開鍵ファイル
      --id=<value>   (required) 会員 ID またはドメイン名

DESCRIPTION
  公開鍵の登録

FLAG DESCRIPTIONS
  --id=<value>  会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry account:register-op`

Signed Originator Profile の登録 (Document Profile Registry 用)

```
USAGE
  $ profile-registry account:register-op --id <value> --op <value>

FLAGS
  --id=<value>  (required) 会員 ID またはドメイン名
  --op=<value>  (required) Signed Originator Profile ファイル

DESCRIPTION
  Signed Originator Profile の登録 (Document Profile Registry 用)

FLAG DESCRIPTIONS
  --id=<value>  会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。

  --op=<value>  Signed Originator Profile ファイル

    Originator Profile レジストリから受け取った Signed Originator Profile ファイルを指定します。
    JWT の含まれないファイルは無効です。また JWT の Subject クレームは会員自身のドメイン名と一致しなければなりません。
```

## `profile-registry admin:create`

管理者の作成

```
USAGE
  $ profile-registry admin:create --id <value> [--password <value>]

FLAGS
  --id=<value>        (required) 会員 ID またはドメイン名
  --password=<value>  パスフレーズ

DESCRIPTION
  管理者の作成

FLAG DESCRIPTIONS
  --id=<value>  会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
    会員を新規登録する場合、ドメイン名でなければなりません。
```

## `profile-registry admin:delete`

管理者権限の削除

```
USAGE
  $ profile-registry admin:delete --id <value>

FLAGS
  --id=<value>  (required) 会員 ID またはドメイン名

DESCRIPTION
  管理者権限の削除

FLAG DESCRIPTIONS
  --id=<value>  会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry advertiser:sign`

Signed Advertisement Profile (SAP) の生成

```
USAGE
  $ profile-registry advertiser:sign -i <value> --id <value> --input <value> [--issued-at <value>] [--expired-at
    <value>] [--allowed-origins <value>]

FLAGS
  -i, --identity=<value>         (required) プライベート鍵のファイルパス
      --allowed-origins=<value>  allowedOrigins プロパティ
      --expired-at=<value>       有効期限 (ISO 8601)
      --id=<value>               (required) OP ID (ドメイン名)
      --input=<value>            (required) JSON file
      --issued-at=<value>        発行日時 (ISO 8601)

DESCRIPTION
  Signed Advertisement Profile (SAP) の生成

  広告の情報 (AP) に対して署名を行います。
  署名済み AP (SAP) を生成し、それを標準出力に出力します。

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  --allowed-origins=<value>  allowedOrigins プロパティ

    DP による記事の信頼性証明を許可するサイトをオリジン形式で指定します。複数のオリジンを許可する場合は、オリジンをコン
    マ区切りで並べてください。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  OP ID (ドメイン名)

    ドメイン名 (RFC 4501) を指定します。

  --input=<value>  JSON file

    ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。
    imageプロパティの画像リソースは拡張機能Webページから参照されます。埋め込み可能なようCORS許可しておいてください。

    {
    "allowedOrigins": ["https://example.com"],

    "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
    "url": "https://example.com/",
    "location": "h1",
    "bodyFormat": "visibleText",
    "body": "広告テキスト",
    "title": "広告タイトル",
    "image": "https://example.com/image.png",
    "description": "この広告の説明です。"
    }
```

## `profile-registry cert:issue`

OP の発行

```
USAGE
  $ profile-registry cert:issue -i <value> --certifier <value> --holder <value> [--issued-at <value>]
    [--expired-at <value>] [--valid-at <value>]

FLAGS
  -i, --identity=<value>    (required) プライベート鍵のファイルパス
      --certifier=<value>   (required) 認証機関 ID またはドメイン名
      --expired-at=<value>  有効期限 (ISO 8601)
      --holder=<value>      (required) 所有者となる会員 ID またはドメイン名
      --issued-at=<value>   発行日時 (ISO 8601)
      --valid-at=<value>    この日時に既に失効している資格情報を含めない。デフォルトは issued-at と同じ日時。

DESCRIPTION
  OP の発行

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  --certifier=<value>  認証機関 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --holder=<value>  所有者となる会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry db:init`

データベースの初期化

```
USAGE
  $ profile-registry db:init [--schema <value>] [--seed]

FLAGS
  --schema=<value>  Prisma schema file
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

## `profile-registry help [COMMANDS]`

Display help for profile-registry.

```
USAGE
  $ profile-registry help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for profile-registry.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.7/src/commands/help.ts)_

## `profile-registry key-gen`

鍵ペアの生成

```
USAGE
  $ profile-registry key-gen -o <value>

FLAGS
  -o, --output=<value>  (required) 鍵を保存するファイル名（拡張子除く）。<output>.priv.json と <output>.pub.json
                        を出力します。

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

## `profile-registry publisher:category`

カテゴリーの作成・表示・削除

```
USAGE
  $ profile-registry publisher:category (--glob-input <value> | --input <value>) -o createMany

FLAGS
  -o, --operation=<option>  (required) 操作
                            <options: createMany>
      --glob-input=<value>  (required) [default: **/category.json] JSON files match with glob pattern
      --input=<value>       JSON file

DESCRIPTION
  カテゴリーの作成・表示・削除

FLAG DESCRIPTIONS
  --input=<value>  JSON file

    Prisma.Enumerable<Prisma.categoriesCreateManyInput>
    詳細はTSDocを参照してください。
    https://docs.originator-profile.org/ts/modules/_originator_profile_registry_db.default.Prisma
```

## `profile-registry publisher:extract-category [OUTPUT]`

カテゴリー情報の抽出 ("publisher:category -o createMany"用)

```
USAGE
  $ profile-registry publisher:extract-category [OUTPUT] --input <value> [--header <value>]

ARGUMENTS
  OUTPUT  [default: category.json] 出力先ファイル ("-": 標準出力)

FLAGS
  --header=<value>  [default: 2] Header position
  --input=<value>   (required) Excel file

DESCRIPTION
  カテゴリー情報の抽出 ("publisher:category -o createMany"用)

FLAG DESCRIPTIONS
  --header=<value>  Header position

    Excelファイル中のヘッダーの行番号

  --input=<value>  Excel file

    IAB Tech Lab Content Category Taxonomy 1.0の定義ファイル
    詳しくは当該ファイル https://iabtechlab.com/wp-content/uploads/2023/03/Content-Taxonomy-1.0-1.xlsx
    を参照してください
```

## `profile-registry publisher:extract-website`

ウェブページの抽出

```
USAGE
  $ profile-registry publisher:extract-website --input <value> [--context <value>] [--metadata]

FLAGS
  --context=<value>  ウェブページの抽出に必要なコンテキストのオプション（JSON ファイル）
  --input=<value>    (required) ウェブページの抽出の入力 (JSON ファイル)
  --[no-]metadata    metascraper による OGP などのメタデータの取得

DESCRIPTION
  ウェブページの抽出

FLAG DESCRIPTIONS
  --context=<value>  ウェブページの抽出に必要なコンテキストのオプション（JSON ファイル）

    以下のデータ形式を受け付けます。
    {
    // ウェブサイトの URL の先頭の文字列
    "https://originator-profile.org/": {
    // BrowserContextOptions
    },
    ...
    }
    BrowserContextOptions については
    詳細はPlaywrightの公式ドキュメントを参照してください。
    https://playwright.dev/docs/api/class-browser#browser-new-context

  --input=<value>  ウェブページの抽出の入力 (JSON ファイル)

    以下のデータ形式を受け付けます。
    [
    {
    // ウェブサイトの URL
    "url": "https://originator-profile.org/",
    // 対象のテキストの形式
    "bodyFormat": "visibleText",
    // 対象の要素の場所を特定する CSS セレクター (省略可)
    "location": "h1",
    // ウェブサイトの保存先
    "output": "./path/to/.website.json"
    // その他のプロパティは出力の JSON ファイルにそのまま渡されます。
    },
    ...
    ]
```

## `profile-registry publisher:profile-set`

Profile Set の生成

```
USAGE
  $ profile-registry publisher:profile-set --url <value> [-o <value>]

FLAGS
  -o, --output=<value>  [default: -] 出力先ファイル ("-": 標準出力)
      --url=<value>     (required) ウェブページのURL

DESCRIPTION
  Profile Set の生成
```

## `profile-registry publisher:sign`

Signed Document Profile (SDP) の生成

```
USAGE
  $ profile-registry publisher:sign -i <value> --id <value> --input <value> [--issued-at <value>] [--expired-at
    <value>] [--site-profile] [--allowed-origins <value>]

FLAGS
  -i, --identity=<value>         (required) プライベート鍵のファイルパス
      --allowed-origins=<value>  allowedOrigins プロパティ
      --expired-at=<value>       有効期限 (ISO 8601)
      --id=<value>               (required) OP ID (ドメイン名)
      --input=<value>            (required) JSON file
      --issued-at=<value>        発行日時 (ISO 8601)
      --site-profile             出力にサイトプロファイルを使用する

DESCRIPTION
  Signed Document Profile (SDP) の生成

  Web ページの情報 (DP) に対して署名を行います。
  署名済み DP (SDP) を生成し、それを標準出力に出力します。

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  --allowed-origins=<value>  allowedOrigins プロパティ

    DP による記事の信頼性証明を許可するサイトをオリジン形式で指定します。複数のオリジンを許可する場合は、オリジンをコン
    マ区切りで並べてください。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  OP ID (ドメイン名)

    ドメイン名 (RFC 4501) を指定します。

  --input=<value>  JSON file

    ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。
    imageプロパティの画像リソースは拡張機能Webページから参照されます。埋め込み可能なようCORS許可しておいてください。

    {
    "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
    "url": "https://example.com/",
    "location": "h1",
    "bodyFormat": "visibleText",
    "body": "OP 確認くん",

    "title": "OP 確認くん",
    "image": "https://example.com/image.png",
    "description": "このウェブページの説明です。",
    "author": "山田太郎",
    "editor": "山田花子",
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "categories": [{
    "cat": "IAB1-1",
    "name": "Books & Literature",
    "cattax": 1
    }]
    }
```

## `profile-registry publisher:website`

ウェブページ・SDPの作成・表示・更新・削除

```
USAGE
  $ profile-registry publisher:website -i <value> --id <value> (--glob-input <value> | --input <value>) -o
    create|read|update|delete [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>    (required) プライベート鍵のファイルパス
  -o, --operation=<option>  (required) 操作
                            <options: create|read|update|delete>
      --expired-at=<value>  有効期限 (ISO 8601)
      --glob-input=<value>  (required) [default: **/.website.json] JSON files match with glob pattern
      --id=<value>          (required) 会員 ID またはドメイン名
      --input=<value>       JSON file
      --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  ウェブページ・SDPの作成・表示・更新・削除

  ウェブページ・SDPの作成・表示・更新・削除を行います。

  一度発行した SDP を更新したいときには、-o update オプションをつけて実行してください。
  この際、発行した SDP の id を --input に指定する JSON ファイルに含める必要があります。

  {
  "id": "0eb206ec-7b09-47cb-b879-abbb83f387a0",
  "author": "山田 一郎"
  }

  上のような JSON ファイルを用意し、コマンドを実行します。

  $ profile-registry publisher:website -i holder-key.priv.json --id example.com --input website.json -o update

  SDP を DP レジストリから削除したいときには、-o delete オプションをつけて実行してください。
  この際、発行した SDP の id を --input に指定する JSON ファイルに含める必要があります。

  {
  "id": "0eb206ec-7b09-47cb-b879-abbb83f387a0"
  }

  上のような JSON ファイルを用意し、コマンドを実行します。

  $ profile-registry publisher:website -i holder-key.priv.json --id example.com --input website.json -o delete



EXAMPLES
  $ profile-registry publisher:website -o update -i holder-key.priv.json --id example.com --input website.json

  $ profile-registry publisher:website -o delete -i holder-key.priv.json --id example.com --input website.json

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  -o, --operation=create|read|update|delete  操作

    操作を指定します。

    read, update, delete を指定した場合、--input で指定した JSON ファイルの中に id を必ず含めてください。
    create の場合、id を省略できます。その場合 id は自動的に生成されます。


  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  会員 ID またはドメイン名

    UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。

  --input=<value>  JSON file

    ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。
    imageプロパティの画像リソースは拡張機能Webページから参照されます。埋め込み可能なようCORS許可しておいてください。

    {
    "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
    "url": "http://localhost:8080",
    "location": "h1",
    "bodyFormat": "visibleText",
    "body": "OP 確認くん",

    "title": "OP 確認くん",
    "image": "https://example.com/image.png",
    "description": "このウェブページの説明です。",
    "author": "山田太郎",
    "editor": "山田花子",
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "categories": [{"cat": "IAB1"}, {"cat": "IAB1-1"}]
    }
```

## `profile-registry start`

API サーバーの起動

```
USAGE
  $ profile-registry start [--schema <value>] [--seed] [-p <value>]

FLAGS
  -p, --port=<value>    [default: 8080] Listen port
      --schema=<value>  Prisma schema file
      --[no-]seed       Seed database

DESCRIPTION
  API サーバーの起動
```
<!-- commandsstop -->
<!-- prettier-ignore-end -->

## 環境変数

DATABASE_URL
: PostgreSQL 接続 URL (形式: `postgresql://<ホスト名または IP アドレス>[:<ポート>]/<データベース>`)

APP_URL
: アプリケーションのURL。
このURLをAuth0ダッシュボードから認可されたAPI (Auth0 dashboard -> Application -> APIs -> Custom API) として登録することでAPIを利用できるようになります。
(形式: `https://<ホスト名>/`)

AUTH0_DOMAIN
: Auth0のテナントのドメイン名 (Auth0 dashboard -> Application -> Settings -> Domain)

AUTH0_CLIENT_ID
: Auth0 Client ID (Auth0 dashboard -> Application -> Settings -> Client ID)

PORT
: リッスンポート

MAIL_FROM [^gh-770]
: メールの送信元

SMTP_HOST [^gh-770]
: SMTPサーバーホスト名

SMTP_PORT [^gh-770]
: SMTPサーバーポート

SMTP_SECURE [^gh-770]
: SMTPS接続（SMTP over TLS）の有無 (形式: `true` or `false`)

SMTP_AUTH_USER [^gh-770]
: SMTPサーバーの認証に使用するユーザー

SMTP_AUTH_PASSWORD [^gh-770]
: SMTPサーバーの認証に使用するパスワード

MINIO_PORT
: 開発用 minio サーバーのAPIポート

MINIO_CONSOLE_PORT
: 開発用 minio サーバーのWeb管理画面のポート

S3_ACCESS_KEY_ID
: 開発用 minio サーバーの管理者ユーザー名 または、 R2 のアクセスキー

S3_SECRET_ACCESS_KEY
: 開発用 minio サーバーの管理者パスワード または、 R2 のシークレットキー

S3_ACCOUNT_LOGO_BUCKET_NAME
: アカウントロゴを保存するバケット名

S3_API_ENDPOINT
: minio または R2 のエンドポイント（ R2 の場合、バケット名、末尾スラッシュは不要）

S3_ACCOUNT_LOGO_PUBLIC_ENDPOINT
: 画像ファイルをインターネットに公開する場合のエンドポイント

[^gh-770]: 未実装。[審査結果メール通知機能](https://github.com/originator-profile/profile/issues/770)にて実装予定。

# Profile Registry

Originator Profile (OP) と Content Attestation (CA) の管理を行うシステムです。

- [Deployment](#deployment)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Commands](#commands)

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/originator-profile/profile)

### 公式デプロイ

- OP サーバー (仮称): [oprexpt.originator-profile.org](https://oprexpt.originator-profile.org/)
- CA サーバー: [dprexpt.originator-profile.org](https://dprexpt.originator-profile.org/)
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
* [`profile-registry account:show-credential`](#profile-registry-accountshow-credential)
* [`profile-registry admin:create`](#profile-registry-admincreate)
* [`profile-registry admin:delete`](#profile-registry-admindelete)
* [`profile-registry ca:sign`](#profile-registry-casign)
* [`profile-registry ca:unsigned`](#profile-registry-caunsigned)
* [`profile-registry db:init`](#profile-registry-dbinit)
* [`profile-registry db:prisma`](#profile-registry-dbprisma)
* [`profile-registry db:seed`](#profile-registry-dbseed)
* [`profile-registry help [COMMAND]`](#profile-registry-help-command)
* [`profile-registry key-gen`](#profile-registry-key-gen)
* [`profile-registry openapi-gen [OUTPUT]`](#profile-registry-openapi-gen-output)
* [`profile-registry publisher:category`](#profile-registry-publishercategory)
* [`profile-registry publisher:extract-category [OUTPUT]`](#profile-registry-publisherextract-category-output)
* [`profile-registry sign`](#profile-registry-sign)
* [`profile-registry start`](#profile-registry-start)
* [`profile-registry wsp:unsigned`](#profile-registry-wspunsigned)

## `profile-registry account`

組織の作成・表示・更新・削除

```
USAGE
  $ profile-registry account -i <value> -o create|read|update|delete

FLAGS
  -i, --input=<value>       (required) [default: account.example.json] 入力ファイルのパス (JSON 形式)
  -o, --operation=<option>  (required) 操作
                            <options: create|read|update|delete>

DESCRIPTION
  組織の作成・表示・更新・削除

FLAG DESCRIPTIONS
  -i, --input=<value>  入力ファイルのパス (JSON 形式)

    書式:

    {
    "id": "<UUID v5 for domain names 形式 OP ID>",
    "domainName": "<OP ID>",
    "roleValue": "<種別 - group: 組織、certifier: 認証機関>",
    "name": "<法人名*>",
    "url": "<ウェブサイトのURL>",
    "corporateNumber": "<法人番号>",
    "description": "<説明 (ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述)>",
    "email": "<メールアドレス>",
    "phoneNumber": "<電話番号>",
    "postalCode": "<郵便番号*>",
    "addressCountry": "<国*>",
    "addressRegion": "<都道府県*>",
    "addressLocality": "<市区町村*>",
    "streetAddress": "<番地・ビル名*>",
    "contactTitle": "<連絡先表示名>",
    "contactUrl": "<連絡先URL>",
    "privacyPolicyTitle": "<プライバシーポリシー表示名>",
    "privacyPolicyUrl": "<プライバシーポリシーURL>",
    "publishingPrincipleTitle": "<編集ガイドライン表示名>",
    "publishingPrincipleUrl": "<編集ガイドラインURL>",
    "logos": {
    "create": [
    {
    "url": "<ロゴURL>",
    "isMain": true
    }
    ]
    }
    }

    入力ファイルの例:

    {
    "id": "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc",
    "domainName": "localhost",
    "roleValue": "certifier",
    "name": "Originator Profile 技術研究組合 (開発用)",
    "url": "https://originator-profile.org/",
    "corporateNumber": "8010005035933",
    "postalCode": "100-8055",
    "addressCountry": "JP",
    "addressRegion": "東京都",
    "addressLocality": "千代田区",
    "streetAddress": "大手町1-7-1",
    "contactTitle": "お問い合わせ",
    "contactUrl": "https://originator-profile.org/ja-JP/inquiry/",
    "privacyPolicyTitle": "プライバシーポリシー",
    "privacyPolicyUrl": "https://originator-profile.org/ja-JP/privacy/",
    "logos": {
    "create": [
    {
    "url": "https://originator-profile.org/image/icon.svg",
    "isMain": true
    }
    ]
    }
    }

    詳細は
    Prisma.accountsCreateInput
    https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.accountsCreateInput.html
    または Prisma.accountsUpdateInput
    https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.accountsUpdateInput.html
    をご確認ください。

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

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  アカウントの ID またはドメイン名

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。

  --image=<value>  画像URL

    拡張機能Webページへの埋め込みが可能な(CORSが許可されている)画像URL

  --verifier=<value>  検証機関の ID またはドメイン名

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
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

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry account:show-credential`

資格情報を表示します

```
USAGE
  $ profile-registry account:show-credential --id <value> [--valid-at <value>]

FLAGS
  --id=<value>        (required) アカウントの ID またはドメイン名
  --valid-at=<value>  この日時に既に失効している資格情報を含めない。デフォルトはすべての資格情報を表示する。

DESCRIPTION
  資格情報を表示します

FLAG DESCRIPTIONS
  --id=<value>  アカウントの ID またはドメイン名

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
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

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
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

    UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
```

## `profile-registry ca:sign`

Content Attestation の作成

```
USAGE
  $ profile-registry ca:sign -i <value> --input <filepath> [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>    (required) プライベート鍵のファイルパス
      --expired-at=<value>  有効期限 (ISO 8601)
      --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
      --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  Content Attestation の作成

  標準出力に Content Attestation を出力します。

EXAMPLES
  $ profile-registry ca:sign \
      -i account-key.example.priv.json \
      --input article-content-attestation.example.json

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --input=<filepath>  入力ファイルのパス (JSON 形式)

    Article Content Attestation の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
    "@language": "ja"
    }
    ],
    "type": [
    "VerifiableCredential",
    "ContentAttestation"
    ],
    "issuer": "dns:example.com",
    "credentialSubject": {
    "id": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
    "type": "Article",
    "headline": "<Webページのタイトル>",
    "image": {
    "id": "<サムネイル画像URL>",
    "content": "<コンテンツ (data:// 形式URL)>"
    },
    "description": "<Webページの説明>",
    "author": [
    "山田花子"
    ],
    "editor": [
    "山田太郎"
    ],
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "genre": "Arts & Entertainment"
    },
    "allowedUrl": "https://media.example.com/articles/2024-06-30",
    "target": [
    {
    "type": "<Target Integrityの種別>",
    "content": "<コンテンツ本体 (text/html or URL)>",
    "cssSelector": "<CSS セレクター (optional)>"
    }
    ]
    }
```

## `profile-registry ca:unsigned`

未署名 Content Attestation の取得

```
USAGE
  $ profile-registry ca:unsigned --input <filepath> [--issued-at <value>] [--expired-at <value>]

FLAGS
  --expired-at=<value>  有効期限 (ISO 8601)
  --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
  --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  未署名 Content Attestation の取得

  標準出力に未署名 Content Attestation を出力します。
  target[].integrity を省略した場合、type に準じて content から integrity を計算します。
  一方、target[].integrity が含まれる場合、その値をそのまま使用します。
  なお、いずれも target[].content プロパティが削除される点にご注意ください。
  これにより入力ファイルの target[] と異なる結果が含まれますが、これは正しい動作です。

EXAMPLES
  $ profile-registry ca:unsigned \
      --input article-content-attestation.example.json

FLAG DESCRIPTIONS
  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --input=<filepath>  入力ファイルのパス (JSON 形式)

    Article Content Attestation の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
    "@language": "<言語・地域コード>"
    }
    ],
    "type": [
    "VerifiableCredential",
    "ContentAttestation"
    ],
    "issuer": "<OP ID>",
    "credentialSubject": {
    "id": "<CA ID>",
    "type": "Article",
    "headline": "<コンテンツのタイトル>",
    "description": "<コンテンツの説明>",
    "image": {
    "id": "<サムネイル画像URL>",
    "content": "<コンテンツ (data:// 形式URL)>"
    },
    "datePublished": "<公開日時>",
    "dateModified": "<最終更新日時>",
    "author": [
    "<著者名>"
    ],
    "editor": [
    "<編集者名>"
    ],
    "genre": "<ジャンル>"
    },
    "allowedUrl": "<CAの使用を許可するWebページのURL Pattern>",
    "target": [
    {
    "type": "<Target Integrityの種別>",
    "content": "<コンテンツ本体 (text/html or URL)>",
    "cssSelector": "<CSS セレクター (optional)>"
    }
    ]
    }
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

## `profile-registry help [COMMAND]`

Display help for profile-registry.

```
USAGE
  $ profile-registry help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for profile-registry.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.26/src/commands/help.ts)_

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

## `profile-registry sign`

VC の作成

```
USAGE
  $ profile-registry sign -i <value> --input <filepath> [--id <value>] [--issued-at <value>] [--expired-at
    <value>]

FLAGS
  -i, --identity=<value>    (required) プライベート鍵のファイルパス
      --expired-at=<value>  有効期限 (ISO 8601)
      --id=<value>          OP ID (ドメイン名)
      --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
      --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  VC の作成

  VC に署名します。
  標準出力に VC を出力します。

EXAMPLES
  $ profile-registry sign \
      -i example.priv.json \
      --id example.com \
      --input core-profile.json

  $ profile-registry sign \
      -i example.priv.json \
      --id example.org \
      --input web-media-profile.json

  $ profile-registry sign \
      -i account-key.example.priv.json \
      --input website-profile.example.json

FLAG DESCRIPTIONS
  -i, --identity=<value>  プライベート鍵のファイルパス

    プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8
    形式にしてください。

  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --id=<value>  OP ID (ドメイン名)

    ドメイン名 (RFC 4501) を指定します。

  --input=<filepath>  入力ファイルのパス (JSON 形式)

    コアプロファイル (CP) の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1"
    ],
    "type": [
    "VerifiableCredential",
    "CoreProfile"
    ],
    "issuer": "dns:example.org",
    "credentialSubject": {
    "id": "dns:example.jp",
    "type": "Core",
    "jwks": {
    "keys": [
    {
    "kid": "LIstkoCvByn4jk8oZPvigQkzTzO9UwnGnE-VMlkZvYQ",
    "kty": "EC",
    "crv": "P-256",
    "x": "QiVI-I-3gv-17KN0RFLHKh5Vj71vc75eSOkyMsxFxbE",
    "y": "bEzRDEy41bihcTnpSILImSVymTQl9BQZq36QpCpJQnI"
    }
    ]
    }
    }
    }

    ウェブメディアプロファイル (WMP) の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
    "@language": "ja"
    }
    ],
    "type": [
    "VerifiableCredential",
    "WebMediaProfile"
    ],
    "issuer": "dns:wmp-issuer.example.org",
    "credentialSubject": {
    "id": "dns:wmp-holder.example.jp",
    "type": "OnlineBusiness",
    "url": "https://www.wmp-holder.example.jp/",
    "name": "○○メディア (※開発用サンプル)",
    "logo": {
    "id": "https://www.wmp-holder.example.jp/image.png",
    "digestSRI": "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY="
    },
    "email": "contact@wmp-holder.example.jp",
    "telephone": "0000000000",
    "contactPoint": {
    "id": "https://wmp-holder.example.jp/contact",
    "name": "お問い合わせ"
    },
    "informationTransmissionPolicy": {
    "id": "https://wmp-holder.example.jp/statement",
    "name": "情報発信ポリシー"
    },
    "privacyPolicy": {
    "id": "https://wmp-holder.example.jp/privacy",
    "name": "プライバシーポリシー"
    },
    "description": {
    "type": "PlainTextDescription",
    "data": "この文章はこの Web メディアに関する補足情報です。"
    }
    }
    }

    Website Profile (WSP) の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
    "@language": "ja"
    }
    ],
    "type": [
    "VerifiableCredential",
    "WebsiteProfile"
    ],
    "issuer": "dns:example.com",
    "credentialSubject": {
    "id": "https://media.example.com/",
    "type": "WebSite",
    "name": "<Webサイトのタイトル>",
    "description": "<Webサイトの説明>",
    "image": {
    "id": "https://media.example.com/image.png",
    "digestSRI": "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY="
    },
    "url": "https://media.example.com"
    }
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

## `profile-registry wsp:unsigned`

未署名 Website Profile の取得

```
USAGE
  $ profile-registry wsp:unsigned --input <filepath> [--issued-at <value>] [--expired-at <value>]

FLAGS
  --expired-at=<value>  有効期限 (ISO 8601)
  --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
  --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  未署名 Website Profile の取得

  標準出力に未署名 Website Profile を出力します。

EXAMPLES
  $ profile-registry wsp:unsigned \
      --input website-profile.example.json

FLAG DESCRIPTIONS
  --expired-at=<value>  有効期限 (ISO 8601)

    日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。

  --input=<filepath>  入力ファイルのパス (JSON 形式)

    Website Profile の例:

    {
    "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
    "@language": "<言語・地域コード>"
    }
    ],
    "type": [
    "VerifiableCredential",
    "WebsiteProfile"
    ],
    "issuer": "<OP ID>",
    "credentialSubject": {
    "id": "<Web サイトのオリジン (形式: https://<ホスト名>)>",
    "url": "<Web サイトのオリジン (形式: https://<ホスト名>)>",
    "type": "WebSite",
    "name": "<Web サイトの名称>",
    "description": "<Web サイトの説明>",
    "image": {
    "id": "<サムネイル画像URL>",
    "content": "<コンテンツ (data:// 形式URL)>"
    }
    }
    }
```
<!-- commandsstop -->
<!-- prettier-ignore-end -->

## 環境変数

JOSE_SECRET
: 署名鍵の暗号化および復号に使用するシークレットキー。
32 バイトのランダムデータを Base64 URL または Base64形式にエンコードした文字列。
このキーは署名鍵のセキュリティを確保するために使用され、外部に漏洩しないように注意してください。

生成例:

```sh
openssl rand -base64 32
```

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

MAIL_FROM
: メールの送信元

SMTP_HOST
: SMTPサーバーホスト名

SMTP_PORT
: SMTPサーバーポート

SMTP_SECURE
: SMTPS接続（SMTP over TLS）の有無 (形式: `true` or `false`)

SMTP_AUTH_USER
: SMTPサーバーの認証に使用するユーザー

SMTP_AUTH_PASSWORD
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

BASIC_AUTH
: すべてのレジストリ API への Basic 認証の有無 (形式: `true` or `false`)

BASIC_AUTH_USERNAME
: すべてのレジストリ API への Basic 認証のユーザー名

BASIC_AUTH_PASSWORD
: すべてのレジストリ API への Basic 認証のパスワード

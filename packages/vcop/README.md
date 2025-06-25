# vcop - Verifiable Credential for Originator Profile command line tool

Originator Profile (OP) 仕様に準拠した Verifiable Credential (VC) を作成・管理するためのツールです。

## Installation

GitHub Packages にアクセスするため .npmrc 設定が必要です。

1. GitHub の [Personal Access Token (classic)](https://github.com/settings/tokens) を発行
   - 必要なスコープ:
     - `read:packages`
     - `repo`
2. GitHub Packages のレジストリと認証トークンを設定

```sh
npm config set @originator-profile:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_PERSONAL_ACCESS_TOKEN
```

## Usage

```sh
# npx
npx -y @originator-profile/vcop

# npm
npm i -g @originator-profile/vcop
vcop
```

## Commands

<!-- prettier-ignore-start -->
<!-- commands -->
* [`vcop ca:sign`](#vcop-casign)
* [`vcop ca:unsigned`](#vcop-caunsigned)
* [`vcop help [COMMAND]`](#vcop-help-command)
* [`vcop key-gen`](#vcop-key-gen)
* [`vcop sign`](#vcop-sign)
* [`vcop wsp:unsigned`](#vcop-wspunsigned)

## `vcop ca:sign`

Content Attestation の作成

```
USAGE
  $ vcop ca:sign -i <value> --input <filepath> [--issued-at <value>] [--expired-at <value>]

FLAGS
  -i, --identity=<value>    (required) プライベート鍵のファイルパス
      --expired-at=<value>  有効期限 (ISO 8601)
      --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
      --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  Content Attestation の作成

  標準出力に Content Attestation を出力します。

EXAMPLES
  $ vcop ca:sign \
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

## `vcop ca:unsigned`

未署名 Content Attestation の取得

```
USAGE
  $ vcop ca:unsigned --input <filepath> [--issued-at <value>] [--expired-at <value>]

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
  $ vcop ca:unsigned \
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

## `vcop help [COMMAND]`

Display help for vcop.

```
USAGE
  $ vcop help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for vcop.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.29/src/commands/help.ts)_

## `vcop key-gen`

鍵ペアの生成

```
USAGE
  $ vcop key-gen -o <value>

FLAGS
  -o, --output=<value>  (required) 鍵を保存するファイル名（拡張子除く）。<output>.priv.json と <output>.pub.json
                        を出力します。

DESCRIPTION
  鍵ペアの生成
```

## `vcop sign`

VC の作成

```
USAGE
  $ vcop sign -i <value> --input <filepath> [--id <value>] [--issued-at <value>] [--expired-at <value>]

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
  $ vcop sign \
      -i example.priv.json \
      --id example.com \
      --input core-profile.json

  $ vcop sign \
      -i example.priv.json \
      --id example.org \
      --input web-media-profile.json

  $ vcop sign \
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

## `vcop wsp:unsigned`

未署名 Website Profile の取得

```
USAGE
  $ vcop wsp:unsigned --input <filepath> [--issued-at <value>] [--expired-at <value>]

FLAGS
  --expired-at=<value>  有効期限 (ISO 8601)
  --input=<filepath>    (required) 入力ファイルのパス (JSON 形式)
  --issued-at=<value>   発行日時 (ISO 8601)

DESCRIPTION
  未署名 Website Profile の取得

  標準出力に未署名 Website Profile を出力します。

EXAMPLES
  $ vcop wsp:unsigned \
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

## Development

```sh
git clone https://github.com/originator-profile/profile-share.git
cd profile-share/packages/vcop
pnpm install
bin/dev.ts
```

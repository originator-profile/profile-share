---
sidebar_position: 4
---

# Web Media Profile Data Model Implementer's Guide

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- OP VC Data Model Conforming Document (OP VC DM 準拠文書)
- Originator Profile Identifier (OP ID)
- Web Media Profile (WMP)

## Web Media Profile のデータモデル

Web Media Profile は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### プロパティ

#### `@context`

[OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。

#### `issuer`

REQUIRED. WMP 保有組織の Core Profile の発行者でなければなりません (MUST)。

:::note

WMP 記載の情報は Core Profile を発行する組織が審査で確認します。

:::

#### `credentialSubject.id`

REQUIRED. WMP 保有組織の OP ID でなければなりません (MUST)。

#### `credentialSubject`

REQUIRED. Web メディアの発信者を表す JSON-LD Node Object です。

- `url`: REQUIRED.
- `name`: REQUIRED.
- `logo`: OPTIONAL.
- `email`: OPTIONAL.
- `telephone`: OPTIONAL.
- `contactTitle`: OPTIONAL.
- `contactUrl`: OPTIONAL.
- `privacyPolicyTitle`: OPTIONAL.
- `privacyPolicyUrl`: OPTIONAL.
- `publishingPrincipleTitle`: OPTIONAL.
- `publishingPrincipleUrl`: OPTIONAL.
- `description`: OPTIONAL.

## 拡張性

発行者は [OP VC Data Model](./op-vc-data-model.md) および本文書に未定義のプロパティを追加してもよいです (MAY) が、その場合は [Verifiable Credentials Data Model 2.0 セクション 5.2](https://www.w3.org/TR/vc-data-model-2.0/#extensibility)に従って拡張してください (RECOMMENDED)。

## Appendix

### 例

_このセクションは非規範的です。_

WMP の具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "WebMediaProfile"],
  "issuer": "dns:wmp-issuer.example.org",
  "credentialSubject": {
    "id": "dns:wmp-holder.example.jp",
    "type": "WebMediaProfileProperties",
    "url": "https://www.wmp-holder.example.jp/",
    "name": "○○メディア (※開発用サンプル)",
    "logo": {
      "id": "https://www.wmp-holder.example.jp/logo.svg",
      "digestSRI": "sha256-..."
    },
    "email": "contact@wmp-holder.example.jp",
    "telephone": "0000000000",
    "contactTitle": "お問い合わせ",
    "contactUrl": "https://wmp-holder.example.jp/contact",
    "privacyPolicyTitle": "プライバシーポリシー",
    "privacyPolicyUrl": "https://wmp-holder.example.jp/privacy",
    "publishingPrincipleTitle": "新聞倫理綱領",
    "publishingPrincipleUrl": "https://wmp-holder.example.jp/statement",
    "description": {
      "type": "PlainTextDescription",
      "data": "この文章はこの Web メディアに関する補足情報です。"
    }
  }
}
```

### JSON Schema

_このセクションは非規範的です。_

WMP のデータモデルを JSON Schema で示します。

```json
{
  "type": "object",
  "properties": {
    "@context": {
      "type": "array",
      "additionalItems": false,
      "minItems": 2,
      "items": [
        {
          "const": "https://www.w3.org/ns/credentials/v2"
        },
        {
          "const": "https://originator-profile.org/ns/credentials/v1"
        }
      ]
    },
    "type": {
      "type": "array",
      "additionalItems": false,
      "minItems": 1,
      "items": [{ "const": "VerifiableCredential" }]
    },
    "issuer": { "type": "string" },
    "credentialSubject": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "url": {
          "title": "Web メディア URL",
          "type": "string"
        },
        "logo": {
          "title": "ロゴ画像",
          "type": "object",
          "properties": {
            "id": {
              "title": "URL",
              "type": "string",
              "format": "uri"
            },
            "digestSRI": {
              "title": "Integrity Metadata",
              "description": "One or more hash-expression defined in section 3.5 in the SRI specification: https://www.w3.org/TR/SRI/#the-integrity-attribute",
              "type": "string"
            }
          },
          "required": ["id"]
        },
        "name": {
          "title": "Web メディア名",
          "type": "string"
        },
        "email": {
          "title": "メールアドレス",
          "type": "string"
        },
        "telephone": {
          "title": "電話番号",
          "type": "string"
        },
        "contactTitle": {
          "title": "連絡先表示名",
          "type": "string"
        },
        "contactUrl": {
          "title": "連絡先URL",
          "type": "string"
        },
        "privacyPolicyTitle": {
          "title": "プライバシーポリシー表示名",
          "type": "string"
        },
        "privacyPolicyUrl": {
          "title": "プライバシーポリシーURL",
          "type": "string"
        },
        "publishingPrincipleTitle": {
          "title": "編集ガイドライン表示名",
          "type": "string"
        },
        "publishingPrincipleUrl": {
          "title": "編集ガイドラインURL",
          "type": "string"
        },
        "description": {
          "title": "Web メディアに関する補足情報",
          "type": "object",
          "properties": {
            "type": {
              "enum": ["PlainTextDescription"]
            },
            "data": {
              "type": "string"
            }
          },
          "required": ["type", "data"]
        }
      },
      "required": ["url", "name"]
    }
  },
  "required": ["@context", "type", "issuer", "credentialSubject"]
}
```

---
sidebar_position: 6
---

# Certificate Data Model

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- Profile Annotation (PA)
- 認証制度

## Certificate のデータモデル

[Profile Annotation](./pa.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `type`

REQUIRED. 必ず `["VerifiableCredential", "Certificate"]` にしてください (MUST)。

#### `credentialSubject`

- `id`: REQUIRED.
- `type`: REQUIRED.
- `certificationSystem`: REQUIRED.
- `description`: REQUIRED.
- `image`: OPTIONAL.
- `certifier`: OPTIONAL.
- `verifier`: OPTIONAL.

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。次のプロパティを持ちます。

- `id`: REQUIRED. 認証制度の ID を URI 形式で指定してください。
- `type`: REQUIRED. `CertificationSystem` でなければなりません (MUST)。
- `name`: REQUIRED.　認証制度の名前です。
- `description`: REQUIRED. 認証制度の説明です。
- `ref`: RECOMMENDED. 認証制度の詳細を知るための人が読むためのページの URL です。

## Appendix

### 例

_このセクションは非規範的です。_

Certificate のデータモデルの具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "Certificate"],
  "issuer": "dns:pa-issuer.example.org",
  "credentialSubject": {
    "id": "dns:pa-holder.example.jp",
    "type": "CertificateProperties",
    "certificationSystem": "urn:uuid:14270f8f-9f1c-4f89-9fa4-8c93767a8404"
  },
  "certificationSystem": {
    "id": "urn:uuid:14270f8f-9f1c-4f89-9fa4-8c93767a8404",
    "type": "CertificationSystem",
    "name": "<認証制度名>",
    "description": "<認証制度の説明>",
    "ref": "https://certification.example.org/about"
  }
}
```

### JSON Schema

_このセクションは非規範的です。_

Certificate の形式を JSON Schema で示します。

```json
{
  "type": "object",
  "$defs": {
    "ProfileAnnotationSubject": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "description": { "type": "string" },
        "required": ["id"]
      }
    },
    "CertificationSystem": {
      "type": "object",
      "properties": {
        "id": {
          "title": "認定制度ID",
          "type": "string"
        },
        "name": {
          "title": "認証制度名",
          "type": "string"
        },
        "description": {
          "title": "認証制度の説明",
          "type": "string"
        },
        "ref": {
          "title": "認証制度の詳細URL",
          "type": "string"
        },
        "image": {
          "title": "認証制度の画像",
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
        "required": ["id", "name"]
      }
    }
  },
  "type": "object",
  "properties": {
    "@context": {
      "type": "array",
      "minItems": 3,
      "items": [
        {
          "const": "https://www.w3.org/ns/credentials/v2"
        },
        {
          "const": "https://originator-profile.org/ns/credentials/v1"
        },
        {
          "const": "https://originator-profile.org/ns/cip/v1"
        }
      ]
    },
    "type": {
      "type": "array",
      "minItems": 1,
      "items": [{ "const": "VerifiableCredential" }]
    },
    "issuer": { "type": "string" },
    "credentialSubject": { "$ref": "#/$defs/ProfileAnnotationSubject" },
    "certificationSystem": { "$ref": "#/$defs/CertificationSystem" }
  },
  "required": [
    "@context",
    "type",
    "issuer",
    "credentialSubject",
    "certificationSystem"
  ]
}
```

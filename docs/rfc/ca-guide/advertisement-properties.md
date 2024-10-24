# Advertisement Properties Implementer's Guide

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## Advertisement のデータモデル

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `credentialSubject`

広告を表す JSON-LD Node Object です。次のプロパティを含みます。

- `title`: REQUIRED. 広告のタイトル。
- `description`: REQUIRED. 広告の説明（プレーンテキスト）。
- `image`: OPTIONAL. 広告のサムネイル画像。サムネイル画像があるならば指定するべきです (RECOMMENDED)。
  - `id`: `image` を含める場合 REQUIRED です。画像の URL。
  - `digestSRI`: OPTIONAL. 画像のハッシュ値を指定します。形式は [Verifiable Credentials Data Model v2.0 セクション 5.3](https://www.w3.org/TR/vc-data-model-2.0/#integrity-of-related-resources) の定義に従います。
- `category`: OPTIONAL. IAB カテゴリータクソノミーによる分類の JSON-LD Node Object。空配列でもよい (MAY)。

#### `allowedUrl`

OPTIONAL. Content Attestation に定義済みのプロパティ。`allowedOrigin` と `allowedUrl` のいずれか一方を含めなければなりません(MUST) 。空配列にしてはなりません (MUST NOT)。

#### `allowedOrigin`

OPTIONAL. Content Attestation に定義済みのプロパティ。`allowedOrigin` と `allowedUrl` のいずれか一方を含めなければなりません(MUST) 。空配列にしてはなりません (MUST NOT)。

#### `target`

REQUIRED. Content Attestation に定義済みのプロパティ。空配列にしてはなりません (MUST NOT)。

## Appendix

### 例

_このセクションは非規範的です。_

Advertisement の具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "ContentAttestation"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
    "type": "AdvertisementProperties",
    "title": "<広告のタイトル>",
    "description": "<広告の説明>",
    "image": "https://ad.example.com/image.png"
  },
  "allowedOrigin": ["https://ad.example.com"],
  "target": [
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64="
    }
  ]
}
```

### JSON Schema

_このセクションは非規範的です。_

広告に紐づく CA の構造を示します。

```json
{
  "type": "object",
  "properties": {
    "@context": {
      "type": "array",
      "additionalItems": false,
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
      "additionalItems": false,
      "minItems": 1,
      "items": [{ "const": "VerifiableCredential" }]
    },
    "issuer": { "type": "string" },
    "credentialSubject": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "title": {
          "type": "string",
          "description": "広告のタイトル。"
        },
        "description": {
          "type": "string",
          "description": "広告の説明（プレーンテキスト）。"
        },
        "image": {
          "title": "広告画像",
          "type": "object",
          "description": "広告の画像。広告に強い関連をもつ画像があるならば、その画像を指定するべきです (RECOMMENDED)。",
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
        "category": {
          "type": "array",
          "items": {
            "title": "情報カテゴリー",
            "description": "OpenRTB 2.6の Object: Site にあるcat, cattax 類似の情報カテゴリーを持つ。https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf",
            "type": "object",
            "properties": {
              "cat": {
                "title": "情報カテゴリーID",
                "description": "情報カテゴリータクソノミーcattaxで示される分類におけるコードまたはID",
                "type": "string"
              },
              "cattax": {
                "title": "情報カテゴリータクソノミー",
                "description": "https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies",
                "type": "number"
              },
              "name": {
                "title": "情報カテゴリー名",
                "description": "情報カテゴリータクソノミーcattaxで示される分類におけるカテゴリー名",
                "type": "string"
              }
            },
            "required": ["cat"]
          },
          "description": "IAB カテゴリータクソノミーによる分類の JSON 配列。空配列でもよい (MAY)。"
        },
        "required": ["id", "title", "description"]
      }
    },
    "oneOf": [
      {
        "properties": {
          "allowedUrl": { "type": "string" },
          "allowedOrigin": {
            "enum": []
          }
        },
        "required": ["allowedUrl"]
      },
      {
        "properties": {
          "allowedUrl": {
            "enum": []
          },
          "allowedOrigin": { "type": "string" }
        },
        "required": ["allowedOrigin"]
      }
    ],
    "target": {
      "type": "array",
      "minItems": 1,
      "items": { "title": "Target Integrity", "type": "object" }
    }
  },
  "required": ["@context", "type", "issuer", "credentialSubject", "target"]
}
```

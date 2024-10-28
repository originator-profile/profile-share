# Content Properties Implementer's Guide

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## Content のデータモデル

[Content Attestation](../ca.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `credentialSubject`

コンテンツを表す JSON-LD Node Object です。次のプロパティを含みます。

- `title`: REQUIRED. コンテンツのタイトル。
- `description`: REQUIRED. コンテンツの説明（プレーンテキスト）。
- `source`: OPTIONAL. コンテンツの流通における1次ソース URL がある場合は記載を推奨 (RECOMMENDED)
- `image`: OPTIONAL. コンテンツのサムネイル画像。サムネイル画像がある場合指定するべきです (RECOMMENDED)。
  - `id`: `image` を含める場合 REQUIRED です。画像の URL。
  - `digestSRI`: OPTIONAL. 画像のハッシュ値を指定します。形式は [Verifiable Credentials Data Model v2.0 セクション 5.3](https://www.w3.org/TR/vc-data-model-2.0/#integrity-of-related-resources) の定義に従います。
- `datePublished`: OPTIONAL. 公開日 (ISO 8601)
- `dateModified`: OPTIONAL. 最終更新日 (ISO 8601)
- `author`: OPTIONAL. 著者名
- `editor`: OPTIONAL. 編集者名
- `category`: OPTIONAL. IAB カテゴリータクソノミーによる分類の JSON-LD Node Object。

#### `allowedUrl`

REQUIRED. Content Attestation に定義済みのプロパティ。空配列にしてはなりません (MUST NOT)。

#### `allowedOrigin`

Content Attestation に定義済みのプロパティ。含めてはいけません (MUST NOT) 。

#### `target`

REQUIRED. Content Attestation に定義済みのプロパティ。空配列にしてはなりません (MUST NOT)。

## Appendix

### 例

_このセクションは非規範的です。_

Content の具体例を次に示します。

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
    "type": "ContentProperties",
    "title": "<Webページのタイトル>",
    "image": "https://media.example.com/image.png",
    "source": "https://media2.example.com/articles/1",
    "description": "<Webページの説明>",
    "author": "山田花子",
    "editor": "山田太郎",
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "category": {
      "cat": "IAB1",
      "cattax": 1,
      "name": "Arts & Entertainment"
    }
  },
  "allowedUrl": "https://media.example.com/articles/2024-06-30",
  "target": [
    {
      "type": "VisibleTextTargetIntegrity",
      "cssSelector": "<CSS セレクター>",
      "integrity": "sha256-GYC9PqfIw0qWahU6OlReQfuurCI5VLJplslVdF7M95U="
    },
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-+M3dMZXeSIwAP8BsIAwxn5ofFWUtaoSoDfB+/J8uXMo="
    }
  ]
}
```

### JSON Schema

_このセクションは非規範的です。_

Content Properties の形式を JSON Schema で示します。

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
          "description": "コンテンツのタイトル。"
        },
        "description": {
          "type": "string",
          "description": "コンテンツの説明（プレーンテキスト）。"
        },
        "source": {
          "title": "一次ソース",
          "type": "string",
          "format": "uri",
          "description": "コンテンツの流通における1次ソース URL がある場合は記載を推奨 (RECOMMENDED)。"
        },
        "image": {
          "title": "コンテンツ画像",
          "type": "object",
          "description": "コンテンツの画像。コンテンツに強い関連をもつ画像があるならば、その画像を指定するべきです (RECOMMENDED)。",
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
        "datePublished": {
          "title": "公開日 (ISO 8501)",
          "type": "string"
        },
        "dateModified": {
          "title": "最終更新日 (ISO 8501)",
          "type": "string"
        },
        "author": {
          "title": "著者名",
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "editor": {
          "title": "編集者名",
          "type": "array",
          "items": {
            "type": "string"
          }
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
    "allowedUrl": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" }
    },
    "allowedOrigin": {
      "enum": []
    },
    "target": {
      "type": "array",
      "minItems": 1,
      "items": { "title": "Target Integrity", "type": "object" }
    }
  },
  "required": [
    "@context",
    "type",
    "issuer",
    "credentialSubject",
    "allowedUrl",
    "target"
  ]
}
```

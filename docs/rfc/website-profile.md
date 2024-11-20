---
sidebar_position: 5
---

# Website Profile (WSP) Data Model

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- Originator Profile Identifier (OP ID)
- OP VC Data Model Conforming Document (OP VC DM 準拠文書)
- Website Profile (WSP)

## Website Profile のデータモデル

Website Profile は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### `@context`

REQUIRED. [OP VC Data Model](./op-vc-data-model.md#context) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

### `type`

REQUIRED. 必ず `["VerifiableCredential", "WebsiteProfile"]` にしてください (MUST)。

### `issuer`

REQUIRED. Web サイト保有組織の OP ID にしてください (MUST)。

### `credentialSubject`

REQUIRED. 次のプロパティを含む JSON-LD Node Object です。

#### `id`

REQUIRED. Web サイトの URL を含めてください (MUST)。

#### `type`

REQUIRED. `WebSite` でなければなりません (MUST)。

#### `name`

REQUIRED. Web サイトの名称です。

#### `image`

OPTIONAL. Web サイトのサムネイル画像です。 [`image` データ型](./context.md#the-image-datatype) の JSON-LD Node Object でなければなりません (MUST)。

#### `description`

OPTIONAL. Web サイトの説明です。

#### `url`

REQUIRED. [Origin](https://www.rfc-editor.org/rfc/rfc6454) を [ASCII Serialization](https://www.rfc-editor.org/rfc/rfc6454#section-6.2) した文字列です。

具体例: `"https://example.com"`, `["https://a.example.com", "https://b.example.com"]`

## Appendix

### 例

_このセクションは非規範的です。_

Website Profile データモデルの非規範的な例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "WebsiteProfile"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "https://media.example.com",
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

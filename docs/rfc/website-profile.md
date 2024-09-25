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

REQUIRED. [OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

### `type`

REQUIRED. 次の値にしてください (MUST)。`["VerifiableCredential"]`

### `credentialSubject`

REQUIRED.

#### `id`

REQUIRED. Web サイト保有者の [OP ID](./op-id.md) を含めてください。

#### `type` {#credentialSubject-type}

REQUIRED. 文字列。`WebsiteProperties` にしてください (MUST)。

#### `title`

REQUIRED. Web サイトのタイトルです。

#### `image`

OPTIONAL. Web サイトのサムネイル画像です。次のプロパティを含みます。

- `id`: REQUIRED. サムネイル画像の URL です。
- `digestSRI`: OPTIONAL. サムネイル画像の integrity metadata です。

#### `description`

OPTIONAL. Web サイトの説明です。

#### `origin`

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
  "type": ["VerifiableCredential"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "dns:example.com",
    "type": "WebsiteProperties",
    "title": "<Webサイトのタイトル>",
    "description": "<Webサイトの説明>",
    "image": {
      "id": "https://media.example.com/image.png",
      "digestSRI": "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY="
    },
    "origin": "https://media.example.com"
  }
}
```

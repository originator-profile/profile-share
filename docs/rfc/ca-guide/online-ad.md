# Content Attestation of Online Ad Type Implementation Guidelines

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## Online Ad のデータモデル

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `type`

REQUIRED. 必ず `["VerifiableCredential", "ContentAttestation"]` にしてください (MUST)。

#### `credentialSubject`

広告を表す JSON-LD Node Object です。次のプロパティを含みます。

:::note

`credentialSubject` 内のプロパティは https://schema.org/CreativeWork を参考に決定しました。個々のプロパティの解釈、要不要について schema.org にどこまで準拠するかは OP を利用する企業との意見交換を踏まえて決めていく予定です。

:::

- `type`: REQUIRED. `OnlineAd` でなければなりません (MUST)。
- `name`: REQUIRED. 広告のタイトル。
- `description`: REQUIRED. 広告の説明（プレーンテキスト）。
- `image`: OPTIONAL. 広告のサムネイル画像。サムネイル画像があるならば指定するべきです (RECOMMENDED)。 [`image` データ型](../context.md#the-image-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `genre`: OPTIONAL. 文字列。

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
    "type": "OnlineAd",
    "name": "<広告のタイトル>",
    "description": "<広告の説明>",
    "image": {
      "id": "https://ad.example.com/image.png",
      "digestSRI": "sha256-5uQVtkoRdTFbimAz3Wz5GQcuBRLt7tDMD5JRtGFo9/M="
    }
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

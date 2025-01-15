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

- `id`: REQUIRED. Certificate を保有する組織の OP ID です。
- `type`: REQUIRED. 個別の Certificate を定義している文書で指定します。
- `certificationSystem`: REQUIRED. 認証制度の ID です。
- `description`: OPTIONAL. この証明書に関する説明です。
- `image`: OPTIONAL. [`image` データ型](./context.md#the-image-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `certifier`: OPTIONAL. 認証機関の名前です。
- `verifier`: OPTIONAL. 検証機関の名前です。

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。次のプロパティを持ちます。

- `id`: REQUIRED. 認証制度の ID を URI 形式で指定してください。
- `type`: REQUIRED. `CertificationSystem` でなければなりません (MUST)。
- `name`: REQUIRED.　認証制度の名前です。
- `description`: OPTIONAL. 認証制度の説明です。
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

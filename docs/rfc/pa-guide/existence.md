# Existence Certificate in Japan Implementation Guidelines

## 用語

本文書に説明のない用語については、[用語](../terminology.md)を参照してください。

- Profile Annotation (PA)
- Existence Certificate in Japan (ECJP): 日本における OP 保有組織の実在性証明書
- 認証制度

## Existence Certificate in Japan のデータモデル

[Certificate](../certificate.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `credentialSubject`

REQUIRED. 日本における実在性を表す JSON-LD Node Object です。

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。

## Appendix

### 例

_このセクションは非規範的です。_

プロパティの具体例を次に示します。

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
    "type": "Organization",
    "addressCountry": "JP",
    "name": "○○新聞社 (※開発用サンプル)",
    "corporateNumber": "0000000000000",
    "postalCode": "000-0000",
    "addressRegion": "東京都",
    "addressLocality": "千代田区",
    "streetAddress": "○○○",
    "certificationSystem": "urn:uuid:5374a35f-57ce-43fd-84c3-2c9b0163e3df"
  },
  "certificationSystem": {
    "id": "urn:uuid:5374a35f-57ce-43fd-84c3-2c9b0163e3df",
    "type": "CertificationSystem",
    "name": "法人番号システムWeb-API",
    "ref": "https://www.houjin-bangou.nta.go.jp/"
  }
}
```

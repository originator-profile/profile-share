# JICDAQ Certificate Implementation Guidelines

## 用語

本文書に説明のない用語については、[用語](../terminology.md)を参照してください。

- Profile Annotation (PA)
- JICDAQ Certificate: OP 保有組織の JICDAQ 認証の証明書
- 認証制度

## JICDAQ Certificate のデータモデル

[Certificate](../certificate.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `credentialSubject`

REQUIRED. JICDAQ Certificate を表す JSON-LD Node Object です。

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。

## Appendix

### 例

_このセクションは非規範的です。_

JICDAQ Certificate の具体例を次に示します。

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
    "description": "この事業者は、広告主のブランド価値を毀損するような違法、不当なサイト、コンテンツ、アプリケーションへの広告掲載を防ぐ対策を実施しています。第三者機関（日本ABC協会）による検証を経て、本認証を取得しました。",
    "image": {
      "id": "https://example.com/certification-mark.svg",
      "digestSRI": "sha256-OYP9B9EPFBi1vs0dUqOhSbHmtP+ZSTsUv2/OjSzWK0w="
    },
    "certifier": "一般社団法人 デジタル広告品質認証機構",
    "verifier": "日本ABC協会",
    "certificationSystem": "urn:uuid:2a12a385-fd1c-48e6-acd8-176c0c5e95ea"
  },
  "certificationSystem": {
    "id": "urn:uuid:2a12a385-fd1c-48e6-acd8-176c0c5e95ea",
    "type": "CertificationSystem",
    "name": "JICDAQ ブランドセーフティ第三者検証",
    "ref": "https://www.jicdaq.or.jp/"
  },
  "validFrom": "2022-03-31T15:00:00Z",
  "validUntil": "2024-03-31T14:59:59Z"
}
```

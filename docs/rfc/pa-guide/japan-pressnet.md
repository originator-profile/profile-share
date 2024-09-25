# 日本新聞協会所属証明書 Implementer's Guide

## 用語

本文書に説明のない用語については、[用語](../terminology.md)を参照してください。

- Profile Annotation (PA)
- 日本新聞協会所属証明書
- 認証制度

## 日本新聞協会所属証明書 のデータモデル

[Certificate](../certificate.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。

## Appendix

### 例

_このセクションは非規範的です。_

日本新聞協会所属証明書のデータモデルの具体例を次に示します。

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
    "name": "日本新聞社協会 所属社",
    "description": "一般社団法人日本新聞協会は、報道機関の倫理水準の向上を図ることで、健全な民主主義の発展に寄与することを目的とする団体です。報道機関が果たすべき責務と守るべき倫理について「新聞倫理綱領」を制定し、加盟社にこの綱領を順守することを求めています。加盟社は全国の新聞、通信、放送計１２２社（２０２４年５月１日現在）で、日々、正確で公正な記事と責任ある論評の発信に努めています。",
    "ref": "https://www.pressnet.or.jp/"
  },
  "validFrom": "2022-03-31T15:00:00Z",
  "validUntil": "2024-03-31T14:59:59Z"
}
```

### JSON Schema

_このセクションは非規範的です。_

日本新聞協会所属証明書の形式を JSON Schema で示します。

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
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

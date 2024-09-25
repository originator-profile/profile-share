# Existence Certificate in Japan Implementer's Guide

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
    "type": "ECJPProperties",
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

### JSON Schema

_このセクションは非規範的です。_

ECJP の形式を JSON Schema で示します。

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
    "CorporationJP": {
      "type": "object",
      "properties": {
        "country": {
          "title": "国",
          "description": "ISO 3166-1 alpha-2",
          "const": "JP"
        },
        "name": {
          "title": "法人名",
          "type": "string"
        },
        "corporateNumber": {
          "title": "法人番号",
          "type": "string"
        },
        "postalCode": {
          "title": "郵便番号",
          "type": "string"
        },
        "region": {
          "title": "都道府県",
          "type": "string"
        },
        "locality": {
          "title": "市区町村",
          "type": "string"
        },
        "streetAddress": {
          "title": "丁目番地など",
          "type": "string"
        }
      },
      "required": [
        "country",
        "name",
        "corporate_number",
        "postal_code",
        "region",
        "locality",
        "streetAdress"
      ]
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
    "credentialSubject": {
      "allOf": [
        { "$ref": "#/$defs/ProfileAnnotationSubject" },
        { "$ref": "#/$defs/CorporationJP" }
      ]
    },
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

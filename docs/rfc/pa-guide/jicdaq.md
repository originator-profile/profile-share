# JICDAQ Certificate Implementer's Guide

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
      "digestSRI": "sha256-..."
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

### JSON Schema

_このセクションは非規範的です。_

JICDAQ Certificate の形式を JSON Schema で示します。

```json
{
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
    "JICDAQ": {
      "type": "object",
      "properties": {
        "description": {
          "type": "string"
        },
        "image": {
          "title": "認証マークの画像",
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
        "validFrom": {
          "title": "JICDAQ 認証初回発行日時",
          "type": "string",
          "format": "date-time"
        },
        "validUntil": {
          "title": "JICDAQ 認証の失効日時",
          "type": "string",
          "format": "date-time"
        },
        "certifier": {
          "title": "認証機関",
          "type": "string"
        },
        "verifier": {
          "title": "検証機関",
          "type": "string"
        }
      },
      "required": ["description", "image", "certifier"]
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
          }
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
        { "$ref": "#/$defs/JICDAQ" }
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

---
sidebar_position: 2
---

# Core Profile Data Model

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- Core Profile (CP)
- Originator Profile (OP)
- Originator Profile Identifier (OP ID)
- OP VC Data Model Conforming Document (OP VC DM 準拠文書)
- Profile Annotation (PA)

## Core Profile (CP) のデータモデル

Core Profile は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### プロパティ

#### `@context`

[OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。

#### `credentialSubject.id`

REQUIRED. CP 保有組織の OP ID でなければなりません (MUST)。

#### `credentialSubject.jwks`

REQUIRED. [JWK Set](https://www.rfc-editor.org/rfc/rfc7517.html#section-5) でなければなりません (MUST)。CP 保有組織の公開鍵の集合です。

## 拡張性

発行者は [OP VC Data Model](./op-vc-data-model.md) および本文書に未定義のプロパティを Core Profile に追加してはなりません (MUST NOT) 。仕様策定者も Core Profile へのプロパティの追加を避けることが強く推奨されます (SHOULD)。

Web Media Profile あるいは [Profile Annotation](./pa.md) を拡張して発行することを検討してください。

## Appendix

### 例

_このセクションは非規範的です。_

Core Profile の具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "dns:example.org",
  "credentialSubject": {
    "id": "dns:example.jp",
    "type": "CoreProfile",
    "jwks": {
      "keys": [
        {
          "x": "ypAlUjo5O5soUNHk3mlRyfw6ujxqjfD_HMQt7XH-rSg",
          "y": "1cmv9lmZvL0XAERNxvrT2kZkC4Uwu5i1Or1O-4ixJuE",
          "crv": "P-256",
          "kid": "jJYs5_ILgUc8180L-pBPxBpgA3QC7eZu9wKOkh9mYPU",
          "kty": "EC"
        }
      ]
    }
  }
}
```

### JSON Schema

_このセクションは非規範的です。_

Core Profile の形式を JSON Schema で示します。

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "@context": {
      "type": "array",
      "additionalItems": false,
      "minItems": 2,
      "items": [
        {
          "const": "https://www.w3.org/ns/credentials/v2"
        },
        {
          "const": "https://originator-profile.org/ns/credentials/v1"
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
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string" },
        "jwks": {
          "type": "object",
          "title": "JWK Set"
        }
      },
      "required": ["id", "jwks"]
    }
  },
  "required": ["@context", "type", "issuer", "credentialSubject"]
}
```

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

## Core Profile (CP) のデータモデル {#data-model}

Core Profile は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### プロパティ {#properties}

#### `@context` {#context}

REQUIRED. URL の順序つき配列。必ず先頭が `https://www.w3.org/ns/credentials/v2`, その次が `https://originator-profile.org/ns/credentials/v1` でなければなりません (MUST)。

#### `type` {#type}

REQUIRED. 必ず `["VerifiableCredential", "CoreProfile"]` にしてください (MUST)。

#### `credentialSubject` {#credential-subject}

REQUIRED. JSON-LD Node Object です。

#### `credentialSubject.id` {#credential-subject-id}

REQUIRED. CP 保有組織の OP ID でなければなりません (MUST)。

#### `credentialSubject.type` {#credential-subject-type}

REQUIRED. `Core` でなければなりません (MUST)。

#### `credentialSubject.jwks` {#credential-subject-jwks}

REQUIRED. [JWK Set](https://www.rfc-editor.org/rfc/rfc7517.html#section-5) でなければなりません (MUST)。CP 保有組織の公開鍵の集合です。

#### `issuer` {#issuer}

REQUIRED. VC 発行組織の [OP ID](./op-id.md) でなければなりません (MUST)。

## 拡張性 {#extensibility}

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
  "type": ["VerifiableCredential", "CoreProfile"],
  "issuer": "dns:example.org",
  "credentialSubject": {
    "id": "dns:example.jp",
    "type": "Core",
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

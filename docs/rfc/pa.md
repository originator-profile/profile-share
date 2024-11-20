---
sidebar_position: 3
---

# Profile Annotation Data Model

Profile Annotation Data Model は Core Profile の主体に関する情報を表明するための VC の共通データモデルです。

:::note

Profile Annotation を VC として発行する際には必ず[拡張性](#extensibility)に従って拡張してください。拡張しない PA として発行してはいけません。

:::

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- Core Profile (CP)
- Originator Profile Identifier (OP ID)
- OP VC Data Model Conforming Document (OP VC DM 準拠文書)
- Profile Annotation (PA)

## Profile Annotation (PA) のデータモデル

Profile Annotation は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### プロパティ

#### `@context`

[OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。

#### `type`

REQUIRED. [OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。

#### `issuer`

REQUIRED. PA 発行者の OP ID です (MUST)。

#### `credentialSubject.id`

REQUIRED. PA 保有組織の OP ID でなければなりません (MUST)。

#### `credentialSubject.description`

OPTIONAL. 文字列でなければなりません (MUST)。

## 拡張性 {#extensibility}

PA を拡張したい者は `https://originator-profile.org/ns/credentials/v1#ProfileAnnotation` のコンテキスト定義を基に新しい Credential Type を作成しなければなりません (MUST)。

## Appendix

### 例

_このセクションは非規範的です。_

PA の具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential"],
  "issuer": "dns:pa-issuer.example.org",
  "credentialSubject": {
    "id": "dns:cp-holder.example.com",
    "description": "この文章は PA 保有組織に関する補足情報です。"
  }
}
```

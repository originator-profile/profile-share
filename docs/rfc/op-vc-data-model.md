---
sidebar_position: 10
---

# OP VC Data Model

OP の仕様ではいくつかの VC を定めています。それらの VC は [VC DM 2.0 準拠文書](https://www.w3.org/TR/vc-data-model-2.0/#dfn-conforming-document) を基にした共通のデータモデルに準拠しています。そのデータモデルをこの文書で定めます。

## VC のデータモデル {#data-model}

[VC DM 2.0 準拠文書](https://www.w3.org/TR/vc-data-model-2.0/#dfn-conforming-document)でなければなりません (MUST)。

### プロパティ {#properties}

#### `@context` {#context}

REQUIRED. URL の順序つき配列。必ず先頭が `https://www.w3.org/ns/credentials/v2`, その次が `https://originator-profile.org/ns/credentials/v1` でなければなりません (MUST)。また、配列の末尾の要素で VC 内の文字列の言語を `@language` タグで示さなければなりません (MUST)。つまり、言語が日本語だとすると `{"@language": "ja"}` を配列の末尾に含めてください。

#### `type` {#type}

REQUIRED. 必ず値が `VerifiableCredential` であるか、値に `VerifiableCredential` を含む [JSON-LD 語彙](https://www.w3.org/TR/json-ld11/#terms)の配列でなければなりません (MUST)。

#### `credentialSubject` {#credential-subject}

REQUIRED. JSON-LD Node Object です。

#### `credentialSubject.type` {#credential-subject-type}

OPTIONAL. 値は [JSON-LD 語彙](https://www.w3.org/TR/json-ld11/#terms)かその配列でなければなりません (MUST)。

#### `credentialSubject.id` {#credential-subject-id}

REQUIRED. 識別子です。識別子の形式は各 VC のデータモデルを定める文書で取り扱います。

#### `issuer` {#issuer}

REQUIRED. VC 発行組織の [OP ID](./op-id.md) でなければなりません (MUST)。

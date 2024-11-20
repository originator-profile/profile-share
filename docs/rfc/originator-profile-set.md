---
sidebar_position: 20
---

# Originator Profile Set

## 概要

本文書では組織に関する VC をまとめて配布するのに使えるデータ形式を定義します。

## 用語

本文書に説明のない用語については、[用語 RFC 文書](./terminology.md)を参照してください。

- Core Profile (CP)
- Profile Annotation (PA)
- Web Media Profile (WMP)
- Originator Profile (OP)
- Originator Profile Set (OPS)

## Originator Profile Set (OPS) のデータモデル

OPS のデータモデルを JSON で示します。

OPS は JSON オブジェクトの配列でなければなりません (MUST)。

各 JSON オブジェクトには以下のプロパティが定義されます:

- `core`: Core Profile (REQUIRED)
- `annotations`: Profile Annotation の配列 (OPTIONAL)
- `media`: Web Media Profile (OPTIONAL)

### `core`

REQUIRED. Core Profile です。

### `annotations`

OPTIONAL. Profile Annotation の配列です。このプロパティを含める場合、各要素は `core` の Core Profile と `credenialSubject.id` が等しくなければなりません (MUST)。 `credentialSubject.id` の OP ID 保有組織の信頼性に OPS の受信者が関心がある場合含めるべきです (SHOULD)。

### `media`

OPTIONAL. Web Media Profile です。このプロパティを含める場合、 `core` の Core Profile と `credenialSubject.id` が等しくなければなりません (MUST)。

## OPS の JSON Serialization

データモデルの JSON がそのまま OPS の JSON 表現になります。メディアタイプは `application/ops+json` です。

### 例

_このセクションは非規範的です。_

単一の組織の VC のみを含む OPS の具体例を次に示します。

```json
[
  {
    "core": "eyJ...",
    "annotations": ["eyJ..."],
    "media": "eyJ..."
  }
]
```

複数の組織の VC を含む OPS の具体例を次に示します。

```json
[
  {
    "core": "eyJ...",
    "annotations": ["eyJ...", "eyJ..."],
    "media": "eyJ..."
  },
  {
    "core": "eyJ...",
    "annotations": ["eyJ..."],
    "media": "eyJ..."
  }
]
```

## 検証プロセス

:::note

このセクションはより詳細に書く必要があります。

:::

ある組織に関する VC の検証プロセス

1. Core Profile の検証
2. Existence Certificate の検証
3. 他の PA および WMP の検証

検証は並列化してもよい。
1 の検証が失敗したら 2, 3 の検証はスキップしてよい。

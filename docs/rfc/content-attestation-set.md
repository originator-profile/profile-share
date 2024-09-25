---
sidebar_position: 21
---

# Content Attestation Set

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)
- Content Attestation Set (CAS)

## Content Attestation Set (CAS) データモデル

データモデルを JSON で表記します。

CAS は次のプロパティを持つ JSON Object の配列です。

- `attestation`: REQUIRED. Content Attestation です。
- `main`: OPTIONAL. Content Attestation がメインコンテンツに対するものである場合は `true`、そうでない場合は `false` です。デフォルト値は `false` です。

## JSON Serialization

上記のデータモデルを次のように変換します。メディアタイプは `application/cas+json` です。

```js
cas.map((e) =>
  e.main ? { attestation: e.attestation, main: true } : e.attestation,
);
```

次は変換後の非規範的な例です。

```json
["eyJ...", "eyJ...", { "attestation": "eyJ...", "main": true }, "eyJ..."]
```

## 検証

:::note

TODO

:::

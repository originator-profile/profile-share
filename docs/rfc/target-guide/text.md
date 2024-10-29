# Text Target Implementation Guidelines

## 概要

本文書は、対象要素に含まれるテキストコンテンツの完全性を保証するための形式について説明します。

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## Text Target の形式

Text Target は次のような形式です。

```json
{
  "type": "TextTargetIntegrity",
  "cssSelector": "<CSS セレクター>",
  "integrity": "sha256-GtNUUolQVlwIkQU9JknWkwkhfdiVmHr/BOnLFFHC5jI="
}
```

### JSON Schema

```json
{
  "title": "Text Target",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["TextTargetIntegrity"]
    },
    "integrity": {
      "type": "string"
    },
    "cssSelector": {
      "type": "string"
    }
  },
  "additionalProperties": true,
  "required": ["type", "integrity", "cssSelector"]
}
```

### プロパティ

- `type`: REQUIRED. Target Integrity のタイプです。必ず `TextTargetIntegrity` でなければなりません (MUST)。
- `integrity`: REQUIRED. [`sriString` データ型](../context.md#the-sristring-datatype) でなければなりません (MUST)。使用可能なハッシュ関数については[ハッシュアルゴリズム](../algorithm.md#hash-algorithm)に準拠してください (MUST)。具体例: `sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U=`
- `cssSelector`: REQUIRED. 必ず [CSS セレクター (Selectors Level 3)](https://www.w3.org/TR/cssSelectors-3/) でなければなりません (MUST)。

:::note

CA 発行者は、ページの動的な変化によらず `cssSelector` がマッチする要素が変わらないように `cssSelector` を指定してください (RECOMMENDED)。たとえば、`cssSelector` に `p` などのタグ名だけを指定するのではなく、 `#paragraphID`, `p.rareClassName` のようにより詳細な CSS セレクターを指定してください。対象要素を安定的に一意に特定するような CSS セレクターがないときには、ページを更新して、対象要素に id 属性を指定するなどして特定しやすいようなページ設計をしてください (RECOMMENDED)。

:::

:::note

`cssSelector` プロパティで利用できる CSS セレクターの機能を将来的に制限する可能性があります。

参考:

- [コンテンツ署名方式が十分かどうかの検討 · Issue #1427 · originator-profile/profile](https://github.com/originator-profile/profile/issues/1427)

:::

## 検証プロセス

1. `cssSelector` プロパティの CSS セレクターで指定した要素を検索します。対象の要素は、そのページの `document` のルート要素 (例えば、 HTML 文書の場合は `<html>` 要素) から、`querySelectorAll()` メソッドを使用して検索します。
2. 対象要素の [descendant text content](https://dom.spec.whatwg.org/#concept-descendant-text-content) を取得します。それは要素の `textContent` 属性の値です。もし仮に `null` が得られた場合は、その対象を空の文字列に変換します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果と `integrity` プロパティを [SRI セクション 3.3.5](https://www.w3.org/TR/SRI/#does-response-match-metadatalist) に規定されている方法で検証します。

:::note

Text Target は [`textContent` 属性](https://developer.mozilla.org/docs/Web/API/Node/textContent)を使用し、[`innerText` 属性](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText)とは異なります。両者の主な違いについては [Differences from innerText - MDN](https://developer.mozilla.org/docs/Web/API/Node/textContent#differences_from_innertext) を参照してください。

:::

## 要素位置特定方法

`cssSelector` プロパティの CSS セレクターで指定した要素を検索します。

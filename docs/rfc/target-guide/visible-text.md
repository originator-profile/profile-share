# Visible Text Target Implementation Guidelines

## 概要

本文書は、対象要素のレンダリングされているテキストの完全性を保証するための形式について説明します。

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## Visible Text Target の形式

Visible Text Target は次のような形式です。

```json
{
  "type": "VisibleTextTargetIntegrity",
  "cssSelector": "<CSS セレクター>",
  "integrity": "sha256-GtNUUolQVlwIkQU9JknWkwkhfdiVmHr/BOnLFFHC5jI="
}
```

### JSON Schema

```json
{
  "title": "Visible Text Target",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["VisibleTextTargetIntegrity"]
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

- `type`: REQUIRED. Target Integrity のタイプです。必ず `VisibleTextTargetIntegrity` でなければなりません (MUST)。
- `integrity`: REQUIRED. [`sriString` データ型](../context.md#the-sristring-datatype) でなければなりません (MUST)。使用可能なハッシュ関数については[ハッシュアルゴリズム](../algorithm.md#hash-algorithm)に準拠してください (MUST)。具体例: `sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U=`
- `cssSelector`: REQUIRED. 必ず [CSS セレクター (Selectors Level 3)](https://www.w3.org/TR/cssSelectors-3/) でなければなりません (MUST)。

## 検証プロセス

1. `cssSelector` プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素の [`innerText` 属性](https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute)を使用し `DOMString` として対象を取得します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果と `integrity` プロパティを [SRI セクション 3.3.5](https://www.w3.org/TR/SRI/#does-response-match-metadatalist) に規定されている方法で検証します。

:::note

[`innerText` 属性](https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute)で得られる文字列は、 [HTML Standard 3章](https://html.spec.whatwg.org/multipage/dom.html) では、 [get the text steps](https://html.spec.whatwg.org/multipage/dom.html#get-the-text-steps) を実行して得られる "as rendered" なテキストと定義されています。 [being rendered](https://html.spec.whatwg.org/multipage/rendering.html#being-rendered) な要素に [get the text steps](https://html.spec.whatwg.org/multipage/dom.html#get-the-text-steps) を実行すると、 [rendered text collection steps](https://html.spec.whatwg.org/multipage/dom.html#rendered-text-collection-steps) を実行した後改行文字などに処理を加えた文字列が得られます。

:::

:::note

Visible Text Target は [`innerText` 属性](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText)を使用し、[`textContent` 属性](https://developer.mozilla.org/docs/Web/API/Node/textContent)とは異なります。両者の主な違いについては [Differences from innerText - MDN](https://developer.mozilla.org/docs/Web/API/Node/textContent#differences_from_innertext) を参照してください。

:::

:::note

ブラウザ以外のユーザーエージェントでの Visible Text Target の実装は複雑になる可能性があります。また、空白文字の除去などの正規化を考慮したターゲットと将来新たに定義する可能性があります。

参考: [コンテンツ署名方式が十分かどうかの検討 · Issue #1427 · originator-profile/profile](https://github.com/originator-profile/profile/issues/1427)

:::

## 要素位置特定方法

`cssSelector` プロパティの CSS セレクターで指定した要素を検索します。

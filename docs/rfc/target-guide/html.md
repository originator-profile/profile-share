# HTML Target Implementer's Guide

## 概要

本文書は、対象要素の HTML の文字列としての完全性を保証するための形式について説明します。

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## HTML Target の形式

HTML Target は次のような形式です。

```json
{
  "type": "HtmlTargetIntegrity",
  "cssSelector": "<CSS セレクター>",
  "integrity": "sha256-..."
}
```

### JSON Schema

```json
{
  "title": "HTML Target",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["HtmlTargetIntegrity"]
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

- `type`: REQUIRED. Target Integrity のタイプです。必ず `HtmlTargetIntegrity` でなければなりません (MUST)。
- `integrity`: REQUIRED. [Subresource Integrity (SRI) セクション 3.5](https://www.w3.org/TR/SRI/#the-integrity-attribute) の hash-expression でなければなりません (MUST)。具体例: `sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U=`
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

1. cssSelector プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素の [`outerHTML` 属性](https://developer.mozilla.org/docs/Web/API/Element/outerHTML)を使用し `DOMString` として対象を取得します。もし仮に要素が UTF-8 ではない場合、 [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) に準拠した方法によって符号化します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果と `integrity` プロパティの Integrity Metadata を [SRI セクション 3.3.5](https://www.w3.org/TR/SRI/#does-response-match-metadatalist) に規定されている方法で検証します

## 要素位置特定方法

`cssSelector` プロパティの CSS セレクターで指定した要素を検索します。

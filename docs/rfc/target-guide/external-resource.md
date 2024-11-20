# External Resource Target Implementation Guidelines

## 概要

本文書で定義される External Resource Target は画像や動画などの外部リソースファイルの完全性を保証するための Content Attestation (CA) のプロパティです。 URL が参照するリソースの完全性を保証できる一方で、扱える URL はユーザーエージェントに依らず同じバイト列をレスポンスとして返却するものに限られます。

:::note

この target について実証実験の参加企業の方々からフィードバックをいただく予定です。また関連する仕様のアップデートの状況を見ながらよりよい方法を将来追加する可能性があります。

参考: [画像加工を伴う CDN 利用時の検証可能化方法の検討 · Issue #1426 · originator-profile/profile](https://github.com/originator-profile/profile/issues/1426)

:::

## 範囲

- 静的なファイルを扱います。
- JavaScript 等によって生成される動的なリソースは本文書の範囲外です。
- Adaptive Bitrate Streaming で配信される動画は扱いません。単一の動画ファイルとして配信される動画のみ扱います。
- background-image CSS プロパティや content CSS プロパティといった CSS で取得表示されるリソースは本文書の範囲外です。
- [コンテンツネゴシエーション](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation)による動的なリソースは本文書の範囲外です。

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)

## External Resource Target の形式

JSON オブジェクトでなければなりません。
External Resource Target の具体例を次に示します。

```json
{
  "type": "ExternalResourceTargetIntegrity",
  "integrity": "sha256-OYP9B9EPFBi1vs0dUqOhSbHmtP+ZSTsUv2/OjSzWK0w="
}
```

以下のプロパティが定義されます:

- `type`: REQUIRED. 必ず `ExternalResourceTargetIntegrity` でなければなりません (MUST)。
- `integrity`: REQUIRED. [`sriString` データ型](../context.md#the-sristring-datatype) でなければなりません (MUST)。使用可能なハッシュ関数については[ハッシュアルゴリズム](../algorithm.md#hash-algorithm)に準拠してください (MUST)。具体例: `sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U=`

## 設定方法

`integrity` プロパティと同じ値を HTML 要素の `integrity` 属性に指定します。

### 例

source 要素と img 要素を External Resource Target から参照する場合の具体例を次に示します。

External Resource Target:

```json
[
  {
    "type": "ExternalResourceTargetIntegrity",
    "integrity": "sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U="
  },
  {
    "type": "ExternalResourceTargetIntegrity",
    "integrity": "sha256-t7WZSGxDdqGvGg/FLw6wk9KFQy5StT1MquCf/htwjBo="
  }
]
```

このとき Web ページの HTML の source 要素と img 要素に次のように `integrity` 属性を付与します。

```html
<picture>
  <source
    src="image.jpg"
    integrity="sha256-4HLmAAYVRClrk+eCIrI1Rlf5/IKK0+wGoYjRs9vzl7U="
  />
  <img
    src="https://cdn.example.com/image.jpg"
    integrity="sha256-t7WZSGxDdqGvGg/FLw6wk9KFQy5StT1MquCf/htwjBo="
  />
</picture>
```

video 要素を External Resource Target から参照する場合の具体例を次に示します。この場合、src 属性に指定された外部リソースが検証され、poster 属性に指定された外部リソースは検証されません。

```html
<video
  src="https://cdn.example.com/video.mp4"
  integrity="sha256-OYP9B9EPFBi1vs0dUqOhSbHmtP+ZSTsUv2/OjSzWK0w="
  poster="https://cdn.example.com/poster.jpg"
></video>
```

:::note

上記の poster 属性のように、現状の仕様では完全性チェックができない場合があります。このような場合に対応するため仕様を拡張することを検討しています。
:::

## 検証プロセス

1. `integrity` プロパティと同じ値を `integrity` HTML 属性に含む要素を検索します。
2. 要素の `src` 属性の URL に GET リクエストを送り外部リソースを取得します。
3. その結果と integrity プロパティを [SRI セクション 3.3.5](https://www.w3.org/TR/SRI/#does-response-match-metadatalist) に規定されている方法で検証します。

## 要素位置特定方法

`integrity` プロパティと同じ値を `integrity` HTML 属性に含む要素を検索します。

## 参考文献

- [W3C Subresource Integrity](https://www.w3.org/TR/SRI/)
- [webappsec-subresource-integrity/signature-based-restrictions-explainer.markdown at main · w3c/webappsec-subresource-integrity](https://github.com/w3c/webappsec-subresource-integrity/blob/main/signature-based-restrictions-explainer.markdown)
- [Content Security Policy Level 3](https://w3c.github.io/webappsec-csp/)
- [Apply subresource integrity to `<img>` tags · Issue #113 · w3c/webappsec-subresource-integrity](https://github.com/w3c/webappsec-subresource-integrity/issues/113)
- [integrity for downloads · Issue #68 · w3c/webappsec-subresource-integrity](https://github.com/w3c/webappsec-subresource-integrity/issues/68)
- [SRI: Integrity enforcement on downloads · Issue #497 · w3c/webappsec](https://github.com/w3c/webappsec/issues/497)
- [\[SRI\] Support signatures/asymm key · Issue #449 · w3c/webappsec](https://github.com/w3c/webappsec/issues/449)
- [Consideration: Allow integrity-check based on signature instead of actual hash · Issue #85 · w3c/webappsec-subresource-integrity](https://github.com/w3c/webappsec-subresource-integrity/issues/85)

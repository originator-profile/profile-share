---
sidebar_position: 22
---

# Linking Content Attestation Set and Originator Profile Set to A HTML Document - Implementer's Guide

## 概要

本文書では、 Content Attestation Set および Originator Profile Set を特定の Web ページに紐づける方法を定義します。Web ページの HTML に CAS や OPS またはその URL を含む HTML 要素を挿入することで紐づけます。紐づけられた VC を利用して、ユーザーエージェントは Web ページやその発信者の情報を検証してユーザーに表示することができます。

## 用語

本文書に説明のない用語については、用語 RFC 文書を参照してください。

- Content Attestation (CA)
- Content Attestation Set (CAS)
- Originator Profile Set (OPS)

## 方法

script 要素を使用します。埋め込みと参照のどちらの方法も使用可能です。

type 属性を使用してデータの種類が CAS または OPS であることを示さなければなりません (MUST)。 CAS の場合は `application/cas+json` を、 OPS の場合は `application/ops+json` を type 属性に指定しなければなりません (MUST)。

### 埋め込み

script 要素のコンテンツに JSON オブジェクトを記述します。

#### 例

_このセクションは非規範的です。_

単一の CA を含む CAS を埋め込む例を次に示します。

```htmlembedded
<script type="application/cas+json">
["eyJ..."]
</script>
```

2つの CA を含む CAS を埋め込む例を次に示します。

```htmlembedded
<script type="application/cas+json">
["eyJ...", "eyJ..."]
</script>
```

1つの OP を含む OPS を埋め込む例を次に示します。

```htmlembedded
<script type="application/ops+json">
[
  {
    "core": "eyJ...",
    "annotations": ["eyJ..."],
    "media": "eyJ..."
  }
]
</script>
```

### 外部参照

src 属性に CAS または OPS の URL を記述します。

integrity 属性には URL が参照するリソースのハッシュ値を指定します (MUST)。
ハッシュ値はサブリソース完全性 (SRI) の検証に使用します。
ハッシュ値の形式は [SRI セクション 3.5](https://www.w3.org/TR/SRI/#the-integrity-attribute) の integrity-metadata でなければなりません (MUST)。

#### 例

_このセクションは非規範的です。_

URL で CAS を参照する具体例を次に示します。

```htmlembedded
<script type="application/cas+json" src="https://example.com/cas.json" integrity="sha256-XnUoFByIs5DIz6wAvte7AfpYeqPrs42KLR1Mlg9+A/M="></script>
```

URL で OPS を参照する例を次に示します。

```htmlembedded
<script type="application/ops+json" src="https://example.com/ops.json" integrity="sha256-XnUoFByIs5DIz6wAvte7AfpYeqPrs42KLR1Mlg9+A/M="></script>
```

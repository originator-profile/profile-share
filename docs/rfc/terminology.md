---
sidebar_position: 1
---

# 用語

## Originator Profile Identifier (OP ID)

Core Profile 保有組織の ID. [OP ID レジストリ](./op-id.md)に登録されているものを使うことができる。

## Originator Profile (OP)

ある組織を subject とする VC をまとめたデータ。

## Originator Profile Set (OPS)

[Originator Profile Set](./originator-profile-set.md) で定められているデータモデルおよびデータ表現。組織に関する VC をまとめたデータ。

## OP VC Data Model Conforming Document (OP VC DM 準拠文書)

[OP VC Data Model](./op-vc-data-model.md) に準拠している JSON-LD ドキュメント。

## Core Profile (CP)

[Core Profile](./cp.md) で定められている VC。ある OP ID の主体にある公開鍵の集合が対応していることを暗号論的に証明する。

## Profile Annotation (PA)

[Profile Annotation](./pa.md) で定められている VC。組織に関する情報を記述する VC。情報に応じて適切な主体が署名する。

## Web Media Profile (WMP)

[Web Media Profile](./web-media-profile.md) で定義される VC。 OP ID 保有組織のことをユーザーに表示してどのような組織なのかをわかってもらうときに必要な情報が記述される。

## OP 保有組織

CP の `credentialSubject.id` プロパティが指す OP ID を保有する組織。

## OP レジストリ

OP ID を求める組織を審査して OP ID および Core Profile を発行する団体。 Core Profile への署名は OP レジストリが行う。

## 検証者

OP が定義する VC やそれをまとめたデータを受け取って検証するソフトウェア。例えばインターネット上のコンテンツを閲覧するエンドユーザーの仕様するユーザーエージェントや、検索エンジンクローラーなどのボットが挙げられる。

## Web Content

Web ページ上の複数 DOM で表現された、情報として一つのまとまりを持つ要素。1 つの Web Content は単一の組織によって出版される。 DOM 上で1つの要素に収まるとは限らない。

## Content Attestation (CA)

[Content Attestation](./ca.md)で定義されるコンテンツの真正性に関する情報の集合

## CA ID

CA の `credentialSubject.id` プロパティに指定される ID。 Web Content と1対1対応する。

## Content Attestation Set (CAS)

[Content Attestation Set RFC 文書](./content-attestation-set.md)で定義される複数の Content Attestation を提示するための表現形式

## Target Integrity

CA に含まれるデータの一つであり、コンテンツの完全性を保証するために使う。コンテンツの位置を特定するためのデータと SHA-256 などの一方向ハッシュ関数の出力を含む。

## Target Element

Target Integrity が特定する DOM 要素。

## Target Location

ある target integrity が特定する target element の位置。複数存在する場合は最初の要素の位置。

## Target Text

ある target integrity の target element をその target integrity が指定する方法で文字列表現に変換した値。 target integrity はこの値の完全性を保証する。

## Certificate

[Certificate](./certificate.md) RFC 文書で定義される、発行者が OP 保有組織に対して内容を記述したことを証明する情報。証明書。

## 認証制度 (Certification System)

[Certificate](./certificate.md) が暗号論的に証明する情報が実際に事実であることを担保するための制度。認証機関によって運営される。

## 認証機関 (Certifier)

認証制度 (Ceritification System) を運用する主体。Certificate の発行者とは限らない。

---
sidebar_position: 11
---

# リンクと用語集

本実験に参加する上で必ずしも必要な情報ではありませんが、各社 CMS の対応をしたり動作を確認する上で仕様や実装の詳細を確認する必要がある場合などに参照頂く情報をまとめました。

プロトタイプ実装の仕様と実装の詳細は以下をご覧ください:

## 全般

- [全体サマリ](/)
- [オリジネータープロファイル リポジトリ](https://github.com/webdino/profile)
- [仕様](/spec.md)
  - リポジトリ全体での仕様
- [環境構築手順書](/development.md)
  - Linux, macOS または Windows (WSL2)で開発環境を構築するための手順

## Profile Registry

- [サマリ](/registry/)
- [仕様](/registry/spec.md)
  - Profile Registry に関する仕様
- [操作説明書](/registry/operation.md)
  - Originator Profile、Document Profile の発行手順と Web サイトへの紐づけ方法
- [Document Profile レジストリ構築](/registry/document-profile-registry-creation.md)
  - Document Profile 　レジストリの構築手順
- [WordPress 連携](/registry/wordpress-integration.md)
  - WordPress サイト と Document Profile 　レジストリとの連携方法
  - 前提として Document Profile 　レジストリの構築が完了していること
- [ウェブサイト　連携](/registry/website-integration.md)
  - ウェブサイト　と　 Document Profile レジストリとの連携方法
  - 前提として Document Profile 　レジストリの構築が完了していること
- [API](/registry/assets/api/)
  - Profile Registry で使用されている API 一覧
- [ER 図](/registry/assets/erd/)
  - データベーススキーマの ER 図

## Profile Web Extension

- [サマリ](/web-ext/)
- [拡張機能の実験的利用](/web-ext/experimental-use.md)

## Profile Model

- [サマリ](/model/)
- [スキーマ](/model/assets/)

# 用語集

Originator Profile 技術研究組合またはその配下の技術開発 WG において OP 技術開発に際して独自に定義している用語について説明します。

- Document Profile (DP) レジストリ
  - 下記のような役割を持つレジストリ
    - Profile Set (PS) を保存、ブラウザのリクエストに応じて返す
    - OP レジストリから SOP を受け取り(更新などもしつつ) DP 発行時に使う
- Originator Profile (OP) レジストリ
  - 下記のような役割を持つレジストリ
    - OP CIP 加盟組織の情報を用いて組織情報の登録を行う
    - 登録したい組織情報、認証機関、プライベート鍵を用いて Signed Originator Profile を発行
- Profile Set (PS)
  - Web ページ発行組織単位で管理されている SOP と SDP の総称
  - この情報を用いて Web サイトの信頼性を判断する
  - Signed Profile Set という名称もこの用語と同義
- Signed Document Profile (SDP)
  - 署名付き Web ページ情報
  - SOP を持つ組織によって作成された Web ページに付与される
- Signed Originator Profile (SOP)
  - 署名付き組織情報
  - この組織情報を用いて SOP を発行する

(随時追記します)

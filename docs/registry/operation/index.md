---
sidebar_position: 1
---

# レジストリ運用

レジストリの運用にあたり、各関係者が実施する作業について説明します。

以下の図は Originator Profile レジストリの関係者が作業する対象と依存関係を示しています。

![image](https://user-images.githubusercontent.com/281424/198944140-26516b92-3f3b-4b89-92be-e5f56c9bd3f8.png)

## 企業・組織の担当者

Originator Profile レジストリの会員となり、発行される [Signed Originator Profile（SOP）](/spec/index.md#signed-originator-profile)により自身の組織の身元を表明します。次の作業を実施します。

- [組織情報の提出](./org-info-submission.md)
- [資格情報の提出](./credential-submission.md)
- [鍵ペアの生成](./key-pair-generation.md)

## 第三者認証機関の担当者

Originator Profile レジストリの会員となり、Originator Profile により自身あるいは他組織の身元を表明します。次の作業を実施します。

- [組織情報の提出](./org-info-submission.md)
- [鍵ペアの生成](./key-pair-generation.md)

## 記事出版・引用の担当者

[Signed Document Profile（SDP）](/spec/index.md#signed-document-profile)を発行して自身の組織の出版物を表明します。また、自身の組織の SOP と SDP を利用して [Profile Set](/spec/index.md#profile-set) を作成します。これらは間接的に Document Profile レジストリ管理者が用意したレジストリ API 等によって行われます。

## 企業・組織のウェブサイトの管理者

[Signed Document Profile（SDP）](/spec/index.md#signed-document-profile)を発行して自身の組織のウェブサイトを表明します。また、自身の組織の SOP と SDP を利用して [Website Profile Pair](/terminology/website-profile-pair.md) を作成します。次の作業を実施します。

- [署名付きサイトプロファイルの作成と設置](./website-profile-pair-installation.md)

## 広告主・広告代理店（DSP）

署名付き広告プロファイルを作成し、Profile Pairを設置することで広告主の広告を表明します。

- [iframe に埋め込む HTML コンテンツからの対象テキストの抽出](./iframe-html-extraction.md)
- [署名付き広告プロファイルの作成と設置](./ad-profile-pair-installation.md)

## Originator Profile レジストリ管理者

Originator Profile の発行者です。次の作業を実施します。

- [レジストリ DB 参照](./registry-db-access.md)
- [会員の作成](./account-creation.md)
- [資格情報の登録](./credential-registration.md)
- [鍵ペアの生成](./key-pair-generation.md)
- [レジストリへの公開鍵の登録](./public-key-registration.md)
- [Signed Originator Profile 発行](./signed-originator-profile-issuance.md)

## Document Profile レジストリ管理者

Document Profile の発行者です。次の作業を実施します。

- [Document Profile レジストリ構築](../integration/document-profile-registry-creation.md)
- [レジストリ DB 参照](./registry-db-access.md)
- [Signed Document Profile 発行・更新](./signed-document-profile-issuance.md)
- [Profile Set 作成](./profile-set-creation.md)
- [WordPress 連携](../integration/wordpress-integration.md)
- [Web サイト連携](../integration/website-integration.md)

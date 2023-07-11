---
sidebar_position: 1
---

# レジストリ運用

レジストリの運用にあたり、各関係者が実施する作業について説明します。

以下の図は Originator Profile レジストリの関係者が作業する対象と依存関係を示しています。

![image](https://user-images.githubusercontent.com/281424/198944140-26516b92-3f3b-4b89-92be-e5f56c9bd3f8.png)

## 企業・組織の担当者

Originator Profile レジストリの会員となり、発行される [Signed Originator Profile（SOP）](/spec.md#signed-originator-profile)により自身の組織の身元を表明します。次の作業を実施します。

- [組織情報の提出](./org-info-submission.md)
- 資格情報の提出
- [鍵ペアの生成](./key-pair-generation.md)

## 第三者認証機関の担当者

Originator Profile レジストリの会員となり、Originator Profile により自身あるいは他組織の身元を表明します。次の作業を実施します。

- [組織情報の提出](./org-info-submission.md)
- [鍵ペアの生成](./key-pair-generation.md)

## 記事出版・引用の担当者

[Signed Document Profile（SDP）](/spec.md#signed-document-profile)を発行して自身の組織の出版物を表明します。自身の組織の SOP と SDP を利用して [Profile Set](/spec.md#profile-set) を作成します。次の作業を実施します。

- [Document Profile レジストリ構築](../document-profile-registry-creation.md)
- [レジストリ DB 参照](./registry-db-access.md)
- [WordPress 連携](../wordpress-integration.md)
- [Web サイト連携](../website-integration.md)
- [Signed Document Profile 発行](./signed-document-profile-issuance.md)
- [Profile Set 作成](./profile-set-creation.md)

## 広告主

TBD

## Originator Profile レジストリ管理者

Originator Profile の発行者です。次の作業を実施します。

- [レジストリ DB 参照](./registry-db-access.md)
- [会員の作成](./account-creation.md)
- [鍵ペアの生成](./key-pair-generation.md)
- [公開鍵の登録](./public-key-registration.md)
- [Signed Originator Profile 発行](./signed-originator-profile-issuance.md)

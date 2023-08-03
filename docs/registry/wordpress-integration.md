---
sidebar_position: 4
---

# WordPress 連携

## 概要

Document Profile レジストリを WordPress サイトに連携する方法を説明します。

以下の図は WordPress 連携に関するプロセスの概要を示しています。

```mermaid
sequenceDiagram
actor 利用者
actor WordPress 管理者
participant WordPress
participant WordPress Plugin
participant Document Profile レジストリ
participant Originator Profile レジストリ

WordPress 管理者->>WordPress: WordPress Plugin のインストール
WordPress->>WordPress Plugin: activated_plugin hook
WordPress Plugin-->>WordPress 管理者: 公開鍵

WordPress 管理者->>Originator Profile レジストリ: Originator Profile の発行依頼
Originator Profile レジストリ-->>WordPress 管理者: Signed Originator Profile
WordPress 管理者->>Document Profile レジストリ: Signed Originator Profile の登録

WordPress 管理者->>WordPress: 記事の公開
WordPress->>WordPress Plugin: transition_post_status hook
WordPress Plugin->>WordPress Plugin: Signed Document Profile の発行
WordPress Plugin->>Document Profile レジストリ: Signed Document Profile の登録

利用者->>WordPress: 投稿の閲覧
WordPress->>WordPress Plugin: wp_head hook
WordPress Plugin-->>利用者: HTML <link> 要素

利用者->>Document Profile レジストリ: 拡張機能をクリック
Document Profile レジストリ-->>利用者: Profile Set

利用者->>利用者: コンテンツ情報の閲覧と検証
```

## デモ

[拡張機能を用意](../web-ext/experimental-use.md)し、 https://wppdev.herokuapp.com/2023/06/29/hello-world/ にアクセスして参照実装の実際の動作を確認できます。

## 構築ガイド

1. [Document Profile レジストリの構築](./document-profile-registry-creation.md)
2. プラグインのインストール

## プラグインのインストール

WordPress サイトに WordPress Profile Plugin をインストールします。
[WordPress Profile Plugin ソースコード](https://github.com/originator-profile/profile-share/tree/main/packages/wordpress#readme)を参照してください。

Originator Profile ID を、WordPress 管理者画面 > Settings > Profile > [Originator Profile ID] に入力します。

例:

```
media.example.com
```

Document Profile レジストリサーバーのホスト名を、WordPress 管理者画面 > Settings > Profile > [レジストリサーバーホスト名] に入力します。

例:

```
dprexpt.originator-profile.org
```

[レジストリの管理者を作成](./document-profile-registry-creation.md#レジストリの管理者の作成)した際の認証情報、WordPress 管理者画面 > Settings > Profile > [認証情報] に入力します。

例:

```
cfbff0d1-9375-5685-968c-48ce8b15ae17:GVWoXikZIqzdxzB3CieDHL-FefBT31IfpjdbtAJtBcU
```

それぞれ適切な値を入力したら、保存を選択し、設定を反映します。
設定が反映されれば、それ以降公開される投稿で Profile Set が配信されるようになります。

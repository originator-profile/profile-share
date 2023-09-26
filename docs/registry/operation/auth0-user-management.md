# Auth0 ユーザー管理

本ページでは、Auth0ユーザーの登録や削除などを含む管理方法について説明します。

## 前提条件

特定の運用環境（Auth0テナント）の[Auth0 Dashboard](https://manage.auth0.com)にアクセスできることを確認してください。

## 登録

### ユーザーの作成

[Create Users](https://auth0.com/docs/manage-users/user-accounts/create-users)の手順を実施してください。

### メールアドレスの検証

OP登録サイトには、ユーザーのメールアドレス宛てにメールを送信する機能を実装する予定です。当該機能はメールアドレスの有効性が確認済みであることを前提に実装します。

ユーザーの登録時に以下の手順を実施してください。

1. [Dashboard > User Management > Users](https://manage.auth0.com/#/users)にアクセス
2. メールアドレスの検証をおこなうユーザーの3点リーダーをクリック
3. "Send Verification Email"をクリック

### ロールの割当

ユーザーの初回ログイン時にgroupロールが付与されます。group以外のロールを付与する場合は、[Auth0 ユーザーの role の変更](./auth0-role-assigning.md)を参照してください。

## 削除

[Delete Users](https://auth0.com/docs/manage-users/user-accounts/delete-users)の手順を実施してください。

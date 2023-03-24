---
sidebar_position: 3
---

# WordPress との連携

## 概要

Document Profile レジストリを構築し WordPress サイトと連携する方法を説明します。

## 構築ガイド

1. Document Profile レジストリの準備
2. プラグインのインストール
3. Originator Profile レジストリへの公開鍵の登録と Signed Originator Profile の発行依頼
4. Document Profile レジストリへの Signed Originator Profile の登録

## Document Profile レジストリの準備

Heroku などを利用して Profile Registry のデプロイを行います。

このリポジトリを clone してコマンドラインで作業を行うことになります。
[開発ガイド](https://github.com/webdino/profile/blob/main/docs/development.md)を参照してください。

### レジストリの管理者の作成

PostgreSQL 接続 URL など `bin/dev` コマンドの実行に必要な情報を .env ファイルに指定します。
[Profile Registry ソースコード](https://github.com/webdino/profile/blob/main/apps/registry#環境変数)を参照してください。

```
$ cd apps/registry
$ touch .env
$ chmod 600 .env
$ editor .env
```

レジストリの管理者の作成を行います。

<!-- TODO: 管理者作成コマンドの修正
会員作成も行えるように変更したい
-->

```
$ bin/dev admin:create
```

このとき得られる認証情報は次項で使用します。

## プラグインのインストール

WordPress サイトに WordPress Profile Plugin をインストールします。
[WordPress Profile Plugin ソースコード](https://github.com/webdino/profile/tree/main/packages/wordpress#readme)を参照してください。

Document Profile Registry のドメイン名は WordPress 管理者画面 > Settings > Profile > [レジストリドメイン名] に設定してください。

<!-- TODO: 未実装

Document Profile Registry の認証情報は WordPress 管理者画面 > Settings > Profile > [認証情報] に設定してください。
-->

## Originator Profile レジストリへの公開鍵の登録と Signed Originator Profile の発行依頼

Originator Profile レジストリ運用者に依頼して行います。

JWK 公開鍵は WordPress 管理者画面 > Settings > Profile 設定画面にアクセスすると確認できます。

JWK の例:

```json
{
  "crv": "P-256",
  "kty": "EC",
  "x": "6OBp79JZKOaSFbjGaUrlcv17FdyGz-bUUYdW2xPgRBE",
  "y": "TeTGAWf_OrdUmC9UUYn7x6aZx39g-Qk98XmMpwXW_ew",
  "kid": "j9L_Qji2BC4vj1AaDCdzpurXSpM7cKBbtWO-W5a0SK4",
  "alg": "ES256",
  "use": "sig"
}
```

<!-- NOTE:
Originator Profile レジストリ運用者は下記のコマンドで会員の公開鍵を登録します。

```
USAGE
  $ profile-registry account:register-key -k <value> --id <value>

FLAGS
  -k, --key=<value>  (required) JWK 公開鍵ファイル
  --id=<value>       (required) 会員 (UUID)

DESCRIPTION
  公開鍵の登録
```

詳細は[操作説明書](./operation.md)と[Profile Registry ソースコード](https://github.com/webdino/profile/blob/main/apps/registry#readme)を参照してください。
-->

## Document Profile レジストリへの Signed Originator Profile の登録

Originator Profile レジストリ運用者から受け取った Signed Originator Profile を Document Profile Registry に登録します。

<!-- TODO: 登録コマンド未実装

```
bin/dev account:register-op
```

詳細は [Profile Registry ソースコード](https://github.com/webdino/profile/blob/main/apps/registry#readme)を参照してください。
-->

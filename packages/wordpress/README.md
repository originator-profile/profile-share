# WordPress Profile Plugin

WordPress での記事の公開時の Signed Document Profile の発行に役立つプラグイン

## Plugin Installation

1. [Releases](https://github.com/originator-profile/profile-share/releases) > Assets > WordPressプラグインのダウンロード (ファイル名: wordpress-profile-plugin.zip)
2. [プラグインのアップロード](https://ja.wordpress.org/support/article/plugins-add-new-screen/#%e3%83%97%e3%83%a9%e3%82%b0%e3%82%a4%e3%83%b3%e3%81%ae%e3%82%a2%e3%83%83%e3%83%97%e3%83%ad%e3%83%bc%e3%83%89)

## ディレクトリ構成

{WordPress directory}/wp-content/credentials/
: 署名用プライベート鍵ファイルの配置場所 (デフォルト)

### config.php

`includes` ディレクトリの中に置かれている `config.php` ファイルには、このプラグインの設定値が含まれています。

#### PROFILE_PRIVATE_KEY_FILENAME

署名に使うプライベート鍵ファイルのパスです。
もし仮にプライベート鍵が存在しない場合、プラグインを有効化した際に自動的に生成されます。

#### PROFILE_DEFAULT_PROFILE_REGISTRY_SERVER_HOSTNAME

DP レジストリサーバーのホスト名の設定の初期値です。
このホスト名のエンドポイントを介して Signed Document Profile の登録と取得を行います。
もし設定画面から DP レジストリサーバーのホスト名の設定を変更した場合、この値は参照されません。

#### PROFILE_VERIFICATION_TYPE

検証する対象の型です。現在、対象の要素の子孫のテキストへの署名を表す `text` 型のみサポートしています。

#### PROFILE_VERIFICATION_LOCATION

検証する対象の要素の場所を特定するための CSS セレクターです。
このプラグインは、投稿の各ページの内容から子要素の Node: textContent プロパティを結合した結果のテキストを対象として署名を行います。

## 開発ガイド

開発用 WordPress サーバーを利用して動作を確認できます。
Docker を利用し、ローカル環境に開発用の WordPress サーバーを構築します。

開発環境の構築

```
$ cd packages/wordpress
$ cp .env.development .env
$ docker compose up -d
$ WORDPRESS_ADMIN_USER=tester WORDPRESS_ADMIN_PASSWORD=$(openssl rand -hex 16 | tee /dev/stderr) e2e/docker-setup.sh
: http://localhost:9000 にアクセスし、下記の認証情報でログインできます。
:   Username: tester
:   Password: {上のコマンドの実行時に表示された32文字の16進数文字列}
```

コマンドの詳細は下記の通りです。

.env ファイルの配置

```
$ cp .env.development .env
```

開発用サーバーの起動

```
$ docker compose up -d
: http://localhost:9000 にアクセス
```

開発用サーバーの終了

```
$ docker compose down
```

Composer 依存関係の解決

```
$ docker compose run --rm -w /var/www/html/wp-content/plugins/profile wordpress composer install
```

Composer スクリプトの実行

```
$ docker compose run --rm -w /var/www/html/wp-content/plugins/profile wordpress composer run
```

## Composer スクリプト

help
: このテキストの表示

test
: テスト

lint
: 静的コード解析

format
: コード整形

## npm scripts

e2e
: E2E テスト

## 環境変数

WORDPRESS_IMAGE
: WordPress コンテナイメージ (デフォルト: `wordpress`)

WORDPRESS_IMAGE_DOCKERFILE
: WordPress コンテナイメージの Dockerfile (デフォルト: 無効)

WORDPRESS_DEBUG=1
: `WP_DEBUG` 有効化 (デフォルト: 無効)

WORDPRESS_USER
: 実行時のユーザー (デフォルト: `www-data`)

WORDPRESS_DB_PASSWORD
: データベースの初期パスワード

WORDPRESS_DB_ROOT_PASSWORD
: データベースの root ユーザーの初期パスワード

## パッケージング

プラグインをパッケージングします:

```
$ docker build --output=dist .
```

デプロイするには「[リリース方法](https://docs.originator-profile.org/release/)」を参照してください。

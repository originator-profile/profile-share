# WordPress Profile Plugin

WordPress での記事の公開時の Signed Document Profile の発行に役立つプラグイン

## Plugin Installation

1. ダウンロード
2. [プラグインのアップロード](https://ja.wordpress.org/support/article/plugins-add-new-screen/#%e3%83%97%e3%83%a9%e3%82%b0%e3%82%a4%e3%83%b3%e3%81%ae%e3%82%a2%e3%83%83%e3%83%97%e3%83%ad%e3%83%bc%e3%83%89)

## ディレクトリ構成

{WordPress directory}/wp-content/credentials/
: 署名用プライベート鍵ファイルの配置場所

## 開発ガイド

```
cd packages/wordpress
```

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
$ docker compose exec -w /var/www/html/wp-content/plugins/profile wordpress composer install
```

Composer スクリプトの実行

```
$ docker compose exec -w /var/www/html/wp-content/plugins/profile wordpress composer run
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

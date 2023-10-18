---
sidebar_position: 2
---

# 開発ガイド

本書はローカル環境で実行するための手順を説明します。

## はじめに

1. Linux, macOS または Windows ([WSL2](https://docs.microsoft.com/ja-jp/windows/wsl/install)) 環境を用意
2. [Google Chrome](https://support.google.com/chrome/answer/95346)のインストール
   - WSL2 使用の場合、ホスト側ではなく [WSL 側に Chrome をインストール](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps#install-google-chrome-for-linux)する必要があります
   - WSL2 で Google Chrome 使用時、バージョンにより GUI 環境を用意する必要があるのであらかじめ`wsl --update`しておくこと
3. [Node.js](https://nodejs.org/) のインストール
4. [Docker](https://www.docker.com/get-started) と [Compose v2](https://docs.docker.com/compose/cli-command/) のインストール
   - Windows では[WSL 2 での Docker リモート コンテナーの概要 \| Microsoft Docs](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/wsl-containers)も参照してください
5. 下記のコマンドをターミナルで実行

```sh
git clone https://github.com/originator-profile/profile-share profile
cd profile
corepack enable yarn
yarn install
yarn playwright install --with-deps
# profile-registry CLIのインストール
npm i -g ./apps/registry
# 開発用サーバーの起動
yarn dev
# WSL2 使用の場合、ホスト側ではなく WSL 側の Chrome を使用します
CHROME_PATH=/usr/bin/google-chrome yarn dev
# => 開発用サーバーとWebブラウザーが起動します (<Ctrl-C>: 終了)
```

あとはそれぞれのソースコードを編集することで開発を行うことができます。自由にカスタマイズしましょう。

## 全体構成

- apps/ … アプリケーションのソースコード
  - registry … [Profile Registry](registry/README.md)
  - web-ext … [Profile Web Extension](web-ext/README.md)
- docs/ … ドキュメント
- packages/ … アプリケーションの使用するモジュールのソースコード
  - model … システムのコアとなる静的構造のためのパッケージ
  - core … システムのコアとなる関数のためのパッケージ
- package.json … プロジェクトの付帯情報 ([package.json](https://docs.npmjs.com/files/package.json/))
- .github/workflows/ … GitHub Actions のワークフローの定義

## Swagger UI

開発用サーバーの起動後、<http://localhost:8080/documentation/static/index.html> にアクセスすることでAPIの詳細の閲覧とサーバーへのリクエストの試行を行えます。

### 認証

Step1. Authorize -> bearerAuth (OAuth2, authorization_code with PKCE) -> [Authorize] を選択

Step2. ログイン (またはサインアップ)

## 便利なコマンド

テストやビルドの実行など開発に便利なコマンドを紹介します。

### `yarn lint`

すべてのパッケージの静的コード解析を行います。

### `yarn test`

すべてのパッケージのテストを行います。

### `yarn e2e`

開発用サーバーを起動し E2E テストを行います。ただし、実行するにはあらかじめ Composer 依存関係の解決する必要があります。

#### Composer 依存関係の解決

```
cd packages/wordpress
docker compose run --rm -w /var/www/html/wp-content/plugins/profile wordpress composer install
```

### `yarn build`

拡張機能の生成などすべてのパッケージのビルドを行います。

### `yarn format`

コードの整形を行います。

## Docker

### minio

ローカルでの開発では、 S3 互換ストレージとして minio を利用しています（試験運用環境、本番環境では R2 を利用）。

次のような手順で minio へのファイルアップロードを試すことができます。

#### ファイルアップロードのテスト (minio)

Step1.

[aws-cli](https://github.com/aws/aws-cli)をインストールする。例として、Ubuntu(WSL含む)の場合`apt install awscli`, macOSの場合`brew install awscli`

Step2.

apps/registry/.env.development の S3_ACCOUNT_LOGO_BUCKET_NAME の値を覚えておきます。このバケットにファイルをアップロードします。以下ではこの値が oprdev-account-logos だとします。

Step2.

```
$ yarn dev
```

Step3.

```console
$ cat << EOF > test-file
test file
EOF
$ AWS_ACCESS_KEY_ID=root AWS_SECRET_ACCESS_KEY=kHslkqy4n2hMDvQabcwkOl_NCqdX1M2QEX_XjGe807o aws --endpoint-url http://localhost:19000 s3 cp test-file s3://oprdev-account-logos/
$ AWS_ACCESS_KEY_ID=root AWS_SECRET_ACCESS_KEY=kHslkqy4n2hMDvQabcwkOl_NCqdX1M2QEX_XjGe807o aws --endpoint-url http://localhost:19000 s3 ls s3://oprdev-account-logos/
2023-09-04 13:26:06         10 test-file
```

Step4.

http://localhost:19001/ にブラウザして確認。`Username`として`root`、`Password`として`kHslkqy4n2hMDvQabcwkOl_NCqdX1M2QEX_XjGe807o`を入力しログインすること

## GitHub Actions

GitHub リポジトリ上での変更は自動的にチェックされます。

### originator-profile/profile/test

パッケージの生成、コードの整形、静的コード解析、E2E テストを含むすべてのテストを実施します。

### E2E テストのレポート

GitHub Actions での E2E テストに失敗すると playwright によるレポートおよびスナップショット画像が artifacts としてアップロードされます。Zip ファイルを展開することで得られるレポートディレクトリ`playwright-report`を以下のように使用することで、失敗の原因を知ることができるかもしれません。

```
npx playwright show-report path-to/playwright-report
```

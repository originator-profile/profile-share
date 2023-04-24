---
sidebar_position: 2
---

# 開発ガイド

本書はローカル環境で実行するための手順を説明します。

## はじめに

1. Linux, macOS または Windows ([WSL2](https://docs.microsoft.com/ja-jp/windows/wsl/install)) 環境を用意
2. [Google Chrome](https://support.google.com/chrome/answer/95346)のインストール
   - WSL2 使用の場合、ホスト側ではなく [WSL 側に Chrome をインストール](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps#install-google-chrome-for-linux)する必要があります
3. [Node.js](https://nodejs.org/) のインストール
4. [Docker](https://www.docker.com/get-started) と [Compose v2](https://docs.docker.com/compose/cli-command/) のインストール
   - Windows では[WSL 2 での Docker リモート コンテナーの概要 \| Microsoft Docs](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/wsl-containers)も参照してください
5. 下記のコマンドをターミナルで実行

```sh
git clone https://github.com/webdino/profile
cd profile
corepack enable yarn
yarn install
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
- .circleci/config.yml … CI 環境の設定ファイル ([CircleCI の設定](https://circleci.com/docs/ja/configuration-reference))

## 便利なコマンド

テストやビルドの実行など開発に便利なコマンドを紹介します。

### `yarn lint`

すべてのパッケージの静的コード解析を行います。

### `yarn test`

すべてのパッケージのテストを行います。

### `yarn e2e`

開発用サーバーを起動し E2E テストを行います。

### `yarn build`

拡張機能の生成などすべてのパッケージのビルドを行います。

### `yarn format`

コードの整形を行います。

## 便利な CI ワークフロー

[GitHub Checks が有効化されており](https://circleci.com/docs/ja/enable-checks)、GitHub リポジトリ上で各コミットに対する CI の結果を確認することができます。 CI で実行している便利な CI ワークフローを紹介します。

### test

`yarn lint` `yarn test` `yarn build` `yarn e2e` を行います。

### format

`yarn format` を行います。

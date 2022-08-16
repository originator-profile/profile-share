# 開発ガイド

本書はローカル環境で実行するための手順を説明します。

## はじめに

1. Linux または macOS 環境を用意
2. [Node.js](https://nodejs.org/) のインストール
3. [Docker](https://www.docker.com/get-started) と [Compose v2](https://docs.docker.com/compose/cli-command/) のインストール
4. 下記のコマンドをターミナルで実行

```sh
git clone https://github.com/webdino/profile
cd profile
corepack enable yarn
yarn install
yarn dev &
# => 開発用サーバーが起動します (fg<Enter> + <Ctrl-C>: 開発用サーバーの終了)
yarn --cwd apps/web-ext start:chromium --url=http://localhost:8080
# => Webブラウザーが起動します
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

## 後付

### Windows 環境での開発

1. WSL のインストール ([WSL のインストール \| Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/wsl/install))
2. Chromium のインストール ([WSL で Linux GUI アプリを実行する \| Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps)
   )
3. 以降「はじめに」を参照

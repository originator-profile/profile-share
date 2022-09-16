# Profile Web Extension

Web ブラウザーで Originator Profile と Document Profile の閲覧と検証を行うアプリです。

## 使い方

### ローカルの Profile Registry で動作確認

1. プロジェクトのルートディレクトリに移動します。
2. `yarn dev` でローカルの Profile Registry の起動と拡張機能の差分ビルドをプレビューします。

### デモの Profile Registry で動作確認

`yarn dev --issuer=https://oprdev.herokuapp.com --url=https://oprdev.herokuapp.com` で拡張機能の差分ビルドをプレビューします。

## 環境変数

- `PROFILE_ISSUER`: プロファイルを発行しているレジストリ。プロファイルの署名検証時に使用する公開鍵の参照先の URL オリジン。
  - `yarn dev` 時のデフォルト値: `"http://localhost:8080"`
  - `yarn build` 時のデフォルト値: `"https://oprdev.herokuapp.com"`

## npm スクリプト

- `yarn build`: 拡張機能をビルドしたのち、パッケージングします。
- `yarn build:esbuild`: `dist` を出力先として、拡張機能を esbuild でビルドします。
- `yarn build:web-ext`: `dist` をソースとして、拡張機能を[パッケージング](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#packaging-your-extension)します。
- `yarn lint`: コードリントします。
- `yarn lint:fix`: fixable なリントエラーを修正します。
- `yarn dev`: `dist` を出力先として、拡張機能を esbuild で差分ビルドしてブラウザーでプレビューします。
  - `-t, --target`: 拡張機能をプレビューする対象のランタイムを指定します。
  - `-u, --url`: プレビュー開始時に表示される URL を指定します。
  - `-i, --issuer`: 環境変数 `PROFILE_ISSUER` と同じです。
- `yarn test`: ユニットテストします。

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

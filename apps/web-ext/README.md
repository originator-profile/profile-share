# Profile Web Extension

Web ブラウザーで Originator Profile の閲覧と検証を行うアプリです。

## 使い方

### ローカルの Profile Registry で動作確認

1. ルートディレクトリに移動します。
2. `yarn dev` でローカルの Profile Registry の起動と拡張機能の差分ビルドを生成します。
3. 異なるターミナルセッションで `yarn start:chromium --url=http://localhost:8080` で拡張機能を Chromium でプレビューします。

### デモの Profile Registry で動作確認

1. `yarn dev` で拡張機能の差分ビルドを生成します。
2. 異なるターミナルセッションで `yarn start:chromium --url=https://oprdev.herokuapp.com` で拡張機能を Chromium でプレビューします。

## npm スクリプト

- `yarn build`: 拡張機能をビルドしたのち、パッケージングします。
- `yarn build:esbuild`: `dist` を出力先として、拡張機能を esbuild でビルドします。
- `yarn build:web-ext`: `dist` をソースとして、拡張機能を[パッケージング](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#packaging-your-extension)します。
- `yarn dev`: `dist` を出力先として、拡張機能を esbuild で差分ビルドします。
- `yarn lint`: コードリントします。
- `yarn lint:fix`: fixable なリントエラーを修正します。
- `yarn start:firefox`: `dist` をソースとして、 Firefox で拡張機能をプレビューします。
- `yarn start:chromium`: `dist` をソースとして、 Chromium で拡張機能をプレビューします。
- `yarn test`: ユニットテストします。

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

## 商標

JICDAQ およびそのロゴは、一般社団法人デジタル広告品質認証機構の商標または登録商標です。

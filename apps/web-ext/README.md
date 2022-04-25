# Profile Web Extension

Web ブラウザーで Originator Profile の閲覧と検証を行うアプリです。

## 使い方

- `yarn build`: 拡張機能をビルドしたのちパッケージングします
- `yarn build:esbuild`: `dist` を出力先として拡張機能を esbuild でビルドします
- `yarn build:web-ext`: `dist` をソースとして拡張機能を[パッケージング](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#packaging-your-extension)します
- `yarn dev`: `dist` を出力先として拡張機能を esbuild で差分ビルドします
- `yarn lint`: コードリントします
- `yarn lint:fix`: fixable なリントエラーを修正します
- `yarn start:firefox`: `dist` をソースとして Firefox で拡張機能をプレビューします
- `yarn start:chromium`: `dist` をソースとして Chromium で拡張機能をプレビューします
- `yarn test`: ユニットテストします

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

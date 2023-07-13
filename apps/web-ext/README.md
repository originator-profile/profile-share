# Profile Web Extension

Web ブラウザーで Originator Profile と Document Profile の閲覧と検証を行うアプリです。

## 使い方

Step 1
: ダウンロード

[GitHub Releases](https://github.com/originator-profile/profile/releases/latest) から最新版をダウンロードします。

Step 2
: インストール

1. ZIP ファイルを展開します。
2. chrome://extensions にアクセスします。
3. デベロッパーモードを有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選択します。
5. ZIP ファイルから展開されたディレクトリを選択します。

Step 3
: Web ページにアクセス

例えば、https://originator-profile.org/ja-JP/ など、拡張機能の対応している Web ページにアクセスします。

Step 4
: コンテンツ情報の閲覧と検証

拡張機能をクリックすることで、現在閲覧中の Web ページに関するコンテンツ情報の閲覧と検証ができます。

## 動作確認

次のコマンドをターミナルで実行し、拡張機能をプレビューします。

```
$ yarn dev --issuer=oprexpt.originator-profile.org --url=https://oprexpt.originator-profile.org/
```

### ローカル環境での動作確認

1. プロジェクトのルートディレクトリに移動します。
2. `yarn dev` コマンドを実行し、ローカル環境で拡張機能をプレビューします。
   - http://localhost:8080/ にアクセスし、ローカル環境の開発用サーバー http://localhost:8080/ での動作を確認できます。

## 環境変数

- `PROFILE_ISSUER`: プロファイルを発行しているレジストリ。プロファイルの署名検証時に使用する公開鍵の参照先のドメイン名。
  - `yarn dev` 時のデフォルト値: `localhost`
  - `yarn build` 時のデフォルト値: `oprexpt.originator-profile.org`

## npm スクリプト

- `yarn build`: 拡張機能をビルドしたのち、パッケージングします。
- `yarn build:esbuild`: `dist` を出力先として、拡張機能を esbuild でビルドします。
- `yarn build:web-ext`: `dist` をソースとして、拡張機能を[パッケージング](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#packaging-your-extension)します。
- `yarn dev`: `dist` を出力先として、拡張機能を esbuild で差分ビルドしてブラウザーでプレビューします。
  - `-t, --target`: 拡張機能をプレビューする対象のランタイムを指定します。
  - `-u, --url`: プレビュー開始時に表示される URL を指定します。
  - `-i, --issuer`: 環境変数 `PROFILE_ISSUER` と同じです。
- `yarn lint`: コードリントと fixable なリントエラーを修正します。
- `yarn test`: ユニットテストします。

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

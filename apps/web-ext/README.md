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
$ pnpm dev --registry-url=https://oprexpt.originator-profile.org/ --url=https://originator-profile.org/
```

### ローカル環境での動作確認

1. プロジェクトのルートディレクトリに移動します。
2. `pnpm dev` コマンドを実行し、ローカル環境でChrome用拡張機能をプレビューします。
   - http://localhost:8080/app/debugger にアクセスし、ローカル環境の開発用サーバーでの動作を確認できます。

## 環境変数

- `PROFILE_REGISTRY_URL`: Originator Profile を発行しているレジストリ URL。Originator Profile の署名検証時に JWT VC Issuer Metadata を参照します。
  - `pnpm dev` 時のデフォルト値: `localhost`
  - `pnpm build` 時のデフォルト値: `oprexpt.originator-profile.org`

## npm スクリプト

- `pnpm build`: 拡張機能をビルドしたのち、パッケージングします。
- `pnpm build:chromium` `pnpm build:firefox`: 拡張機能をビルドしパッケージングします。
  - `-t, --target`: 対象のランタイムを指定します。ランタイムを変更すると出力先も変更されます。
  - `-r, --registry-url`: 環境変数 `PROFILE_REGISTRY_URL` と同じです。
- `pnpm dev`: 拡張機能をブラウザーでプレビューします。
  - `-t, --target`: プレビューする対象のランタイムを指定します。
  - `-u, --url`: プレビュー開始時に表示される URL を指定します。
  - `-r, --registry-url`: 環境変数 `PROFILE_REGISTRY_URL` と同じです。
- `pnpm lint`: コードリントと fixable なリントエラーを修正します。
- `pnpm test`: ユニットテストを実行します。
- `pnpm e2e`: Chrome用拡張機能のe2eテストを実行します。`pnpm dev`で拡張機能をビルドした状態で実行してください。

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

# Profile Web Extension

Web ブラウザーで Originator Profile と Content Attestation の閲覧と検証を行うアプリです。

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

- `PROFILE_ISSUER`: プロファイルを発行しているレジストリ。プロファイルの署名検証時に使用する公開鍵の参照先のドメイン名。
  - `pnpm dev` 時のデフォルト値: `localhost`
  - `pnpm build` 時のデフォルト値: `oprexpt.originator-profile.org`
- `PROFILE_REGISTRY_URL`: Originator Profile を発行しているレジストリ URL。Originator Profile の署名検証時に JWT VC Issuer Metadata を参照します。
  - `pnpm dev` 時のデフォルト値: `http://localhost:8080/`
  - `pnpm build` 時のデフォルト値: `https://oprexpt.originator-profile.org/`
- `BASIC_AUTH`: レジストリ API の Basic 認証 (形式: `true` or `false`)
- `BASIC_AUTH_USERNAME`: 開発用レジストリ API の Basic 認証のユーザー名
- `BASIC_AUTH_PASSWORD`: 開発用レジストリ API の Basic 認証のパスワード
- `REGISTRY_OPS`: 検証に使用する Originator Profile Set

## 認証情報

拡張機能をビルドする際、`credentials.json` JSON ファイルがあれば、その内容に基づいて拡張機能に認証情報を同梱し、Basic 認証に使用します。JSON ファイルは次の形式です。

```jsonc
[
  {
    // Basic 認証の対象とするドメイン
    "domain": "example.com",
    // ユーザー名
    "username": "alice",
    // パスワード
    "password" "password"
  },
  // ...
]
```

## Originator ProfileレジストリのOPを同梱する

拡張機能をビルドする際、環境変数 `REGISTRY_OPS` があれば、その内容をレジストリのOPとして同梱し、検証に使用します。

形式:

```jsonc
[
  {
    "core": "eyJ...",
    "annotations": ["eyJ..."], // Optional の項目のため含めなくてもよい
    "media": "eyJ...", // Optional の項目のため含めなくてもよい
  },
]
```

実行例:

```
$ REGISTRY_OPS=$(cat registry-ops.json) pnpm build
```

## npm スクリプト

- `pnpm build`: 拡張機能をビルドしたのち、パッケージングします。
- `pnpm build:chromium` `pnpm build:firefox`: 拡張機能をビルドしパッケージングします。
  - `-t, --target`: 対象のランタイムを指定します。ランタイムを変更すると出力先も変更されます。
  - `-i, --issuer`: 環境変数 `PROFILE_ISSUER` と同じです。
  - `-r, --registry-url`: 環境変数 `PROFILE_REGISTRY_URL` と同じです。
- `pnpm dev`: 拡張機能をブラウザーでプレビューします。
  - `-t, --target`: プレビューする対象のランタイムを指定します。
  - `-u, --url`: プレビュー開始時に表示される URL を指定します。
  - `-i, --issuer`: 環境変数 `PROFILE_ISSUER` と同じです。
  - `-r, --registry-url`: 環境変数 `PROFILE_REGISTRY_URL` と同じです。
- `pnpm lint`: コードリントと fixable なリントエラーを修正します。
- `pnpm test`: ユニットテストを実行します。
- `pnpm e2e`: Chrome用拡張機能のe2eテストを実行します。`pnpm dev`で拡張機能をビルドした状態で実行してください。

## ドキュメント

[ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions)

# 拡張機能の実験的利用

## ビルド

ルートディレクトリで `yarn && yarn build` を実行すると `apps/web-ext/web-ext-artifacts/profile_web_extension-1.0.0.zip` のような ZIP ファイル
が生成されます。

## 配布

生成された ZIP ファイルを配布してください。

## インストール

### Chrome

1. ZIP ファイルを展開します。
2. chrome://extensions にアクセスします。
3. デベロッパーモードを有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選択します。
5. ZIP ファイルから展開されたディレクトリを選択します。

## 利用

1. https://oprdev.originator-profile.org にアクセスします。
2. 拡張機能を起動します。

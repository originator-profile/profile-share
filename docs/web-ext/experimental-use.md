---
sidebar_position: 1
---

# 拡張機能の実験的利用

## 対象読者

- 実験参加者

## 前提条件

GitHubリポジトリへのアクセス権限が必要です:

- https://github.com/originator-profile/profile-share

## 利用手順

1. ダウンロード
1. インストール
1. Webページにアクセス

## ダウンロード

[GitHub Releases](https://github.com/originator-profile/profile-share/releases/latest) から最新版の拡張機能のzipファイルをダウンロードします。

## インストール

### Google Chrome

1. zip ファイルを展開
2. `chrome://extensions` にアクセス
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」を選択
5. zip ファイルを展開して得られた manifest.json の含まれるディレクトリを選択

参考文献:

- [パッケージ化されていない拡張機能を読み込む](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ja#load-unpacked)

### Firefox

Firefox の場合:

1. `about:debugging` にアクセス
1. 「この Firefox」> 「一時的なアドオンを読み込む…」を選択
1. 拡張機能の zip ファイルを選択

ここでインストールされたアドオンは Firefox を再起動するまで有効です。

参考文献:

- [初めての拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

## Firefoxでの初期設定手順 {#setup-in-firefox}

![](./assets/setup-in-firefox.png)

アドオンをインストールした後、以下の手順でサイトへのアクセス権限を有効にします。

1. メニューバーにあるアドオンのアイコンを右クリックします。
2. 「拡張機能を管理」を選択します。
3. 「権限」タブを選択します。
4. 「追加機能の任意の権限」欄に列挙されているアクセス権限を無効から有効に変更します。

## Web ページにアクセス

例えば、[Originator Profile 技術研究組合 (OP CIP) 公式サイト](https://originator-profile.org/)など、対応しているWebページにアクセスします。

インストール後、拡張機能のアイコンをクリックすることで、Web ページに関する情報を確認します。

対象となるページを既に開いている場合は再読み込みするか新しく開き直します。

右上の拡張機能ボタンから Profile Web Extension を選択します。

![利用法の確認1](assets/how_to_use_ext01.png)

ウィンドウが開き、認証の有無や各種情報を確認できます。

![利用法の確認2](assets/how_to_use_ext02.png)

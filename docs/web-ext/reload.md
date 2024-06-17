---
sidebar_position: 7
---

# 拡張機能の再読み込み

## 対象読者

- 実験参加者

## 前提条件

- [拡張機能のインストール](./experimental-use.mdx#install)

## 拡張機能を再読み込みする手順

1. ダウンロード
1. 拡張機能の再読み込み
1. Webページにアクセス

## ダウンロード

[GitHub Releases](https://github.com/originator-profile/profile-share/releases/latest) から最新版をダウンロードします。

## 拡張機能の再読み込み

### Google Chrome

1. 拡張機能の zip ファイル展開先を最新版に差し換え
1. ブラウザの「拡張機能を管理」画面にアクセス
1. 「[拡張機能を再読み込み](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ja#reload)」: オン/オフの切り替えボタンの左横にある更新アイコンをクリック

### Firefox

Firefox の場合:

1. `about:debugging` にアクセス
1. 「この Firefox」> 「一時的なアドオンを読み込む…」を選択
1. 最新版の拡張機能の zip ファイルを選択

参考文献:

- [初めての拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

## Webページにアクセス

インストール後、拡張機能のアイコンをクリックすることで、Web ページに関する情報を確認します。

対象となるページを既に開いている場合は再読み込みするか新しく開き直します。

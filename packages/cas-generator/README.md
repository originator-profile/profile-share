# CAS Generator for OPCIP website

[OP CIPサイト](https://originator-profile.org) の各ページや各コンテンツを対象とした CA ファイルを自動生成するジェネレータです。
管理者のローカル環境での使用を前提とし、 [CA の作成](https://docs.originator-profile.org/studies/general-instruction/cas-setup-guide/#%E5%88%A5%E3%81%AE%E6%96%B9%E6%B3%95-cli-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95) を自動化することを目的としています。

<img width="800" alt="スクリーンショット" src="https://github.com/user-attachments/assets/0a995f7d-b168-4d76-936e-eda4c8e15298" />

**現時点ではまだ開発途上中です、品質については不充分な点があることをご了承ください**

以下のような制約のもとで運用されています。

- 現在、[OP CIP サイト](https://originator-profile.org/)の構成のみに対し、動作します
- `pnpm build` された HTML ファイル内に存在する CSS セレクタ `article [itemprop='headline'], article [itemprop='articleBody']` に対応する要素を target として CA を生成します（特定のHTMLファイルの除外機能はありません）
- HTML ドキュメント内の、ある特定のコンテンツを target として CA に含みたい場合においては、現在 img 要素のみを対象としており、 `class="target-integrity"` を img 要素に付与することで、CA target integrity に追加されます
- 手元の鍵パスや HTML の出力先、CAS ファイルの出力先などのファイルパスの指定を、.env.local ファイルで行ないます、現時点ではこの指定ができる UI は実装されていません
- エラーにおける処理やログ表示については、現在不充分です
- コードの品質チェックは充分におこなっておらず、注意してご使用ください

## Profile Registry CLI の導入

お手元の環境での作業を前提としています。[registry のリポジトリ](https://github.com/originator-profile/profile-share/tree/main/apps/registry)をご覧ください。

## ファイルパスの指定

`.env.example` を参考に、ご自身のローカルファイルパスを指定して、 `.env.local` ファイルを作成、保存してください。

## インストール

依存関係にあるパッケージのインストールを行います。

```bash
# pnpm
pnpm install
```

## ローカルでの起動

[port 3000 は他の開発用サーバーで使用しているため](https://github.com/originator-profile/profile/pull/2003#discussion_r1990418949) 4000 で起動します。
もしも他のポートで起動したい場合、[公式ドキュメント](https://nuxt.com/docs/api/nuxt-config#port)に従い変更してください。

`http://localhost:4000` で起動します。

```bash
# pnpm
pnpm dev
```

## CAS ファイルを生成

アプリケーションが起動したら自動的に、各HTMLファイルの情報を抽出した JSON ファイルが作成されます。
「生成開始」ボタンを押すと、 ハッシュ化された"eyJ”から始まる文字列が含まれたファイルが生成され、これが実際に公開用 CAS となります。

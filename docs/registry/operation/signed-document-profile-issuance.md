---
sidebar_position: 8
---

# Signed Document Profile 発行

本ページでは[Signed Document Profile（SDP）](/spec/#signed-document-profile)を発行して自身の組織の出版物を表明する方法を説明します。

あらかじめ次の作業を完了している必要があります。

- [組織情報の提出](./org-info-submission.md)
- OP レジストリ管理者による[会員の作成](./account-creation.md)
- [公開鍵の登録](./public-key-registration.md)
- OP レジストリ管理者による[Signed Originator Profile 発行](./signed-originator-profile-issuance.md)

表明可能な出版物は、現状単一の Web ページのみ対応しています。単一の Web ページの Web ページの情報は JSON ファイルに記載します。

## website.json の例

[website.example.json](https://github.com/webdino/profile/blob/main/apps/registry/website.example.json) を参考に作成してください。

### 読売新聞社の記事登録の例

読売新聞社の記事である場合、以下のようになるでしょう。

```json
{
  "url": "https://yomiuri.demosites.pages.dev/1",
  "location": "[itemprop=articleBody]",
  "bodyFormat": "text",
  "body": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "title": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "description": "https://yomiuri.demosites.pages.dev/1 の備考",
  "author": "前木 理一郎",
  "editor": "デジタル編集部",
  "categories": [{ "cat": "IAB17-2" }]
}
```

「読売新聞社」は、株式会社読売新聞東京本社の登録商標です。

組織 id が仮に `example.com` であることを前提に、実際の Web ページに対して Signed Document Profile を発行する例を見てみましょう。

--input は先程作成した`website.json`ファイル名です。

CLI のオプションについては、[apps/registry/README.md](https://github.com/webdino/profile/tree/main/apps/registry) を参照してください。

```console
profile-registry publisher:website \
  -i holder-key.pem \
  --id example.com \
  --input website.json \
  -o create
```

発行された Signed Document Profile は、Prisma Studio で確認できます。Prisma Studio を起動し、組織のレコードを横スクロールすると `issuedDps` が見えてきますが、そこに `1 dps`を表示されることが確認できます。

<img alt="Signed Document Profile が作成された" width="1082" alt="image" src="https://user-images.githubusercontent.com/281424/193495340-acc186d4-139b-407c-bc0a-be7e6b5496cd.png" />

### 情報カテゴリーについて

`website.json`の項目`categories`に[IAB Tech Lab Content Category Taxonomy 1.0](https://iabtechlab.com/wp-content/uploads/2023/03/Content-Taxonomy-1.0-1.xlsx)にもとづく文字列を記載することで、対象となる Web ページの情報カテゴリーを表すことが可能です。

前節`website.json`における`[{ "cat": "IAB17-2" }]`は`Baseball`を意味し、Web ページが野球に関するものであることを示しています。Web ページが複数カテゴリーの情報を扱っている場合は`[{ "cat": "IAB17-2" }, { "cat": "IAB17-3" }]`のようにカテゴリーを列挙できます。

:::note
カテゴリー名として使用する文字列については上記[IAB Tech Lab Content Category Taxonomy 1.0](https://iabtechlab.com/wp-content/uploads/2023/03/Content-Taxonomy-1.0-1.xlsx)または[category.example.json](https://github.com/webdino/profile/blob/main/apps/registry/category.example.json)を参照してください。Web ページの情報カテゴリーは`profile-registry`コマンドでは削除できないので注意してください。
:::

## 公開する Web サイトに Profile Set を紐付ける

最後にデプロイ用 Profile Set の作成を行います。
公開するサイトに配置する際には、トップディレクトリの .well-known に以下のファイルを配置します。

- ps.json

または、HTML 中に Profile Set への <link\> 要素を追加しても構いません。

### ps.json

Prisma Studio の画面上部のタブで、`ops`と`dps`それぞれ画面の中に、`jwt`列があります、その値をコピーして以下に貼り付けてください。

![jwtの値をコピーする](https://user-images.githubusercontent.com/281424/193496060-657ecdc7-23d0-47d8-b8c7-8d7b85136774.jpg)

画面は`ops`を見ていますが `dps` でも同様の作業を行います。

profile には `ops` と `dps` が混在しているように見えますが、 特に`dps`は、一つの組織に対し、複数の Web ページを持つことが考えられるので、配列といていくつも dps の jwt 値を登録していくことになります。

```jsonc
{
  "@context": "https://originator-profile.org/context.jsonld",
  "main": ["https://examples.demosites.pages.dev"],
  "profile": [
    // <- 発行した Signed Originator Profile の値 ops - jwt の値
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
    // <- 発行した Signed Document Profile の値 dps - jwt の値
    "eaXQbGciOiJFUzI1NiaXQiOlsiY6IkpXVCaX..."
  ]
}
```

詳細は [<link\> 要素を使用する外部的な表現の仕様](/spec.md#link)を参照してください。

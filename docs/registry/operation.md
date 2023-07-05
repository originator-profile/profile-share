---
sidebar_position: 2
---

# 操作説明書

## 役割

Web サイトに Originator Profile を導入するために様々な役割を持って作業を行うことが想定されます。

![image](https://user-images.githubusercontent.com/281424/198944140-26516b92-3f3b-4b89-92be-e5f56c9bd3f8.png)

### Originator Profile （OP） の発行

企業や組織が Originator Profile レジストリ （ OP レジストリ） に対して組織の登録を行ないます。
この場合、 OP レジストリに会員登録申請をする企業担当者と、 OP レジストリ管理担当者が該当します。

1. 企業や組織が行う会員登録申請の担当者
2. 会員登録申請を受けてレジストリ登録する OP レジストリ担当者

この人の役割として

- [組織の会員登録](#組織の会員登録)
- [鍵ペアの生成](#鍵ペアの生成)
- [公開鍵の登録を行う](#公開鍵の登録を行う)
- [Signed Originator Profile を作成する](#signed-originator-profile-を作成する)

の作業が該当します。

### 第三者認証機関の OP 登録

OP レジストリに登録される会員組織として、第三者認証機関があります。レジストリには `roleValue: certifier` を持つ組織がそれにあたります。
現状では上記の OP 発行と同じ手順で OP レジストリ管理担当者に依頼します。

### Document Profile （DP） の発行

OP 発行とは別の担当者になる可能性がある DP 発行者が存在します。
これは Web サイト単位であったり、各記事ページであったり、広告や図版の一部まで（これらを総称して「コンテンツ」とします）に対し、第三者認証機関の証明などを Web ページ内に埋め込む DP を DP レジストリに登録する作業を行う立場の人です。
例えば、記事編集者や広告出稿責任者など、コンテンツ単位で発信する担当者になります。

この人の役割として

- [Signed Document Profile を作成する](#signed-document-profile-を作成する)
- [公開する Web サイトに Profile Set を紐付ける](#公開する-web-サイトに-profile-set-を紐付ける)

の作業が該当します。

## 準備

現状は前述した役割が誰であっても、このリポジトリを clone して コマンドラインで作業を行うことになります。
詳しくは[開発ガイド](/development/)を参照してください。

あらかじめ以下の環境変数を apps/registry/.env に設定します。

| 環境変数     | 内容                                           |
| ------------ | ---------------------------------------------- |
| DATABASE_URL | [PostgreSQL 接続 URL][postgres_connection_url] |

PostgreSQL 接続 URL は、 [Heroku Data][heroku_data_url] の Settings -> Administration -> Database Credentials -> URI を指定する。

[postgres_connection_url]: https://www.prisma.io/docs/reference/database-connectors/connection-urls/
[heroku_data_url]: https://data.heroku.com/

### DB の内容の参照

Prisma Studio を使用して DB の内容を参照する。

```sh
cd apps/registry
npm i -g .
profile-registry db:prisma studio --schema=../../packages/registry-db/prisma/schema.prisma
```

Prisma Studio が起動します。現在レジストリ側に登録されている OP / DP 情報が閲覧できます。

<img width="1552" alt="Prisma Studioの画面が起動した" src="https://user-images.githubusercontent.com/281424/193489958-76ffdb86-3e58-4442-a230-740402c5fcad.png" />

今回は`roleValue`の列に`certifier`と役割を担っている`oprexpt.originator-profile.org`に認証を受けるというシチュエーションを例に作業を解説します。

## Profile Set 作成手順

最初の手順には大きくこのような流れがあります。

1. [組織の会員登録](#組織の会員登録)
2. [鍵ペアの生成](#鍵ペアの生成)
3. [公開鍵の登録を行う](#公開鍵の登録を行う)
4. [Signed Originator Profile を作成する](#signed-originator-profile-を作成する)
5. [Signed Document Profile を作成する](#signed-document-profile-を作成する)
6. [公開する Web サイトに Profile Set を紐付ける](#公開する-web-サイトに-profile-set-を紐付ける)

下記のコマンドは apps/registry ディレクトリで実行する。

### 組織の会員登録

まずは組織の情報をレジストリに登録して会員登録を行います。

組織情報は JSON ファイルに記載します。 以下の JSON ファイルを確認した上で `account.json` というファイル名に複製し、内容を組織情報に入れ直してください。
保存する場所は`account.example.json`と同階層の位置でよいでしょう。必要に応じて `.gitignore` ファイルに指定してください。

[account.example.json](https://github.com/webdino/profile/blob/main/apps/registry/account.example.json)

#### トヨタ登録時の例

トヨタ自動車株式会社の組織情報を記載する場合、以下のようになるでしょう。

`account.example.json`

```jsonc
{
  "domainName": "toyota.demosites.pages.dev",
  "roleValue": "group",
  "name": "トヨタ自動車株式会社",
  "url": "https://global.toyota/",
  "description": "トヨタ自動車株式会社詳細",
  "email": null,
  "phoneNumber": "0565-28-2121",
  "postalCode": "471-8571",
  "addressCountry": "JP",
  "addressRegion": "愛知県",
  "addressLocality": "豊田市",
  "streetAddress": "トヨタ町1番地",
  "contactTitle": "FAQ・お問い合わせ",
  "contactUrl": "https://global.toyota/jp/faq",
  "privacyPolicyTitle": "プライバシー",
  "privacyPolicyUrl": "https://global.toyota/jp/sustainability/privacy",
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null,
  "logos": {
    "create": [
      {
        "url": "https://toyota.demosites.pages.dev/logos/horizontal-toyota.svg",
        "isMain": true
      }
    ]
  }
}
```

「トヨタ」は、トヨタ自動車株式会社の登録商標です。

#### コマンドで組織情報を登録

作成した`account.json`ファイルをもとに、以下のコマンドで登録を行います。
`apps/registry`にいることを確認したうえで

```console
profile-registry account -i account.json -o create
```

と実行してください。 コマンド中の`account.json`の部分は先程の JSON ファイル名なので適宜置き換えることがあるかもしれません。

Prisma Studio を確認してみてください。組織が登録されていたら成功です。

<img width="1552" alt="Prisma Studioで組織登録が完了した" src="https://user-images.githubusercontent.com/281424/193491831-9ee55ec6-965d-465b-a2c6-44d6f150f9ea.png" />

### 鍵ペアの生成

Signed Originator Profile あるいは Signed Document Profile 発行の作業を行うために、鍵ペアを取得する作業が必要になります。 以下のコマンドを実行してください。

```console
profile-registry key-gen -o <keyのファイル名>
```

`<keyのファイル名>` には出力ファイル名を指定します。例えば`key.pem`にすると

- `key.pem` （プライベート鍵）
- `key.pem.pub.json` （公開鍵）

の鍵ペアが取得できます。

### 公開鍵の登録を行う

取得した公開鍵の方を使って登録します。前回で鍵のファイル名を`holder-key.pem`とした前提で下記に例を示します。
Prisma Studio の組織情報の行の `id` 列にある値をコピーして、以下の末尾に指定します。 `id`が `daab5a08-d513-400d-aaaa-e1c1493e0421` だった場合、以下のコマンドになります。

```console
profile-registry account:register-key -k holder-key.pem.pub.json --id daab5a08-d513-400d-aaaa-e1c1493e0421
```

### Signed Originator Profile を作成する

ここで必要な情報は以下の 2 点です。

- `--holder` に指定する Signed Originator Profile の所有者となる組織の id
- `--certifier` に指定する Signed Originator Profile の発行者となる組織の id

<img width="1552" alt="Signed Originator Profile の発行" src="https://user-images.githubusercontent.com/281424/193493119-5d092c32-7437-4ebe-a453-96457f2fda72.png" />

例えば、所有者となる組織が前節で公開鍵を登録した id `daab5a08-d513-400d-aaaa-e1c1493e0421`、発行者となる組織が oprexpt.originator-profile.org の場合であれば --holder daab5a08-d513-400d-aaaa-e1c1493e0421 --certifier 9b376064-7b71-53bf-8371-dd7701411710 となります。

さらに先程取得した発行者のプライベート鍵のファイルパスも必要となります。例えばプライベート鍵のファイル名が`certifier-key.pem`だった場合、 `-i certifier-key.pem` となります。

この情報をもとに、以下のコマンドを実行します。

```console
profile-registry cert:issue \
  -i certifier-key.pem \
  --certifier 9b376064-7b71-53bf-8371-dd7701411710 \
  --holder daab5a08-d513-400d-aaaa-e1c1493e0421
```

Prisma Studio で組織の行を横スクロールすると、`issuedOps`という列があり、発行者となる組織に`1 ops`と表示されていれば成功です。
クリックすると、画面が変わり、画面下に `Open new tab` のボタンがあるのでそれを押すと、画面上部に新しいタブができます。

<img width="1549" alt="Prisma Studio画面内に OP が生成される" src="https://user-images.githubusercontent.com/281424/193494403-5b61796a-ea18-4499-b22d-596f63ad6f17.png" />

Signed Originator Profile の登録が完了しました。

もしも組織情報そのものを削除する場合、現在のところ直接 Prisma Studio を立ち上げて画面上で削除を行う必要があります。

### Signed Document Profile を作成する

あらかじめ会員登録、公開鍵の登録、Signed Originator Profile 発行を行っておく必要があります。
ここで用意するものは Web ページの情報です。

#### website.json の例

先ほど `account.json` ファイルを作成した手順と似ています。以下のサンプル用の JSON ファイルを複製して `website.json` というファイル名を作成しましょう。

[website.example.json](https://github.com/webdino/profile/blob/main/apps/registry/website.example.json)

#### 読売新聞社の記事登録の例

`website.json` に記述する内容ですが、例えば以下のようになります。 Web ページの内容に沿って書き換えてください。

```json
{
  "url": "https://yomiuri.demosites.pages.dev/1",
  "location": "[itemprop=articleBody]",
  "bodyFormat": { "connect": { "value": "text" } },
  "body": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "title": "大谷翔平、通算１０１号は１３０ｍの今季最長弾…エンゼルスファンが好捕",
  "description": "https://yomiuri.demosites.pages.dev/1 の備考",
  "author": "前木 理一郎",
  "category": "スポーツ > 野球",
  "editor": "デジタル編集部"
}
```

「読売新聞社」は、株式会社読売新聞東京本社の登録商標です。

組織 id が仮に `daab5a08-d513-400d-aaaa-e1c1493e0421` であることを前提に、実際の Web ページに対して Signed Document Profile を発行する例を見てみましょう。

--input は先程作成した`website.json`ファイル名です。

```console
profile-registry publisher:website \
  -i holder-key.pem \
  --id daab5a08-d513-400d-aaaa-e1c1493e0421 \
  --input website.json \
  -o create
```

<img alt="Signed Document Profile が作成された" width="1082" alt="image" src="https://user-images.githubusercontent.com/281424/193495340-acc186d4-139b-407c-bc0a-be7e6b5496cd.png" />

組織の行を横スクロールすると `issuedDps` が見えてきますが、そこに `1 dps`を表示されたら成功です。

オプションについては、[apps/registry/README.md](https://github.com/webdino/profile/tree/main/apps/registry) を参照してください。

### 公開する Web サイトに Profile Set を紐付ける

最後にデプロイ用 Profile Set の作成を行います。
公開するサイトに配置する際には、トップディレクトリの .well-known に以下のファイルを配置します。

- ps.json

または、HTML 中に Profile Set への <link\> 要素を追加しても構いません。

#### ps.json

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

[<link\>](/spec.md#link) 要素の追加方法についてはリンク先を参照してください。

---
sidebar_position: 9
---

# Profile Set 作成

本ページでは、自身の組織の Signed Originator Profile と Signed Document Profile を利用して [Profile Set](/spec.md#profile-set) を作成する方法を説明します。

Profile Set は JSON-LD によって表現し、拡張子 `ps.json` の JSON ファイルとして作成することができます。

ここでは、Prisma Studio からレジストリ DB を参照して Profile Set を作成します。

## ps.json

Prisma Studio の画面上部のタブで、`ops`と`dps`それぞれ画面の中に、`jwt`列があります。その値をコピーして以下に貼り付けてください。

![jwtの値をコピーする](https://user-images.githubusercontent.com/281424/193496060-657ecdc7-23d0-47d8-b8c7-8d7b85136774.jpg)

画面は`ops`を見ていますが `dps` でも同様の作業を行います。

Profile Set の profile プロパティに必要な jwt を含めていきます。詳細は [Profile Set の仕様](/spec.md#profile-set)を参照してください。

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

## 公開する Web ページに Profile Set を紐付ける

公開する Web ページに配置する際には、HTML 中に Profile Set への <link\> 要素を追加します。

詳細は [<link\> 要素を使用する外部的な表現の仕様](/spec.md#link)を参照してください。

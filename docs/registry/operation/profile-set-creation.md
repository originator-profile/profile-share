---
sidebar_position: 9
---

# Profile Set 作成

本ページでは Document Profile 管理者が自身の組織の Signed Originator Profile（SOP）と Signed Document Profile（SDP）を利用して、[Profile Set](/spec.md#profile-set) を作成する方法を説明します。

:::note

本ページの方法は都度検証をパスする SOP と SDP への更新が必要であり、推奨できません。あくまでレジストリ API を使用しない方法として仕様への理解を深める目的で参考にしてください。

Document Profile レジストリ運用時は、レジストリ API を使用して常に最新の SOP と SDP が得られる [WordPress 連携](../wordpress-integration.md)か [Web サイト連携](../website-integration.md)を検討してください。

:::

## ps.json

Profile Set は JSON-LD によって表現し、拡張子 `ps.json` の JSON ファイルとして作成することができます。

Prisma Studio からレジストリ DB を参照して Profile Set を作成します。

### Signed Originator Profile の取得

以下の手順で Prisma Studio を操作します。

1. Prisma Studio 上で publications テーブルを閲覧
2. accountId カラムが自身の組織の id と一致するレコードを検索し、op カラムから ops テーブルを閲覧
3. Profile Set に含めたい Signed Originator Profile が存在するレコードを選定し、jwt カラムの値を確認

:::tip

組織の id の UUID 形式は、ドメイン名から UUID v5 DNS 名前空間を使用して得られます。

:::

![jwtの値をコピーする](https://user-images.githubusercontent.com/281424/193496060-657ecdc7-23d0-47d8-b8c7-8d7b85136774.jpg)

### Signed Document Profile の取得

以下の手順で Prisma Studio を操作します。

1. Prisma Studio 上で publications テーブルを閲覧
2. accountId カラムが自身の組織の id と一致するレコードを検索し、dps カラムから dps テーブルを閲覧
3. Profile Set に含めたい Signed Document Profile が存在するレコードを選定し、jwt カラムの値を確認

### 作成

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

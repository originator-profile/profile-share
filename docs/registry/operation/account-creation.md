---
sidebar_position: 4
---

# 会員の作成

本ページでは Originator Profile レジストリ管理者が組織より提出を受けた組織情報をもとに、会員を作成する方法について説明します。

:::note

事前に[レジストリ DB 参照](./registry-db-access.md)ができることを確認してください。

:::

組織情報が `account.json` というファイルである場合、以下のコマンドで会員の作成を行います。

```console
profile-registry account -i account.json -o create
```

Prisma Studio から作成した会員（accounts テーブル）のレコードを閲覧することができます。

<img width="1552" alt="Prisma Studioで組織登録が完了した" src="https://user-images.githubusercontent.com/281424/193491831-9ee55ec6-965d-465b-a2c6-44d6f150f9ea.png" />

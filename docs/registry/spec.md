---
sidebar_position: 1
sidebar_label: 仕様
---

# Profile Registry 仕様

## API ドキュメント

API に関する詳細は、[API ドキュメント](assets/api.md)を参照してください。

## 署名

Originator Profile は、認証機関の報告書をもとに CLI アプリケーションによって署名し、作成します。
署名を行う際に使用するプライベート鍵はデータベースに含みません。

## データベーススキーマ

上記以外のデータベーススキーマに関する詳細は、データベーススキーマ [schema.prisma](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma) とそれをもとに自動生成された[データベーススキーマの ER 図](assets/erd.md)を参照してください。

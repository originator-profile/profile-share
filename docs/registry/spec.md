---
sidebar_position: 1
sidebar_label: 仕様
---

# Profile Registry 仕様

## API ドキュメント

API に関する詳細は、[API ドキュメント](assets/api.md)を参照してください。

## 署名

Originator Profile は、認証機関の報告書をもとに CLI アプリケーションによって署名し、作成します。
署名を行う際に使用する秘密鍵はデータベースに含みません。

## 認証機関の報告書

- JICDAQ (一般社団法人デジタル広告品質認証機関) の報告書
  - 認証日
  - 有効期限
  - 品質認証番号
  - 事業領域
  - 認証分野
  - 検証確認方法
  - グループ認証対象事業者名

候補としては上記の項目が挙がると考えますが、詳細未定です。

## データベーススキーマ

上記以外のデータベーススキーマに関する詳細は、データベーススキーマ [schema.prisma](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma) とそれをもとに自動生成された[データベーススキーマの ER 図](assets/erd.md)を参照してください。

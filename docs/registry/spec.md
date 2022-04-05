# Profile Registry 仕様

## 署名

Originator Profile は、認証機構の報告書をもとに CLI アプリケーションによって署名し、作成します。
署名を行う際に使用する秘密鍵はデータベースに含みません。

## 認証機構の報告書

_TBD_

## データベーススキーマ

上記以外のデータベーススキーマに関する詳細は、データベーススキーマ [schema.prisma](https://github.com/webdino/profile/blob/main/apps/registry/prisma/schema.prisma) とそれをもとに自動生成された[データベーススキーマの ER 図](assets/erd.md)を参照してください。

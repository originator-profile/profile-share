---
sidebar_position: 4
---

# 会員の作成

作成した`account.json`ファイルをもとに、以下のコマンドで登録を行います。
`apps/registry`にいることを確認したうえで

```console
profile-registry account -i account.json -o create
```

と実行してください。 コマンド中の`account.json`の部分は先程の JSON ファイル名なので適宜置き換えることがあるかもしれません。

Prisma Studio を確認してみてください。組織が登録されていたら成功です。

<img width="1552" alt="Prisma Studioで組織登録が完了した" src="https://user-images.githubusercontent.com/281424/193491831-9ee55ec6-965d-465b-a2c6-44d6f150f9ea.png" />

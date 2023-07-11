---
sidebar_position: 7
---

# Signed Originator Profile 発行

ここで必要な情報は以下の 3 点です。

- `--holder` に指定する Signed Originator Profile の所有者となる組織の id
- `--certifier` に指定する Signed Originator Profile の発行者となる組織の id
- `--identity` に指定する発行者のプライベート鍵のファイルパス

<img width="1552" alt="Signed Originator Profile の発行" src="https://user-images.githubusercontent.com/281424/193493119-5d092c32-7437-4ebe-a453-96457f2fda72.png" />

例えば、所有者となる組織のドメイン名が `example.com`、発行者となる組織のドメイン名 `oprexpt.originator-profile.org` の場合であれば `--holder example.com --certifier oprexpt.originator-profile.org` となります。

さらに先程取得した発行者のプライベート鍵のファイルパスも必要となります。例えばプライベート鍵のファイル名が`certifier-key.pem`だった場合、 `--identity certifier-key.pem` となります。

:::note

事前に[レジストリ DB 参照](./registry-db-access.md)ができることを確認してください。

:::

この情報をもとに、以下のコマンドを実行します。

```console
profile-registry cert:issue \
  --identity certifier-key.pem \
  --certifier oprexpt.originator-profile.org \
  --holder example.com
```

Prisma Studio で組織の行を横スクロールすると、`issuedOps`という列があり、発行者となる組織に`1 ops`と表示されることが確認できます。

クリックすると、画面が変わり、画面下に `Open new tab` のボタンがあるのでそれを押すと、画面上部に新しいタブができます。

<img width="1549" alt="Prisma Studio画面内に OP が生成される" src="https://user-images.githubusercontent.com/281424/193494403-5b61796a-ea18-4499-b22d-596f63ad6f17.png" />

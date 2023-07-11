---
sidebar_position: 7
---

# Signed Originator Profile 発行

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

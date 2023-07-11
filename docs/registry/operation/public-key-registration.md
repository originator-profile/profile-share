---
sidebar_position: 6
---

# 公開鍵の登録

取得した公開鍵の方を使って登録します。前回で鍵のファイル名を`holder-key.pem`とした前提で下記に例を示します。
Prisma Studio の組織情報の行の `id` 列にある値をコピーして、以下の末尾に指定します。 `id`が `daab5a08-d513-400d-aaaa-e1c1493e0421` だった場合、以下のコマンドになります。

```console
profile-registry account:register-key -k holder-key.pem.pub.json --id daab5a08-d513-400d-aaaa-e1c1493e0421
```

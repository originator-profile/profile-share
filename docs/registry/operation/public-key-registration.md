---
sidebar_position: 6
---

# 公開鍵の登録

組織より提出を受けた公開鍵を登録します。公開鍵のファイル名を`holder-key.pem.pub.json`とした前提で下記に例を示します。

組織のドメイン名が `example.com` だった場合、以下のコマンドになります。

:::note

事前に[レジストリ DB 参照](./registry-db-access.md)ができることを確認してください。

:::

```console
profile-registry account:register-key -k holder-key.pem.pub.json --id example.com
```

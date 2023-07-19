---
sidebar_position: 6
---

# レジストリへの公開鍵の登録

Originator Profile レジストリ管理者が組織より提出を受けた公開鍵を Originator Profile レジストリに登録します。

:::note

事前に[レジストリ DB 参照](./registry-db-access.md)ができることを確認してください。

:::

公開鍵のファイル名が `holder-key.pub.json`、組織のドメイン名が `example.com` だった場合、以下のコマンドになります。

```console
profile-registry account:register-key -k holder-key.pub.json --id example.com
```

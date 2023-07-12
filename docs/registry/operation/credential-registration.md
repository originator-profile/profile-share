---
sidebar_position: 11
---

# 資格情報の登録

本ページでは Originator Profile レジストリ管理者が組織より提出を受けた資格情報を、Originator Profile レジストリに登録する方法について説明します。

:::note

事前に[レジストリ DB 参照](./registry-db-access.md)ができることを確認してください。

:::

次の値で例を示します。

| 項目                        | 値                                            |
| :-------------------------- | :-------------------------------------------- |
| 資格情報を保有する組織の id | example.com                                   |
| 認証機関の id               | certifier.example.com                         |
| 検証機関の id               | verifier.example.com                          |
| 資格名                      | 資格情報                                      |
| 画像 URL                    | `https://certifier.example.com/certificate.png` |
| 発行日                      | 2023年4月1日                                  |
| 有効期限                    | 2024年3月31日                                 |

以下のコマンドにより資格情報を登録することができます。

CLI のオプションについては、[apps/registry/README.md](https://github.com/webdino/profile/tree/main/apps/registry) を参照してください。

```console
profile-registry account:register-credential \
  --id example.com \
  --certifier certifier.example.com \
  --verifier verifier.example.com \
  --name 資格情報 \
  --image https://certifier.example.com/certificate.png \
  --issued-at 2023-04-01 \
  --expired-at 2024-03-31
```

登録した資格情報は [Signed Originator Profile を発行](./signed-originator-profile-issuance.md)することで、Signed Originator Profile に含めることができます。

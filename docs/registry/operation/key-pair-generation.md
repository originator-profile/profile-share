---
sidebar_position: 5
---

# 鍵ペアの生成

Signed Originator Profile あるいは Signed Document Profile 発行時にデジタル署名を行うための鍵ペアの生成には、以下のコマンドを実行してください。

CLI のインストールを含む開発環境の構築方法については、[開発ガイド](/development/)を参照してください。

```console
profile-registry key-gen -o <keyのファイル名>
```

`<keyのファイル名>` には出力ファイル名を指定します。例えば`key.pem`にすると

- `key.pem` （プライベート鍵）
- `key.pem.pub.json` （公開鍵）

の鍵ペアが生成されます。

:::warning
プライベート鍵は適切に管理してください。プライベート鍵が漏洩するとあなたの組織を詐称してコンテンツに署名をされる恐れがあります。
:::

鍵ペアの生成が完了したら、公開鍵を Originator Profile レジストリ管理者に渡してください。Originator Profile レジストリ管理者が公開鍵の登録を行います。

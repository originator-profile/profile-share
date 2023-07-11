---
sidebar_position: 5
---

# 鍵ペアの生成

Signed Originator Profile あるいは Signed Document Profile 発行の作業を行うために、鍵ペアを取得する作業が必要になります。 以下のコマンドを実行してください。

```console
profile-registry key-gen -o <keyのファイル名>
```

`<keyのファイル名>` には出力ファイル名を指定します。例えば`key.pem`にすると

- `key.pem` （プライベート鍵）
- `key.pem.pub.json` （公開鍵）

の鍵ペアが取得できます。

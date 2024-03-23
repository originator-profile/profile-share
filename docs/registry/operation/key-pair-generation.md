---
sidebar_position: 5
---

# 鍵ペアの生成

Signed Originator Profile あるいは Signed Document Profile 発行時にデジタル署名を行うための鍵ペアの生成には、以下のいずれかの方法をとってください。

:::warning
プライベート鍵は適切に管理してください。プライベート鍵が漏洩するとあなたの組織を詐称してコンテンツに署名をされる恐れがあります。
:::

## profile-registry CLI を使用する方法

### profile-registry CLI のインストール

Step 1
: Git と [Node.js](https://nodejs.org/) のインストール

Step 2
: 下記のコマンドをターミナルで実行

```console
git clone https://github.com/originator-profile/profile-share
cd profile-share
corepack enable pnpm
pnpm install
pnpm build
# profile-registry CLIのインストール
npm i -g ./apps/registry
```

その他、開発用サーバーの起動を含む開発環境の構築方法については、[開発ガイド](/development/)を参照してください。

### profile-registry key-gen コマンドの実行

詳しい使用方法については、[CLI ドキュメント](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-key-gen)を参照してください。

```console
profile-registry key-gen -o <keyのファイル名>
```

`<keyのファイル名>` には出力ファイル名を指定します。例えば`key`にすると

- `key.priv.json` （プライベート鍵）
- `key.pub.json` （公開鍵）

の鍵ペアが生成されます。

## JSON Web Key Generator を使用する方法

https://jwk.pages.dev/ を使用して、鍵ペアを生成することが可能です。

以下を指定して Generate ボタンをクリックしてください。

- Algorithm: ECDSA (ES256)
- Key ID: JWK Thumbprint (SHA-256)

ページ上に生成された鍵を、以下のようなファイル名で保存してください。

- Private Key: key.priv.json
- Public Key: key.pub.json

## WordPress プラグインを使用する方法

[WordPress の参照実装のプラグインをインストール](/registry/wordpress-integration/#プラグインのインストール)し、有効化したあと、WordPress 管理者画面 > Settings > Profile 設定画面にアクセスすると公開鍵を確認できます。

JWK の例:

```json
{
  "crv": "P-256",
  "kty": "EC",
  "x": "6OBp79JZKOaSFbjGaUrlcv17FdyGz-bUUYdW2xPgRBE",
  "y": "TeTGAWf_OrdUmC9UUYn7x6aZx39g-Qk98XmMpwXW_ew",
  "kid": "j9L_Qji2BC4vj1AaDCdzpurXSpM7cKBbtWO-W5a0SK4",
  "alg": "ES256",
  "use": "sig"
}
```

---

鍵ペアの生成が完了したら、公開鍵を Originator Profile レジストリにアップロードするか、Originator Profile レジストリ管理者に公開鍵の登録を依頼してください。

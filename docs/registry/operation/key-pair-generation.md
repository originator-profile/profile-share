---
sidebar_position: 5
---

# 鍵ペアの生成

OP を利用するには鍵ペアが必要です。[Signed Document Profile (SDP)](/terminology/signed-document-profile.md)にデジタル署名を付与する時などに利用します。手元でデジタル署名に用いる鍵ペアを生成し、事務局 OP レジストリに公開鍵の登録を依頼してください。

ここで生成したプライベート鍵でコンテンツに対して SDP を生成しコンテンツと共に配信すると、ブラウザは公開鍵を用いて署名を検証した上で SOP/SDP に記載された情報を表示します。

:::warning
プライベート鍵は適切に管理してください。プライベート鍵が漏洩するとあなたの組織を詐称してコンテンツに署名をされる恐れがあります。
:::

このページでは3つの鍵ペア生成方法を説明します。

- [JSON Web Key Generator ページを利用する方法](#page)
- [profile-registry CLI を使用する方法](#cli)
- [WordPress プラグインを使用する方法](#wordpress)

ひとつめの [JSON Web Key Generator ページを利用する方法](#page) は、インターネット上に公開されているページで鍵ペアを生成する方法で、これらの中で最も簡単な方法です。生成した鍵ペアは生成した人にしか分からず安全です。この方法が最も推奨されます。

## JSON Web Key Generator を使用する方法 {#page}

https://jwk.pages.dev/ を使用して、鍵ペアを生成することが可能です。

以下を指定して Generate ボタンをクリックしてください。

- Algorithm: ECDSA (ES256)
- Key ID: JWK Thumbprint (SHA-256)

ページ上に生成された鍵を、以下のようなファイル名で保存してください。

- Private Key: key.priv.json
- Public Key: key.pub.json

鍵の生成ができたら[公開鍵の OP レジストリへの登録](#register-public-keys)に進んでください。

## profile-registry CLI を使用する方法 {#cli}

### profile-registry CLI のインストール

[profile-registry CLI のインストール](/registry/cli-installation.md)を参照して CLI をインストールしてください。

### profile-registry key-gen コマンドの実行

profile-registry CLI を使用して公開鍵、プライベート鍵を生成します。

:::warning
プライベート鍵は適切に管理してください。プライベート鍵が漏洩するとあなたの組織を詐称してコンテンツに署名をされる恐れがあります。
:::

例:

```
$ profile-registry key-gen -o key
$ cat key.pub.json
{
  "kty": "EC",
  "kid": "x6pZlFXlKvbV69GZf8xW-lqb6tg0_ERuNHHgTTvmQ70",
  "x": "cnbjjr-SEPqyh2bMzqSPE2DdrEMFzDygPmCwkSkqnmk",
  "y": "LV4Xc5HilgrTNxSGMXUBgSmVvQgUB-bxP79LaoXOfFA",
  "crv": "P-256"
}
```

実行結果として得られる、鍵ファイルは下記となります。

- key.priv.json (プライベート鍵)
- key.pub.json (公開鍵)

鍵の生成ができたら[公開鍵の OP レジストリへの登録](#register-public-keys)に進んでください。

詳しい使用方法については、[CLI ドキュメント](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-key-gen)を参照してください。

## WordPress プラグインを使用する方法 {#wordpress}

[WordPress の参照実装のプラグインをインストール](/registry/integration/wordpress-integration/#install-plugin)し、有効化したあと、WordPress 管理者画面 > Settings > Profile 設定画面にアクセスすると公開鍵を確認できます。

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

鍵の生成ができたら[公開鍵の OP レジストリへの登録](#register-public-keys)に進んでください。

## 公開鍵の OP レジストリへの登録 {#register-public-keys}

生成した公開鍵・プライベート鍵を OP で利用するには、公開鍵を OP レジストリに登録する必要があります。
あなたが OP CIP が実施する実験の参加者など、 OP レジストリの管理者でない場合には、 OP CIP 事務局に公開鍵の登録を依頼してください。

あなたが OP レジストリ管理者ならば、[公開鍵を Originator Profile レジストリにアップロード](/registry/operation/public-key-registration.md)してください。

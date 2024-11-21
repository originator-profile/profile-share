# サイトのOP対応

サイト全体をOPに対応させるためには、以下の手順を実行します。

1. WSPの作成
2. `/.well-known/sp.json` の作成と配置

## WSP の作成

WSP の作成には以下の方法があります

- CLI を使用する方法：`profile-registry sign` コマンドを使用
- [jwt.io](http://jwt.io) を使用する方法：指定されたJSONフォーマットを使用

### CLI を使った方法

`profile-registry sign` コマンドを使用して作成します。

具体例:

```
$ profile-registry sign -i ./account-key.example.priv.json --input ./website-profile.example.json
eyJ...
```

実行後、コンソールに表示される “eyJ” から始まる文字列が WSP です。

CLIのインストール方法は [profile-registry CLI インストール方法](/registry/cli-installation.md) をご確認ください。

-i オプションにはプライベート鍵を指定します。

--input オプションにはWSPに関する情報をJSONで記述し、指定します。

指定するファイルは以下の形式です。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "<言語・地域コード>"
    }
  ],
  "type": ["VerifiableCredential", "WebsiteProfile"],
  "issuer": "<OP ID>",
  "credentialSubject": {
    "id": "<Web サイトの URL>",
    "url": "<Web サイトの URL>",
    "type": "WebSite",
    "name": "<Web サイトの名称>",
    "description": "<Web サイトの説明>",
    "image": {
      "id": "<サムネイル画像URL>"
    }
  }
}
```

具体例:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja"
    }
  ],
  "type": ["VerifiableCredential", "WebsiteProfile"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "https://media.example.com/",
    "url": "https://media.example.com/",
    "type": "WebSite",
    "name": "<Webサイトのタイトル>",
    "description": "<Webサイトの説明>",
    "image": {
      "id": "https://media.example.com/image.png"
    }
  }
}
```

プロパティの詳細は [OP VC Securing Mechanism Implementation Guidelines](/rfc/securing-mechanism.md) と [Website Profile (WSP) Data Model](/rfc/website-profile.md) をご確認ください。

その他コマンドの詳細は [`profile-registry sign`](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-sign) をご確認ください。

### 別の方法: [jwt.io](http://jwt.io) を使用する方法

指定されたJSONフォーマットを使用し、JWTを作成します。

具体例:
Jwt.io Debuggerの画面のHeaderに以下を入力します。

```json
{
  "alg": "ES256",
  "kid": "jJYs5_ILgUc8180L-pBPxBpgA3QC7eZu9wKOkh9mYPU",
  "typ": "vc+jwt",
  "cty": "vc"
}
```

Headerの `kid` は JWK Thumbprint です。プライベート鍵の `kid` プロパティと同じ値に変更します。

Jwt.io Debuggerの画面のPayloadに以下を入力します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja"
    }
  ],
  "type": ["VerifiableCredential", "WebsiteProfile"],
  "iss": "dns:example.com",
  "sub": "https://media.example.com/",
  "iat": 1687827458,
  "exp": 1719449858,
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "https://media.example.com/",
    "url": "https://media.example.com/",
    "type": "WebSite",
    "name": "<Webサイトのタイトル>",
    "description": "<Webサイトの説明>",
    "image": {
      "id": "https://media.example.com/image.png",
      "digestSRI": "sha256-WNn1owxcJX6uwrNFOhPX+npz4j46s3a1cExjX5wWVxw="
    }
  }
}
```

Payload の `iss` と `issuer` の値を自分の OP ID に書き換えます。

具体例:

```
dns:example.com
```

プロパティの詳細は [OP VC Securing Mechanism Implementation Guidelines](/rfc/securing-mechanism.md) と [Website Profile (WSP) Data Model](/rfc/website-profile.md) をご確認ください。

[Jwt.io](http://jwt.io/) Debugger の画面の右下、Verify Signature > Private Key にアカウントのプライベート鍵を貼り付けます。

プライベート鍵を貼り付けると、画面の左側の Encoded ペインには JWT が表示されます。 このとき得られる "eyJ" から始まる文字列が WSP です。

## `/.well-known/sp.json` の作成と配置

WSPを含む形式でSite Profile (sp.json) を作成します。

形式:

```json
{
  "originators": [...<OP CIPから受け取ったOPS>],
  "credential": "<WSP>"
}
```

具体例:

```json
{
  "originators": [
    {
      "core": "eyJ...",
      "annotations": ["eyJ...", "eyJ..."],
      "media": "eyJ..."
    },
    {
      "core": "eyJ...",
      "annotations": ["eyJ..."],
      "media": "eyJ..."
    }
  ],
  "credential": "eyJ..."
}
```

_[Site Profile](/rfc/site-profile.md) より_

sp.json は Web サイトの Well-known URL `/.well-known/sp.json` にアクセスできるように配置します。

具体例:

```
$ curl -i https://example.com/.well-known/sp.json
HTTP/1.1 200 OK
Content-Type: application/json
...: ...

...
```

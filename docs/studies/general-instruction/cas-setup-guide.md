# コンテンツのOP対応

記事/コンテンツをOPに対応させるための処理をします。これは、記事/コンテンツの作成や更新時に**都度必要**となる処理です。

1. Content Attestation (CA) の作成: 記事/コンテンツの作成時に、それに対応する Content Attestation (CA) を作成します。
2. Content Attestation Set (CAS) の作成: ページ中の CA のリストを含めた CA Set (CAS) を作成します。
3. CAS への参照の追加: ページ HTML 中に CAS への参照を追加します。この参照は、\<script\> タグを用いて実現します。

## CA の作成

CAの作成には以下の方法があります

- CLI を使用する方法：`profile-registry ca:sign` コマンドを使用
- [jwt.io](http://jwt.io) を使用する方法：指定されたJSONフォーマットを使用

### CLI を使った方法

`profile-registry ca:sign` コマンドを使用して作成します。

具体例:

```
$ profile-registry ca:sign --url https://example.com/ -i ./account-key.example.priv.json --input ./article-content-attestation.example.json
eyJ...
```

実行後、コンソールに表示されるの "eyJ” から始める文字列が CA です。

CLIのインストール方法は [profile-registry CLI インストール方法](/registry/cli-installation.md) をご確認ください。

--url オプションには実際にアクセス可能なHTMLのURLを指定します。

-i オプションにはプライベート鍵を指定します。

--input オプションにはCAに関する情報をJSONで記述し、指定します。

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
  "type": ["VerifiableCredential", "ContentAttestation"],
  "issuer": "<OP ID>",
  "credentialSubject": {
    "type": "Article",
    "headline": "<コンテンツのタイトル>",
    "description": "<コンテンツの説明>",
    "image": {
      "id": "<サムネイル画像URL>"
    },
    "datePublished": "<公開日時>",
    "dateModified": "<最終更新日時>",
    "author": ["<著者名>"],
    "editor": ["<編集者名>"],
    "genre": "<ジャンル>"
  },
  "allowedUrl": "<CAの使用を許可するWebページのURL Pattern>",
  "target": [
    {
      "type": "<Target Integrityの種別>",
      "cssSelector": "<CSS セレクター>"
    }
  ]
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
  "type": ["VerifiableCredential", "ContentAttestation"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "type": "Article",
    "headline": "<Webページのタイトル>",
    "description": "<Webページの説明>",
    "image": {
      "id": "https://media.example.com/image.png"
    },
    "author": ["山田花子"],
    "editor": ["山田太郎"],
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "genre": "Arts & Entertainment"
  },
  "allowedUrl": "https://media.example.com/articles/2024-06-30",
  "target": [
    {
      "type": "VisibleTextTargetIntegrity",
      "cssSelector": "<CSS セレクター>"
    },
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-+M3dMZXeSIwAP8BsIAwxn5ofFWUtaoSoDfB+/J8uXMo="
    }
  ]
}
```

プロパティの詳細は [OP VC Securing Mechanism Implementation Guidelines](/rfc/securing-mechanism.md) と [Content Attestation of Article Type Implementation Guidelines](/rfc/ca-guide/article.md) をご確認ください。

その他コマンドの詳細は [`profile-registry ca:sign`](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-casign) をご確認ください。

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
  "type": ["VerifiableCredential", "ContentAttestation"],
  "iss": "dns:example.com",
  "sub": "urn:uuid:41632705-9600-49df-b80d-a357d474f37e",
  "iat": 1687827458,
  "exp": 1719449858,
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "urn:uuid:41632705-9600-49df-b80d-a357d474f37e",
    "type": "Article",
    "headline": "<Webページのタイトル>",
    "image": {
      "id": "https://media.example.com/image.png",
      "digestSRI": "sha256-WNn1owxcJX6uwrNFOhPX+npz4j46s3a1cExjX5wWVxw="
    },
    "description": "<Webページの説明>",
    "author": ["山田花子"],
    "editor": ["山田太郎"],
    "datePublished": "2023-07-04T19:14:00Z",
    "dateModified": "2023-07-04T19:14:00Z",
    "genre": "Arts & Entertainment"
  },
  "allowedUrl": "https://media.example.com/articles/2024-06-30",
  "target": [
    {
      "type": "VisibleTextTargetIntegrity",
      "cssSelector": "<CSS セレクター>",
      "integrity": "sha256-GYC9PqfIw0qWahU6OlReQfuurCI5VLJplslVdF7M95U="
    },
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-+M3dMZXeSIwAP8BsIAwxn5ofFWUtaoSoDfB+/J8uXMo="
    }
  ]
}
```

Payload の `iss` と `issuer` の値を自分の OP ID に書き換えます。

具体例:

```
dns:example.com
```

UUID を生成し、Payload の `sub` と `credentialSubject.id` の値を、生成した UUID の `urn:uuid:` を前に付けた文字列に書き換えます。

具体例:

```
$ uuidgen
41632705-9600-49df-b80d-a357d474f37
: この場合 "urn:uuid:41632705-9600-49df-b80d-a357d474f37e" となります
```

その他のプロパティの詳細は [OP VC Securing Mechanism Implementation Guidelines](/rfc/securing-mechanism.md) と [Content Attestation of Article Type Implementation Guidelines](/rfc/ca-guide/article.md) をご確認ください。

[Jwt.io](http://jwt.io/) Debugger の画面の右下、Verify Signature > Private Key にアカウントのプライベート鍵を貼り付けます。

プライベート鍵を貼り付けると、画面の左側の Encoded ペインには JWT が表示されます。 このとき得られる "eyJ" から始まる文字列が CA です。

## CAS の作成

CASは、ページ中のCAのリストを含む形で作成します。

具体例:

```json
["eyJ..."]
```

_「[Content Attestation Set](/rfc/content-attestation-set.md)」より_

CASはCAの配列です。

## CAS への参照の追加

ページHTMLにCASへの参照を追加します。以下のscriptタグを使用します：

```html
<script type="application/cas+json" src="...cas.json"></script>
```

_[Linking Content Attestation Set and Originator Profile Set to A HTML Document](/rfc/link-to-html.md) より_

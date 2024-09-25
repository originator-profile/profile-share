---
sidebar_position: 12
---

# OP VC Securing Mechanism

この仕様は[Securing Verifiable Credentials using JOSE and COSE](https://w3c.github.io/vc-jose-cose/) をベースにデータサイズ削減と VC の種類の判別を目的として作られました。

## Securing VC

### Mapping

次の変換表に基づきデータモデルを JWT のヘッダー、ペイロードに変換します。
データモデルと変換後のデータは一対一対応します。仕様策定者はそうなるようにデータモデルを定義する必要があります (MUST)。

|                   データモデル                    |         JWT          |
| :-----------------------------------------------: | :------------------: |
|                     @context                      | 割り当てなし（削除） |
|            `@context[-1]["@language"]`            |         lang         |
|                       type                        | 割り当てなし（削除） |
|                      issuer                       |         iss          |
|               credentialSubject.id                |         sub          |
|              credentialSubject.type               | 割り当てなし（削除） |
| credentialSubject 内のプロパティ（id, type 以外） |  トップレベルに展開  |
|             トップレベルのプロパティ              |  トップレベルに残す  |
|                 （署名した日時）                  |         iat          |
|                 （署名失効日時）                  |         exp          |

データモデルと JWT のプロパティ・クレームのマッピングが成り立つように、仕様策定者はデータモデルを定義するときに次のことを守る必要があります (MUST)。

- `credentialSubject` の中のプロパティとトップレベルのプロパティにプロパティ名の重複がないようにしてください (MUST)。重複していた場合にはデータモデルでトップレベルに存在するプロパティを優先してください (MUST)。
- `credentialSubject` 内またはトップレベルに `lang`, `iss`, `sub`, `iat`, `exp` という名前のプロパティを定義してはいけません (MUST)

### [JWS](https://www.rfc-editor.org/rfc/rfc7515)

- `typ` ヘッダーパラメーターは `vc-ld+jwt` でなければなりません (MUST)。
- `kid` ヘッダーパラメーターは [JWK Thumbprint](https://www.rfc-editor.org/rfc/rfc7638.html) でなければなりません (MUST)。
- `cty` ヘッダーパラメーターは次の文字列です。

acronym (`CP`, `PA`, `CA`, `WMP`, `WSP` のいずれか) に `;` と `credentialSubject.type` から末尾の　`Properties` を除いた文字列を連結します。

例:

- `CP`
- `CA;Content`
- `CA;Advertisement`
- `PA;Certificate`
- `PA;Certificate;ECJP`
- `WMP`
- `WSP`

#### `iat`, `exp` {#iat-exp}

REQUIRED. [JWT (RFC 7519)](https://www.rfc-editor.org/rfc/rfc7519.html) の仕様に従います。

#### 例

_このセクションは非規範的です。_

##### Core Profile

_このセクションは非規範的です。_

ヘッダー:

```json
{
  "typ": "vc-ld+jwt",
  "cty": "CP",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード:

```json
{
  "iss": "dns:example.org",
  "sub": "dns:example.jp",
  "jwks": {
    "keys": [
      {
        "x": "ypAlUjo5O5soUNHk3mlRyfw6ujxqjfD_HMQt7XH-rSg",
        "y": "1cmv9lmZvL0XAERNxvrT2kZkC4Uwu5i1Or1O-4ixJuE",
        "crv": "P-256",
        "kid": "jJYs5_ILgUc8180L-pBPxBpgA3QC7eZu9wKOkh9mYPU",
        "kty": "EC"
      }
    ]
  },
  "iat": 1688623395,
  "exp": 1720245795
}
```

##### Content Attestation

_このセクションは非規範的です。_

ヘッダー:

```json
{
  "typ": "vc-ld+jwt",
  "cty": "CA;Content",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード

```json
{
  "lang": "ja",
  "iss": "dns:example.com",
  "sub": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
  "title": "<Webページのタイトル>",
  "image": "https://media.example.com/image.png",
  "source": "https://media2.example.com/articles/1",
  "description": "<Webページの説明>",
  "author": "山田花子",
  "editor": "山田太郎",
  "datePublished": "2023-07-04T19:14:00Z",
  "dateModified": "2023-07-04T19:14:00Z",
  "category": {
    "cat": "IAB1",
    "cattax": 1,
    "name": "Arts & Entertainment"
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
  ],
  "iat": 1688623395,
  "exp": 1720245795
}
```

##### Profile Annotation (Certificate)

ヘッダー:

```json
{
  "typ": "vc-ld+jwt",
  "cty": "PA;Certificate;ECJP",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード:

```json
{
  "lang": "ja",
  "iss": "dns:pa-issuer.example.org",
  "sub": "dns:pa-holder.example.jp",
  "addressCountry": "JP",
  "name": "○○新聞社 (※開発用サンプル)",
  "corporateNumber": "0000000000000",
  "postalCode": "000-0000",
  "addressRegion": "東京都",
  "addressLocality": "千代田区",
  "streetAddress": "○○○",
  "certificationSystem": {
    "id": "urn:uuid:5374a35f-57ce-43fd-84c3-2c9b0163e3df",
    "type": "CertificationSystem",
    "name": "法人番号システムWeb-API",
    "ref": "https://www.houjin-bangou.nta.go.jp/"
  },
  "iat": 1688623395,
  "exp": 1720245795
}
```

## 暗号アルゴリズム {#cryptographic-algorithm}

暗号アルゴリズムは「[暗号アルゴリズム](./algorithm.md)」に従います。

## 検証プロセス {#verification}

_このセクションはより詳細な定義が求められます。_

VC の検証者は [VC DM 2.0 に準拠した検証の実装](https://www.w3.org/TR/vc-data-model-2.0/#verification)を用いて検証することができます。

:::note

将来、各検証の失敗に対応する [ProblemDetails オブジェクト](https://www.w3.org/TR/vc-data-model-2.0/#problem-details) を定義する可能性があります。

:::

## セキュリティ {#security}

TODO

[Verifiable Credentials Data Model 2.0 セクション 9](https://www.w3.org/TR/vc-data-model-2.0/#security-considerations)に記載のあるセキュリティの考慮事項を参考にしてください。

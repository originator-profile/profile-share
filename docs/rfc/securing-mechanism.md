---
sidebar_position: 12
---

# OP VC Securing Mechanism Implementation Guidelines

本文書は [Securing Verifiable Credentials using JOSE and COSE](https://w3c.github.io/vc-jose-cose/) に準拠した OP VC の各クレーム、プロパティの値を具体的に指定する文書です。

:::note

現在 OP VC の Securing Mechanism を [Securing Verifiable Credentials using JOSE and COSE](https://w3c.github.io/vc-jose-cose/) のみに限定しています。今後他の方式を採用する可能性があります。

:::

## Securing VC with JOSE

### ヘッダー

- `typ` ヘッダーパラメーターは `vc+jwt` でなければなりません (MUST)。
- `kid` ヘッダーパラメーターは [JWK Thumbprint](https://www.rfc-editor.org/rfc/rfc7638.html) でなければなりません (MUST)。
- `cty` ヘッダーパラメーターは `vc` でなければなりません (MUST)。

### ペイロード

次の表に基づき、データモデルのプロパティと JWT クレームは一対一対応します。仕様策定者はそうなるようにデータモデルを定義する必要があります (MUST)。

JWT ペイロードにデータモデルのプロパティと JWT クレームの両方を含めても構いません (MAY)。ただし、その場合にはデータモデルのプロパティと JWT クレームの値は競合してはなりません (MUST NOT)。

:::note

Originator Profile 技術研究組合 (OP CIP) の開発するアプリケーションでは、JWT ペイロードにデータモデルのプロパティと JWT クレームの両方を含めて署名します。

:::

|     データモデル     | JWT |
| :------------------: | :-: |
|   issuer (文字列)    | iss |
|      issuer.id       | iss |
| credentialSubject.id | sub |
|   （署名した日時）   | iat |
|   （署名失効日時）   | exp |

### 追加の JWT クレーム

#### `iat`, `exp` {#iat-exp}

REQUIRED. [JWT (RFC 7519)](https://www.rfc-editor.org/rfc/rfc7519.html) の仕様に従います。

#### 例

##### Core Profile

ヘッダー:

```json
{
  "typ": "vc+jwt",
  "cty": "vc",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード:

```json
{
  "iss": "dns:example.org",
  "sub": "dns:example.jp",
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1"
  ],
  "type": ["VerifiableCredential", "CoreProfile"],
  "issuer": "dns:example.org",
  "credentialSubject": {
    "id": "dns:example.jp",
    "type": "Core",
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
    }
  },
  "iat": 1688623395,
  "exp": 1720245795
}
```

##### Content Attestation

ヘッダー:

```json
{
  "typ": "vc+jwt",
  "cty": "vc",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード

```json
{
  "iss": "dns:example.com",
  "sub": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "ContentAttestation"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
    "type": "Article",
    "headline": "<Webページのタイトル>",
    "image": {
      "id": "https://media.example.com/image.png",
      "digestSRI": "sha256-2ntYAX8nslHxMv5h7Wdv5QDaWxHq6dIOVAdwB9VztrY="
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
  ],
  "iat": 1688623395,
  "exp": 1720245795
}
```

##### Profile Annotation (Certificate)

ヘッダー:

```json
{
  "typ": "vc+jwt",
  "cty": "vc",
  "kid": "...",
  "alg": "ES256"
}
```

ペイロード:

```json
{
  "iss": "dns:pa-issuer.example.org",
  "sub": "dns:pa-holder.example.jp",
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "Certificate"],
  "issuer": "dns:pa-issuer.example.org",
  "credentialSubject": {
    "id": "dns:pa-holder.example.jp",
    "type": "ECJP",
    "addressCountry": "JP",
    "name": "○○新聞社 (※開発用サンプル)",
    "corporateNumber": "0000000000000",
    "postalCode": "000-0000",
    "addressRegion": "東京都",
    "addressLocality": "千代田区",
    "streetAddress": "○○○"
  },
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

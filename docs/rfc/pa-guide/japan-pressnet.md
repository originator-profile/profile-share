# 日本新聞協会所属証明書 Implementation Guidelines

## 用語

本文書に説明のない用語については、[用語](../terminology.md)を参照してください。

- Profile Annotation (PA)
- 日本新聞協会所属証明書
- 認証制度

## 日本新聞協会所属証明書 のデータモデル

[Certificate](../certificate.md) に従います。

### プロパティ

#### `@context`

REQUIRED. [OP VC Data Model](../op-vc-data-model.md) に従ってください (MUST)。さらに、3つ目の値を `"https://originator-profile.org/ns/cip/v1"` にしなければなりません (MUST)。

#### `type`

REQUIRED. `["VerifiableCredential", "Certificate"]` でなければなりません (MUST)。

#### `issuer`

REQUIRED. 証明書発行組織の OP ID です。

:::note

現在、日本新聞協会所属証明書は新聞社から OP 申請を受けた OP レジストリが発行しています。そのため `issuer` プロパティの値は OP レジストリの OP ID になります。

:::

#### `credentialSubject`

- `id`: REQUIRED. 証明書保有組織の OP ID です。
- `type`: REQUIRED. `CertificateProperties` にしてください。
- `certificationSystem`: REQUIRED. 認証制度の ID です。
- `description`: OPTIONAL. この証明書に関する説明です。
- その他のプロパティは [Certificate](../certificate.md) を参照してください。

#### `certificationSystem`

REQUIRED. 認証制度を表す JSON-LD Node Object です。

- `id`: REQUIRED. 認証制度の ID を URI 形式で指定してください。
- `type`: REQUIRED. `CertificationSystem` でなければなりません (MUST)。
- `name`: REQUIRED.　認証制度の名前です。
- `description`: OPTIONAL. 認証制度の説明です。
- その他のプロパティは [Certificate](../certificate.md) を参照してください。

```json
{
  "id": "urn:uuid:14270f8f-9f1c-4f89-9fa4-8c93767a8404",
  "type": "CertificationSystem",
  "name": "日本新聞社協会 所属社",
  "description": "一般社団法人日本新聞協会は、報道機関の倫理水準の向上を図ることで、健全な民主主義の発展に寄与することを目的とする団体です。報道機関が果たすべき責務と守るべき倫理について「新聞倫理綱領」を制定し、加盟社にこの綱領を順守することを求めています。加盟社は全国の新聞、通信、放送計１２２社（２０２４年５月１日現在）で、日々、正確で公正な記事と責任ある論評の発信に努めています。",
  "ref": "https://www.pressnet.or.jp/"
}
```

## Appendix

### 例

_このセクションは非規範的です。_

日本新聞協会所属証明書のデータモデルの具体例を次に示します。

```json
{
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
    "type": "CertificateProperties",
    "certificationSystem": "urn:uuid:14270f8f-9f1c-4f89-9fa4-8c93767a8404"
  },
  "certificationSystem": {
    "id": "urn:uuid:14270f8f-9f1c-4f89-9fa4-8c93767a8404",
    "type": "CertificationSystem",
    "name": "日本新聞社協会 所属社",
    "description": "一般社団法人日本新聞協会は、報道機関の倫理水準の向上を図ることで、健全な民主主義の発展に寄与することを目的とする団体です。報道機関が果たすべき責務と守るべき倫理について「新聞倫理綱領」を制定し、加盟社にこの綱領を順守することを求めています。加盟社は全国の新聞、通信、放送計１２２社（２０２４年５月１日現在）で、日々、正確で公正な記事と責任ある論評の発信に努めています。",
    "ref": "https://www.pressnet.or.jp/"
  },
  "validFrom": "2022-03-31T15:00:00Z",
  "validUntil": "2024-03-31T14:59:59Z"
}
```

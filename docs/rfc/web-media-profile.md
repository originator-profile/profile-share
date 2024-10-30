---
sidebar_position: 4
---

# Web Media Profile Data Model Implementation Guidelines

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- OP VC Data Model Conforming Document (OP VC DM 準拠文書)
- Originator Profile Identifier (OP ID)
- Web Media Profile (WMP)

## Web Media Profile のデータモデル

Web Media Profile は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

### プロパティ

#### `@context`

[OP VC Data Model](./op-vc-data-model.md#context) に従ってください (MUST)。

#### `type`

REQUIRED. 必ず `["VerifiableCredential", "WebMediaProfile"]` にしてください (MUST)。

#### `issuer`

REQUIRED. WMP 保有組織の Core Profile の発行者でなければなりません (MUST)。

:::note

WMP 記載の情報は Core Profile を発行する組織が審査で確認します。

:::

#### `credentialSubject`

REQUIRED. Web メディアの発信者を表す JSON-LD Node Object です。

- `id`: REQUIRED. WMP 保有組織の OP ID でなければなりません (MUST)。
- `type`: REQUIRED. `OnlineBusiness` でなければなりません (MUST)。
- `url`: REQUIRED. 組織の公式ページへの URL でなければなりません (MUST)。
- `name`: REQUIRED. 組織名です。
- `logo`: OPTIONAL. 組織のロゴ画像です。 [`image` データ型](./context.md#the-image-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `email`: OPTIONAL. 組織の代表メールアドレスです。
- `telephone`: OPTIONAL. 組織の代表電話番号です。
- `contactPoint`: OPTIONAL. お問い合わせページの情報です。 [`page` データ型](./context.md#the-page-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `informationTransmissionPolicy`: OPTIONAL. 情報発信ポリシーページの情報です。 [`page` データ型](./context.md#the-page-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `privacyPolicy`: OPTIONAL. プライバシーポリシーページの情報です。 [`page` データ型](./context.md#the-page-datatype) の JSON-LD Node Object でなければなりません (MUST)。
- `description`: OPTIONAL. 組織に関する説明です。

:::note

`informationTransmissionPolicy` プロパティに含める情報発信ポリシーは [Originator Profile 憲章](https://originator-profile.org/ja-JP/charter/) の第3条1号において OP ID 付与の必須条件とされています。

:::

## 拡張性

発行者は [OP VC Data Model](./op-vc-data-model.md) および本文書に未定義のプロパティを追加してもよいです (MAY) が、その場合は [Verifiable Credentials Data Model 2.0 セクション 5.2](https://www.w3.org/TR/vc-data-model-2.0/#extensibility)に従って拡張してください (RECOMMENDED)。

## Appendix

### 例

_このセクションは非規範的です。_

WMP の具体例を次に示します。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" }
  ],
  "type": ["VerifiableCredential", "WebMediaProfile"],
  "issuer": "dns:wmp-issuer.example.org",
  "credentialSubject": {
    "id": "dns:wmp-holder.example.jp",
    "type": "OnlineBusiness",
    "url": "https://www.wmp-holder.example.jp/",
    "name": "○○メディア (※開発用サンプル)",
    "logo": {
      "id": "https://www.wmp-holder.example.jp/logo.svg",
      "digestSRI": "sha256-OYP9B9EPFBi1vs0dUqOhSbHmtP+ZSTsUv2/OjSzWK0w="
    },
    "email": "contact@wmp-holder.example.jp",
    "telephone": "0000000000",
    "contactPoint": {
      "id": "https://wmp-holder.example.jp/contact",
      "name": "お問い合わせ"
    },
    "informationTransmissionPolicy": {
      "id": "https://wmp-holder.example.jp/statement",
      "name": "情報発信ポリシー"
    },
    "privacyPolicy": {
      "id": "https://wmp-holder.example.jp/privacy",
      "name": "プライバシーポリシー"
    },
    "description": "この文章はこの Web メディアに関する補足情報です。"
  }
}
```

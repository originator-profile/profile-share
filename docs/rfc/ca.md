---
sidebar_position: 4
---

# Content Attestation Data Model

:::note

検証対象としてはページロード完了時、利用者の能動的な確認操作などに起因する特定イベントベースでの検証の他に、リアルタイムでの動的な DOM の読み込み、書き換え中の検証も考えられるが、CSS セレクターの対象要素の変更や Visible Text Target のように Rendered なテキストを署名対象とするアルゴリズムが DOM 書き換え中のリアルタイム検証とは相性が悪い。ブラウザの性能/消費電力に対するインパクトからも一定のタイミングでの検証とするのが良いのではないか。

また、危険なサイトなどのブロックと異なり情報発信者の検証はセキュリティ的に読み込みすること自体を避けるべき危険性は低いこと、Rendered テキストに対する署名をするというアルゴリズムの存在からも、読み込み/表示をブロックせず読み込み後に検証し、検証が通らない場合には対象コンテンツを隠す/警告する程度の対応をブラウザとして実装する事が想定されるため、検証タイミングは描画段階/リアルタイム性を必要としない想定である。

:::

## 用語

本文書に説明のない用語については、[用語](./terminology.md)を参照してください。

- Originator Profile (OP)
- Originator Profile Identifier (OP ID)
- Content Attestation (CA)
- Target Integrity

## Content Attestation (CA) のデータモデル

Content Attestation は OP VC DM 準拠文書でなければなりません (MUST)。他に以下のプロパティを含みます。

:::note

同じページに対して複数の CA を発行する場合に、 CA の間の関係性を示すプロパティは存在しません。実験においてこれで支障ないか確認する予定です。

- 参考: [SDP 間の関係性をデータモデルに組み込む必要性の検討 · Issue #1428 · originator-profile/profile](https://github.com/originator-profile/profile/issues/1428)

:::

### プロパティ

#### `@context`

[OP VC Data Model](./op-vc-data-model.md) に従ってください (MUST)。

#### `credentialSubject.id`

REQUIRED. CA ID でなければなりません (MUST)。 CA ID は [UUIDv4](https://www.rfc-editor.org/rfc/rfc9562.html#name-uuid-version-4) の URN 形式の文字列です。コンテンツと CA ID は一対一対応します。

#### `allowedUrl`

OPTIONAL. この CA によって表明される情報の対象となる URL です。
文字列は必ず [URL Pattern string](https://urlpattern.spec.whatwg.org/#pattern-strings) でなければなりません (MUST)。

#### `allowedOrigin`

OPTIONAL. この CA によって表明される情報の対象となる [Origin](https://www.rfc-editor.org/rfc/rfc6454) の [ASCII Serialization](https://www.rfc-editor.org/rfc/rfc6454#section-6.2) 後の文字列です。

具体例: `"https://example.com"`, `["https://a.example.com", "https://b.example.com"]`

#### `target`

OPTIONAL. Target Integrity でなければなりません (MUST)。

Target Integrity はコンテンツの一部の完全性を保証するための仕組みです。
[Target Integrity Registry](./target-guide/index.mdx)に登録されているものを使用できます。

## 例

_このセクションは非規範的です。_

CA の具体例を示します。この CA は https://media.example.com/articles/2024-06-30 で公開されているコンテンツに紐づいています。

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1"
  ],
  "type": ["VerifiableCredential", "ContentAttestation"],
  "issuer": "dns:example.com",
  "credentialSubject": {
    "id": "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
    "type": "ContentProperties",
    "title": "<Webページのタイトル>",
    "image": {
      "id": "https://media.example.com/image.png",
      "digestSRI": "sha256-..."
    },
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
    }
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

この CA は https://ad.example.com 配下の Web ページに掲載されている広告コンテンツに紐づいています。

```json
{
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
    "type": "AdvertisementProperties",
    "title": "<広告のタイトル>",
    "description": "<広告の説明>",
    "image": "https://ad.example.com/image.png"
  },
  "allowedOrigin": "https://ad.example.com",
  "target": {
    "type": "ExternalResourceTargetIntegrity",
    "integrity": "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64="
  }
}
```

:::note

例には本文書に未定義のプロパティも含んでいます。未定義のプロパティを追加する方法については[拡張性](#extensibility)を参照してください。

:::

## 拡張性 {#extensibility}

発行者は [OP VC Data Model](./op-vc-data-model.md) および本文書に未定義のプロパティを Content Attestation に追加してはなりません (MUST NOT) 。

発行者は [OP VC Data Model](./op-vc-data-model.md) および本文書に未定義のプロパティを追加してもよいです (MAY) が、その場合は [Verifiable Credentials Data Model 2.0 セクション 5.2](https://www.w3.org/TR/vc-data-model-2.0/#extensibility)に従って拡張してください (RECOMMENDED)。

:::info

Originator Profile 技術研究組合が開発するアプリケーションで使用されるプロパティについては、次の RFC 文書を参照してください。

- [Content Properties Schema](./ca-guide/content-properties.md)
- [Advertisement Properties Schema](./ca-guide/advertisement-properties.md)

:::

### Target Integrity の拡張性

[Target Integrity](./target-guide/index.mdx) を参照してください。

## 検証プロセス

_このセクションはより詳細な定義が求められます。_

CA の検証者は次のことを検証することができます。

- 選択した Securing Mechanism に従った VC の検証
- `allowedUrl`, `allowedOrigin` の検証
- Target Integrity の検証

### `allowedUrl` の検証 {#allowed-url-validation}

検証者は次の手順に従って `allowedUrl` プロパティを検証できます (OPTIONAL)。

1. CA が参照するウェブページの URL を取得します。
2. CA に `allowedUrl` プロパティの配列の要素それぞれと 1. で得た URL がマッチするか確認します。アルゴリズムは[URL Pattern の `test(input, baseURL)`メソッド](https://urlpattern.spec.whatwg.org/#dom-urlpattern-test)を使います。

### `allowedOrigin` の検証 {#allowed-origin-validation}

検証者は次の手順に従って `allowedOrigin` プロパティを検証できます (OPTIONAL)。

1. CA が参照するウェブページの URL オリジンを取得します。
2. CA に `allowedOrigin` プロパティが含まれる場合、その配列の中に 1\. の URL オリジンが含まれているか検索します。
   1. `allowedOrigin` プロパティが含まれない場合は検証成功とみなします。

### Target Integrity の検証

検証者は `target` プロパティの Target Integrity について、Target Integrity のそれぞれの type で定めのある検証プロセスが実施可能である限り、検証すべきです (SHOULD)。

:::note

Target Integrity のタイプによっては、検証者の環境では検証が不可能な場合があります。たとえば、ブラウザによる描画が実行できない環境では、ブラウザによる描画結果が検証時必要な Target Integrity は検証が不可能です。

:::

検証者は Target Integrity のタイプごとに定義される検証方法で検証しなければならず (MUST)、検証に失敗した場合にはその Target Integrity の検証が失敗したことを閲覧者に提示してください (RECOMMENDED)。Target Integrity の失敗を、 CA の検証失敗と同じまたはより高い深刻度 (Severity) でユーザーに表示することは避けてください (RECOMMENDED)。

:::note

将来的には、特定のアプリケーションの特定の使い方において、 Target Integrity の検証結果の表示の仕方を規定する可能性があります。例えば、ユーザーがブラウザでページを閲覧しているときに OP 対応ツール・機能を利用して OP, CA を確認する利用状況を想定しています。

:::

非規範的な例として、[Text Target Integrity](./target-guide/text.md) 検証プロセスの例を示します。

1. `selector` プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素を DOMString として取得します。
3. すべての要素を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. 符号化した文字列のハッシュ値と `integrity` プロパティのハッシュ値が一致することを確認します。

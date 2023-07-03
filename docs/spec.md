---
sidebar_position: 1
---

# 仕様

:::note

この文書は仕様の草案です。
最終的な仕様とは異なる可能性があります。

- [Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/) 準拠
- 署名方法
- 署名鍵の更新方法 (Key Rollover)
- 資格情報の失効方法
- データのシリアライゼーション
- 語彙

:::

## データモデル

![model](assets/model.dio.png)

- 発行者(たとえば、認証機関)は、検証可能な資格情報を生成します。
- 所有者(たとえば、メディア・広告などに関わる組織)は、資格情報を保存し、提供します。
- 検証者は、所有者から資格情報を受け取り、適切に署名されていることを検証します。

## スキーマ

データモデルの詳細な構造は [Profile Model](model/README.md) を参照してください。

## Originator Profile データモデル

メディア・広告などに関わる組織の身元を表明し検証可能にするためのモデルです。
Signed Originator Profile によって記述します。

![op-model](assets/op-model.dio.png)

- 認証機関の識別子は、Originator Profile の発行者を表す一義的な識別子です。
- 組織の身元は、法的な責任を負う企業や公的機関の身元(たとえば、名称や連絡先など)を表明するオブジェクトです。
- 署名と鍵は、認証機関によって付与され、Originator Profile を検証するために使用されるデータです。

## Document Profile データモデル

メディア・広告などの出版物を検証可能にするためのモデルです。
Signed Document Profile によって記述します。

![dp-model](assets/dp-model.dio.png)

- 組織の識別子は、Document Profile の発行者を表す一義的な識別子です。
- 出版物は、組織の主要な出版物を表明するオブジェクトです。
- 署名と鍵は、組織とその組織の Originator Profile によって与えられ、Document Profile を検証するために使用されるデータです。

## 認証機関・組織の識別子

認証機関または組織を表す一義的な識別子です。
必ずその認証機関または組織の保有するドメイン名でなければなりません (MUST)。

例:

```
example.org
```

## 出版物の識別子

組織の主要な出版物を表す一義的な識別子です。
必ず UUID 文字列表現 (RFC 4122) でなければなりません (MUST)。

例:

```
f52d9520-08b7-4588-b2eb-cd9e50ea771d
```

## Profile Set

メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名され、それらの集合を JSON-LD によって表現します。

例:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "main": "0421885c-0ac0-4a36-af02-46c1c400b239",
  "profile": [
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IkdQLXV5QThvYlBrclU2S3Nhdl8wOVZCclZFOHVjWFdPdFc0OGR3NlY0clkiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29wci53ZWJkaW5vLm9yZy9qd3QvY2xhaW1zL29wIjp7Iml0ZW0iOlt7InR5cGUiOiJjZXJ0aWZpZXIiLCJkb21haW5OYW1lIjoib3ByZGV2Lmhlcm9rdWFwcC5jb20iLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQLyIsImxvZ29zIjpbeyJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvaW1hZ2UvaWNvbi5zdmciLCJpc01haW4iOnRydWV9XX0seyJ0eXBlIjoiaG9sZGVyIiwiZG9tYWluTmFtZSI6Im9wcmRldi5oZXJva3VhcHAuY29tIiwidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnLyIsIm5hbWUiOiJPcmlnaW5hdG9yIFByb2ZpbGUg5oqA6KGT56CU56m257WE5ZCIIiwicG9zdGFsQ29kZSI6IjEwOC0wMDczIiwiYWRkcmVzc0NvdW50cnkiOiJKUCIsImFkZHJlc3NSZWdpb24iOiLmnbHkuqzpg70iLCJhZGRyZXNzTG9jYWxpdHkiOiLmuK_ljLoiLCJzdHJlZXRBZGRyZXNzIjoi5LiJ55SwIiwiY29udGFjdFRpdGxlIjoi44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdFVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC8iLCJsb2dvcyI6W3sidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2ltYWdlL2ljb24uc3ZnIiwiaXNNYWluIjp0cnVlfV19XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoibGpiNGs2UDBQYkdwbHRPRDN6TF94cDlNOEFnSXlaYmdCXzFER2c4em8tayIsInkiOiJTbHUtNUhDcEI3ZzRhcDBTcS1XWThvdjFyc1hUUmtvNGdKMzNWc1RYXzRrIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJHUC11eUE4b2JQa3JVNktzYXZfMDlWQnJWRTh1Y1hXT3RXNDhkdzZWNHJZIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZGV2Lmhlcm9rdWFwcC5jb20iLCJzdWIiOiJvcHJkZXYuaGVyb2t1YXBwLmNvbSIsImlhdCI6MTY4MTcwMzQxNCwiZXhwIjoxNzEzMzI1ODE0fQ.a3FnDEhZF8psz0DJvptfgk_48f0ERqlxDIyOxS88P2Wd95ipDzieMogIJNFhHMFm0SPcdolpOis15z121t1VHg",
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IkdQLXV5QThvYlBrclU2S3Nhdl8wOVZCclZFOHVjWFdPdFc0OGR3NlY0clkiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29wci53ZWJkaW5vLm9yZy9qd3QvY2xhaW1zL2RwIjp7Iml0ZW0iOlt7InR5cGUiOiJ3ZWJzaXRlIiwidXJsIjoiaHR0cHM6Ly9vcHJkZXYuaGVyb2t1YXBwLmNvbSIsInRpdGxlIjoiT1Ag56K66KqN44GP44KTIn0seyJ0eXBlIjoidmlzaWJsZVRleHQiLCJ1cmwiOiJodHRwczovL29wcmRldi5oZXJva3VhcHAuY29tIiwibG9jYXRpb24iOiJoMSIsInByb29mIjp7Imp3cyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJa2RRTFhWNVFUaHZZbEJyY2xVMlMzTmhkbDh3T1ZaQ2NsWkZPSFZqV0ZkUGRGYzBPR1IzTmxZMGNsa2lMQ0ppTmpRaU9tWmhiSE5sTENKamNtbDBJanBiSW1JMk5DSmRmUS4ueDcxemxFSmk4cWkxNUtFRTQycm0wY3c3bWEwa0VJemtETUtwTk5DSmtVT2EyQ1hxbXJZclJzdTA4WWppVWk4cERSSmdwdG45NUdlMkM1Qi1uRHlQNHcifX1dfSwiaXNzIjoib3ByZGV2Lmhlcm9rdWFwcC5jb20iLCJzdWIiOiJodHRwczovL29wcmRldi5oZXJva3VhcHAuY29tIiwiaWF0IjoxNjg0MTI1MTg3LCJleHAiOjE3MTU3NDc1ODd9.j5vtZ3dHDm7B5ZWx2fsf0WW2JHouuwpZSP1Dq9QELLVSRCJngoibCjwfCMfYfcZS8MGsFb2g4kdUWfehK1M9Nw"
  ]
}
```

`profile` プロパティの JWT をデコードして、組織の身元または出版物を取得します。

:::note

JWT のデコードを伴わない Originator Profile と Document Profile の区別や、あるドメインでの絞り込みなど、最適化の余地はありますがそういった仕様はまだありません。

:::

### Originator Profile の検証

Originator Profile の検証は次のようにして行われます。

```mermaid
sequenceDiagram
actor 検証者
participant Web サーバー
participant Originator Profile レジストリサーバー

検証者->>Web サーバー: GET /.well-known/ps.json
Web サーバー-->>検証者: Profile Set

検証者->>検証者: Profile Set から Signed Originator Profile を抽出

検証者->>Originator Profile レジストリサーバー: GET /.well-known/jwks.json
Originator Profile レジストリサーバー-->>検証者: Originator Profile 発行者の公開鍵

検証者->>検証者: Signed Originator Profile の署名を検証
```

1. 組織の識別子の先頭に `https://`、末尾に `/.well-known/ps.json` を加えた URL にアクセスし Profile Set を取得
2. Profile Set の `profile` プロパティに含まれる JWT をデコードして、組織の識別子と `sub` クレームの文字列が一致するものを絞り込み、Signed Originator Profile を抽出
3. その `iss` クレームによって表明される認証機関の識別子の先頭に`https://`、末尾に `/.well-known/jwks.json` を加えた URL にアクセスして公開鍵を取得
4. Signed Originator Profile の署名を検証

### Document Profile の検証

Document Profile の検証は次のようにして行われます。

```mermaid
sequenceDiagram
actor 検証者
participant Web サーバー

検証者->>Web サーバー: GET /index.html
Web サーバー-->>検証者: HTML 文書

検証者->>Web サーバー: GET /ps.json
Web サーバー-->>検証者: Profile Set

検証者->>検証者: Profile Set から Signed Originator Profile を抽出

検証者->>Originator Profile レジストリサーバー: GET /.well-known/jwks.json
Originator Profile レジストリサーバー-->>検証者: Originator Profile 発行者の公開鍵

検証者->>検証者: Signed Originator Profile の署名を検証
検証者->>検証者: Signed Document Profile を抽出
検証者->>検証者: Signed Document Profile の署名を検証
```

1. HTML 文書の中に含まれる `<script>` 要素または `<link>` 要素によって表明された URL にアクセスし Profile Set を取得
2. Originator Profile を検証
3. Profile Set の `profile` プロパティの中から Signed Document Profile を抽出
4. Signed Document Profile の署名を検証

:::note

HTML 文書全体や Web サイト全体への付帯情報を表現する仕様は未定義です。

- [ページ全体の付帯情報を表現する仕様の検討](https://github.com/webdino/profile/issues/353)
- [サイトの付帯情報を表現する仕様の検討](https://github.com/webdino/profile/issues/613)

:::

### `profile` プロパティ

複数の組織の身元またはその組織の主要な出版物を表明するためのプロパティです。
必ず文字列形式の JWT でなければなりません。

### `main` プロパティ

主要な出版物を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

### `publisher` プロパティ

出版者を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

### `advertiser` プロパティ

広告主を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

### Profile Set の分割

Profile Set は HTML の中に `<script>` 要素や `<link>` 要素などを複数記述することによって分割することが可能です。
このとき、JSON-LD ドキュメントは、複数のノードオブジェクトで構成される配列形式で表現されます。
配列は順番に処理され、各ノードオブジェクトの定義されたプロパティは結合して 1 つの Profile Set として扱われます。

### Signed Originator Profile

メディア・広告などに関わる組織の身元を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名します。
必ず `op` クレームを含めなければなりません。
必ず Profile Set には署名した組織の Signed Originator Profile を含めなければなりません (MUST)。

### Signed Document Profile

出版物を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名します。
必ず `dp` クレームを含めなければなりません。

### `iss` (Issuer) クレーム

`iss` クレームは、認証機関・組織の識別子です。
Signed Document Profile ならば、必ずその組織の Signed Originator Profile の `sub` クレームの文字列と一致する必要があります。

### `sub` (Subject) クレーム

`sub` クレームは、メディア・広告などに関わる組織の識別子またはその組織の出版物の識別子です。

### `op` (Originator Profile) クレーム

組織の身元の詳細と認証機関によって報告されたその組織の資格情報を表すためのオブジェクトです。
クレーム名は IANA JSON Web トークンクレームレジストリに登録されていないので、耐衝突性を持つ名前空間を含むことに注意してください。

例:

```json
{
  "iss": "example.org",
  "sub": "example.com",
  "https://originator-profile.org/op": {
    "item": [
      {
        "type": "holder",
        "name": "Example Domain"
      },
      {
        "type": "credential",
        "name": "Example Certification"
      },
      {
        "type": "certifier",
        "name": "Example Certifier"
      }
    ],
    "jwks": {
      "keys": [
        {
          "kty": "RSA",
          "e": "AQAB",
          "use": "sig",
          "kid": "4XfatnjjDE7ix1RNDvpz2KZ1GP-Avcx0afQgEymm9aA",
          "alg": "RS256",
          "n": "izAtcsrL3iaVHLXgCCOh4avxUr6fjbsksq-P-MgLxUFBAjvrINVZi5rcEFk6EvfWEQ8m2ZWr8bt2m0XCaqakhHOQeyU8m28GtE5NML5wJdHWMZcb2hWpvzDDPwC8ATsIaZad1iXNC_9_36afGhlB67v-gRoVPM4solN7gv2kXWbxqsZ1ra2cG9786ubhNtz130Ytix0RytYK3WIWk6Y_VQ8lgPnd7OPmiv-wNd1S4hqS5OEMHOirho8qrOp8bhmcI974WB8UDZ_p1fGEujSeB9XZZOJzC0qWzFFd69PKl-Bs8tRbJY6MoOa6oSGqq-0pjAUBimCQjV9SA5DuurdVmw"
        }
      ]
    }
  }
}
```

### `op` クレームの `item` プロパティ

下記のオブジェクトの集合です。

- `holder` 型
- `credential` 型
- `certifier` 型

### `dp` (Document Profile) クレーム

出版物の詳細を表します。
クレーム名は IANA JSON Web トークンクレームレジストリに登録されていないので、耐衝突性を持つ名前空間を含むことに注意してください。

例:

```json
{
  "iss": "example.com",
  "sub": "78550fa7-f846-4e0f-ad5c-8d34461cb95b",
  "https://originator-profile.org/dp": {
    "item": [
      {
        "type": "visibleText",
        "url": "https://example.com/article/42",
        "location": "h1[itemprop='headline']",
        "proof": {
          "jws": "eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..0rtsrVk5MGzQx-Lvf6y-0i74Wx3n7gExd7QLCTDMbuU"
        }
      }
    ]
  }
}
```

### `jwks` プロパティ

Signed Document Profile のためのプロパティです。

### `dp` クレームの `item` プロパティ

下記のオブジェクトの集合です。

- `visibleText` 型
- `text` 型
- `html` 型

## `holder` 型

メディア・広告などに関わる組織の身元を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `holder` でなければなりません。

## `credential` 型

認証機関によって報告された資格情報を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `credential` でなければなりません。

## `certifier` 型

認証機関の身元を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `certifier` でなければなりません。

## `visibleText` 型

対象の要素のその子孫のレンダリングされたテキストの内容への署名を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `visibleText` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。対象の要素は、そのページの `document` のルート要素 (例えば、 HTML 文書の場合は `<html>` 要素) から、`querySelectorAll()` メソッドを使用して検索します。値が未定義の場合は、そのページの `document` のルート要素 (例えば、HTML 文書の場合は `<html>` 要素) を対象の要素とみなします。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

### `visibleText` 型における署名

1. `url` プロパティの URL と `location` プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素の `innerText` 属性を使用し `DOMString` として対象を取得します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果への署名を行います。

## `text` 型

対象の要素の子孫のテキストへの署名を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `text` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。対象の要素は、そのページの `document` のルート要素 (例えば、 HTML 文書の場合は `<html>` 要素) から、`querySelectorAll()` メソッドを使用して検索します。値が未定義の場合は、そのページの `document` のルート要素 (例えば、HTML 文書の場合は `<html>` 要素) を対象の要素とみなします。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

### `text` 型における署名

1. `url` プロパティの URL と `location` プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素の `textContent` 属性を使用し `DOMString` として対象を取得します。もし仮に `null` が得られた場合は、その対象を空の文字列に変換します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果への署名を行います。

## `html` 型

対象の要素とその子孫を含む部分を HTML としてシリアライズしたものへの署名を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `html` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。対象の要素は、そのページの `document` のルート要素 (例えば、 HTML 文書の場合は `<html>` 要素) から、`querySelectorAll()` メソッドを使用して検索します。値が未定義の場合は、そのページの `document` のルート要素 (例えば、HTML 文書の場合は `<html>` 要素) を対象の要素とみなします。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

### `html` 型における署名

1. `url` プロパティの URL と `location` プロパティの CSS セレクターで指定した要素を検索します。
2. それらの要素の `outerHTML` 属性を使用し `DOMString` として対象を取得します。もし仮に要素が UTF-8 ではない場合、[WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) に準拠した方法によって符号化します。
3. すべての対象を UTF-8 に符号化します。もし仮に対象が複数存在する場合は、それらの内容を結合します。
4. その結果への署名を行います。

## 鍵

複数の JSON Web Key (JWK) からなる JWK Set Format として表現されます。
JWT `iss` クレームによって表明される認証機関の識別子の先頭に`https://`、末尾に `/.well-known/jwks.json` を加えた URL に必ずアクセスできなければなりません。
Signed Document Profile ならば、その組織の Signed Originator Profile の `op` クレームの中の `jwks` プロパティとして持つ必要があります。

:::note

鍵の参照方法に URL と `op` クレームの 2 種類が存在する背景として、当初 Document Profile レジストリはドメインを持たない懸念がありました。そのため、DNS を利用しない手段として `op` クレームから鍵を参照する仕様が定義されました。この仕様には、次に挙げられるメリットがあります。

- ドメイン名の名前解決の信頼性に依らず真正性が担保される
- ドメインの連絡先情報等へのアクセスが生じず秘匿性がある

一方で次に挙げられるデメリットがあり、将来的に `op` クレームから鍵を参照する仕様については廃止することが検討されています。

- Signed Document Profile 発行組織のドメイン名による認証がされず、Originator Profile レジストリによってのみ真正性が担保される
- キーローテーションに Signed Originator Profile 再発行が必要

:::

## HTML

HTML では、`<script>` 要素を使用する内部的な表現と `<link>` 要素を使用する外部的な表現の 2 通りあります。
いずれも MIME タイプ `application/ld+json` である必要があります。

### &lt;script&gt;

`<script>` 要素の `type` 属性として `application/ld+json` を指定し、Profile Set を記述します。

例:

```html
<script type="application/ld+json">
  {
    "@context": "https://originator-profile.org/context.jsonld",
    "main": ["https://example.org"],
    "profile": [
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8"
    ]
  }
</script>
```

Signed Document Profile の場合、署名の際に `location` として含まれる要素にを対象にこの `<script>` 要素を含めてはいけません。その場合、必ず `<link>` 要素または Well-Known URL の使用によって代替してください。

### &lt;link&gt;

`<link>` 要素の `rel` 属性として `alternate`、`type` 属性として `application/ld+json` を指定し、`href` 属性として Profile Set の URL を記述します。

例:

```html
<link
  href="https://example.com/ps.json"
  rel="alternate"
  type="application/ld+json"
/>
```

## Well-Known URL

### `ps.json`

組織の身元を表明にするためのエンドポイントです。
組織の識別子の先頭に `https://`、末尾に `/.well-known/ps.json` を加えた URL に必ずアクセスできなければなりません (MUST)。

# 仕様

## データモデル

![model](assets/model.dio.png)

- 発行者(たとえば、認証機構)は、検証可能な資格情報を生成します。
- 所有者(たとえば、メディア・広告などに関わる組織)は、資格情報を保存し、提供します。
- 検証者は、所有者から資格情報を受け取り、適切に署名されていることを検証します。

## Originator Profile データモデル

メディア・広告などに関わる組織の身元を表明し検証可能にするためのモデルです。
Originator Profile Document によって記述します。

![op-model](assets/op-model.dio.png)

- 認証機構の識別子は、Originator Profile の発行者を表す一義的な識別子です。
- 組織の身元は、法的な責任を負う企業や公的機関の身元(たとえば、名称や連絡先など)を表明するオブジェクトです。
- 署名と鍵は、認証機構によって付与され、Originator Profile を検証するために使用されるデータです。

### Originator Profile Document

メディア・広告などに関わる組織の身元を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名され、それらの集合を JSON-LD によって表現します。

例:

```json
{
  "@context": "https://github.com/webdino/profile",
  "main": ["https://example.org"],
  "profile": [
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8"
  ]
}
```

`profile` プロパティの JWT をデコードして、組織の身元を取得します。

### `profile` プロパティ

複数の組織の身元またはその組織の主要な出版物を表明するためのプロパティです。
必ず文字列形式の JWT でなければなりません。

### `main` プロパティ

主要な組織の身元またはその組織の主要な出版物を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

### `publisher` プロパティ

出版者を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

### `advertiser` プロパティ

広告主を表明するためのプロパティです。
必ず `profile` プロパティの JWT をデコードして得られる `sub` クレームの文字列のいずれかでなければなりません。

## Document Profile データモデル

メディア・広告などの出版物を検証可能にするためのモデルです。
Document Profile Document によって記述します。

![dp-model](assets/dp-model.dio.png)

- 組織の識別子は、Document Profile の発行者を表す一義的な識別子です。
- 出版物は、組織の主要な出版物を表明するオブジェクトです。
- 署名と鍵は、組織とその組織の Originator Profile によって与えられ、Document Profile を検証するために使用されるデータです。

### Document Profile Document

メディア・広告などに関わる組織の身元を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名され、それらの集合を JSON-LD によって表現します。
必ずその組織の Originator Profile Document を含めなければなりません。

例:

```json
{
  "@context": "https://github.com/webdino/profile",
  "main": ["https://example.org", "https://example.org/article/42"],
  "profile": [
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8"
  ]
}
```

`profile` プロパティの JWT をデコードして、組織の身元をまたは出版物を取得します。

## JWT

組織の身元のデータ表現です。

### `iss` (Issuer) クレーム

`iss` クレームは、認証機構または組織を表す一義的な識別子です。
必ず https スキームの URL でなければなりません。
Document Profile Document ならば、必ずその組織の Originator Profile Document の `sub` クレームの文字列と一致する必要があります。

### `sub` (Subject) クレーム

`sub` クレームは、メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表す一義的な識別子です。
必ず URI でなければなりません。
たとえば、その組織を代表する Web サイトの URL を記述します。

### `op` (Originator Profile) クレーム

組織の身元の詳細と認証機構によって報告されたその組織の資格情報を表すためのオブジェクトです。
クレーム名は IANA JSON Web トークンクレームレジストリに登録されていないので、耐衝突性を持つ名前空間を含むことに注意してください。

例:

```json
{
  "iss": "https://opr.webdino.org",
  "sub": "https://example.org",
  "https://opr.webdino.org/jwt/claims/op": {
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
  "iss": "https://example.org",
  "https://opr.webdino.org/jwt/claims/dp": {
    "item": [
      {
        "type": "visibleText",
        "url": "https://example.org/article/42",
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

Document Profile Document のためのプロパティです。

### `dp` クレームの `item` プロパティ

下記のオブジェクトの集合です。

- `visibleText` 型
- `text` 型
- `html` 型

## `holder` 型

メディア・広告などに関わる組織の身元を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `holder` でなければなりません。

## `credential` 型

認証機構によって報告された資格情報を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `credential` でなければなりません。

## `certifier` 型

認証機構の身元を表すオブジェクトです。

- `type` プロパティは、必ず文字列 `certifier` でなければなりません。

## `visibleText` 型

対象の要素のその子孫のレンダリングされたテキストの内容への署名を表すオブジェクトです。
対象の要素は `url` プロパティの URL と `location` プロパティの CSS セレクターで指定します。
シリアライズする際に対象の要素が複数存在する場合、それらを結合します。

- `type` プロパティは、必ず文字列 `visibleText` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

## `text` 型

対象の要素の子孫のテキストへの署名を表すオブジェクトです。
対象の要素は `url` プロパティの URL と `location` プロパティの CSS セレクターで指定します。
シリアライズする際に対象の要素が複数存在する場合、それらを結合します。

- `type` プロパティは、必ず文字列 `text` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

## `html` 型

対象の要素とその子孫を含む部分を HTML としてシリアライズしたものへの署名を表すオブジェクトです。
対象の要素は `url` プロパティの URL と `location` プロパティの CSS セレクターで指定します。
シリアライズする際に対象の要素が複数存在する場合、それらを結合します。

- `type` プロパティは、必ず文字列 `html` でなければなりません。
- `url` プロパティは、対象の要素が存在するページの URL です。
- `location` プロパティは、対象の要素の場所を特定する CSS セレクターです。
- `proof` プロパティは、対象のテキストへの署名を表すオブジェクトです。そのオブジェクトには必ず `jws` プロパティを持たなければなりません。その `jws` プロパティは必ず Detached JSON Web Signature として表現したシリアライズされたテキストの署名でなければなりません。

## 鍵

複数の JSON Web Key (JWK) からなる JWK Set Format として表現されます。
JWT `iss` クレームによって表明される認証機構の識別子の末尾に `/.well-known/jwks.json` を加えた URL に必ずアクセスできなければなりません。
Document Profile Document ならば、その組織の Originator Profile Document の `op` クレームの中の `jwks` プロパティとして持つ必要があります。

## HTML

HTML では、`<script>` 要素を使用する内部的な表現と `<link>` 要素を使用する外部的な表現の 2 通りあります。
いずれも MIME タイプ `application/ld+json` である必要があります。

### &lt;script&gt;

`<script>` 要素の `type` 属性として `application/ld+json` を指定し、Originator Profile Document を記述します。

例:

```html
<script type="application/ld+json">
  {
    "@context": "https://github.com/webdino/profile",
    "main": ["https://example.org"],
    "profile": [
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8"
    ]
  }
</script>
```

### &lt;link&gt;

`<link>` 要素の `rel` 属性として `alternate`、`type` 属性として `application/ld+json` を指定し、`href` 属性として Originator Profile Document の URL を記述します。

例:

```html
<link
  href="https://example.com/.well-known/op-document"
  rel="alternate"
  type="application/ld+json"
/>
```

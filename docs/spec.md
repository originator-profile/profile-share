---
sidebar_position: 1
---

# 仕様

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

## Profiles Set

メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名され、それらの集合を JSON-LD によって表現します。
必ず Signed Document Profile と共にその Signed Document Profile を発行した組織の Signed Originator Profile を含めなければなりません。

例:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "main": ["https://example.org/article/42"],
  "profile": [
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8"
  ]
}
```

`profile` プロパティの JWT をデコードして、組織の身元をまたは出版物を取得します。

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

### Signed Originator Profile

メディア・広告などに関わる組織の身元を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名します。
必ず `op` クレームを含めなければなりません。

### Signed Document Profile

出版物を表明し検証可能にするためのデータ表現です。
JSON Web Token (JWT) として署名します。
必ず `dp` クレームを含めなければなりません。

### `iss` (Issuer) クレーム

`iss` クレームは、認証機関または組織を表す一義的な識別子です。
特別な理由がない限り、その認証機関または組織の保有するドメイン名であるべきです。
Signed Document Profile ならば、必ずその組織の Signed Originator Profile の `sub` クレームの文字列と一致する必要があります。

### `sub` (Subject) クレーム

`sub` クレームは、メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表す一義的な識別子です。

### `op` (Originator Profile) クレーム

組織の身元の詳細と認証機関によって報告されたその組織の資格情報を表すためのオブジェクトです。
クレーム名は IANA JSON Web トークンクレームレジストリに登録されていないので、耐衝突性を持つ名前空間を含むことに注意してください。

例:

```json
{
  "iss": "example.org",
  "sub": "example.com",
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
  "iss": "example.com",
  "https://opr.webdino.org/jwt/claims/dp": {
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

## HTML

HTML では、`<script>` 要素を使用する内部的な表現と `<link>` 要素を使用する外部的な表現の 2 通りあります。
いずれも MIME タイプ `application/ld+json` である必要があります。

### &lt;script&gt;

`<script>` 要素の `type` 属性として `application/ld+json` を指定し、Profiles Set を記述します。

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

`<link>` 要素の `rel` 属性として `alternate`、`type` 属性として `application/ld+json` を指定し、`href` 属性として Profiles Set の URL を記述します。

例:

```html
<link
  href="https://example.com/.well-known/ps.json"
  rel="alternate"
  type="application/ld+json"
/>
```

## Well-Known URL

HTML に Profiles Set が記述されていない場合、対象のページの URL のパス `/.well-known/ps.json` に配置できます。
この Well-Known URL は対象のページと同一オリジンで、かつ HTTP(S) GET によってアクセスし Signed Originator Profile を取得できる必要があります。

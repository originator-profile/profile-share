Content Attestation を登録・更新するためのエンドポイントです。必要なパラメータをリクエストのボディに付与して POST メソッドを送ることで登録できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/ca \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H content-type:application/json \
    -d '{...}'
```

このエンドポイントは更新にも使用します。
既に Content Attestation (CA) が登録されている場合、既存の CA を更新します。

プロパティの詳細については [Content Attestation of Article Type Implementation Guidelines](https://docs.originator-profile.org/rfc/ca-guide/article/) と [Content Attestation of Online Ad Type Implementation Guidelines](https://docs.originator-profile.org/rfc/ca-guide/online-ad/) をご確認ください。

### `digestSRI`

リクエストボディの `image.digestSRI` には、画像の [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) ハッシュ値を指定します。

```json
{
  "image": {
    "id": "https://example.com/image.webp",
    "digestSRI": "sha256-xxx"
  }
}
```

#### `digestSRI` の省略

リクエストボディの `image.digestSRI` が省略された場合、`id` プロパティをもとに `digestSRI` が計算されます。

例:

```json
{
  "image": {
    "id": "https://example.com/image.webp"
  }
}
```

↓

```json
{
  "image": {
    "id": "https://example.com/image.webp",
    "digestSRI": "sha256-xxx"
  }
}
```

### `integrity`

リクエストボディの `target[].integrity` には、コンテンツの [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) ハッシュ値を指定します。

例えば検証対象のコンテンツがHTML要素の場合、以下の選択肢があります:

- `type` に準じたテキストのハッシュ値を事前に計算し `integrity` に指定
- CSS セレクター (`cssSelector` プロパティ) に一致する要素が存在する<ruby>整形式<rt>well-formed</rt></ruby> HTML を指定
  - HTML 文書全体を `content` プロパティに指定
  - アクセス可能な文書のURLを `content` プロパティに指定

例:

```json
{
  "target": [
    {
      "type": "HtmlTargetIntegrity",
      "cssSelector": "<CSS セレクター>",
      "integrity": "sha256-GtNUUolQVlwIkQU9JknWkwkhfdiVmHr/BOnLFFHC5jI="
    },
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-6o+sfGX7WJsNU1YPUlH3T56bJDR43Laz6nm142RJyNk="
    }
  ]
}
```

#### `integrity` の省略

リクエストボディの `target[].integrity` が省略された場合、`type` に準じて `content` をもとに `integrity` が計算されます。

`content` プロパティはいくつかの形式に対応しています:

- HTML … HTML 文書全体を `content` プロパティに指定
- URL … アクセス可能な文書のURL (`https:` や `data:` など含む) を `content` プロパティに指定

例:

```json
{
  "target": [
    {
      "type": "HtmlTargetIntegrity",
      "cssSelector": "<CSS セレクター>",
      "content": "<!doctype html><html><head>...</head><body>...</body></html>"
    }
  ]
}
```

↓

```json
{
  "target": [
    {
      "type": "HtmlTargetIntegrity",
      "cssSelector": "<CSS セレクター>",
      "integrity": "sha256-GtNUUolQVlwIkQU9JknWkwkhfdiVmHr/BOnLFFHC5jI="
    }
  ]
}
```

`cssSelector` プロパティの内容に準じて計算します (`integrity` が省略された場合)。

非公開コンテンツの場合:

例:

```json
{
  "target": [
    {
      "type": "ExternalResourceTargetIntegrity",
      "content": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=="
    }
  ]
}
```

↓

```json
{
  "target": [
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-jZtLeUr/xdr06voS4MYpSrMaru0zCIYUVna9a4Mui5g="
    }
  ]
}
```

`data:` URL をデコードして得られるバイト列をもとに計算します (`integrity` が省略された場合)。

公開済みコンテンツの場合:

例:

```json
{
  "target": [
    {
      "type": "ExternalResourceTargetIntegrity",
      "content": "https://example.com/image.webp"
    }
  ]
}
```

↓

```json
{
  "target": [
    {
      "type": "ExternalResourceTargetIntegrity",
      "integrity": "sha256-6o+sfGX7WJsNU1YPUlH3T56bJDR43Laz6nm142RJyNk="
    }
  ]
}
```

fetch API での HTTP GET リクエストによってアクセスして得られるバイト列をもとに計算します (`integrity` が省略された場合)。

### 発行日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、リクエスト時点の日時が発行日時だとみなされます。

### 期限切れ日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、発行日時の 1 年後が期限切れ日時だとみなされます。

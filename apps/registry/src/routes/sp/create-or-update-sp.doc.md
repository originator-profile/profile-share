Site Profile (SP) を登録・更新するためのエンドポイントです。必要なパラメータをリクエストのボディに付与して POST メソッドを送ることで登録できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/sp \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H content-type:application/json \
    -d '{...}'
```

このエンドポイントは更新にも使用します。
既に Site Profile (SP) が登録されている場合、既存の SP を更新します。

プロパティの詳細については [Website Profile (WSP) Data Model](https://docs.originator-profile.org/rfc/website-profile/) と [Site Profile (SP)](https://docs.originator-profile.org/rfc/site-profile/) をご確認ください。

### `digestSRI`

リクエストボディの `image.digestSRI` には、画像の [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) ハッシュ値を指定します。

```json
{
  "image": {
    "id": "https://example.com/image.webp",
    "digestSRI": "sha256-6o+sfGX7WJsNU1YPUlH3T56bJDR43Laz6nm142RJyNk="
  }
}
```

#### `digestSRI` の省略

リクエストボディの `image.digestSRI` が省略された場合、`content` にアクセスし `digestSRI` を計算します。
`content` プロパティが存在しない場合、`id` にアクセスし `digestSRI` 計算します。

非公開コンテンツの場合:

例:

```json
{
  "image": {
    "id": "https://example.com/image.svg",
    "content": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=="
  }
}
```

↓

```json
{
  "image": {
    "id": "https://example.com/image.svg",
    "digestSRI": "sha256-jZtLeUr/xdr06voS4MYpSrMaru0zCIYUVna9a4Mui5g="
  }
}
```

`data:` URL をデコードして得られるバイト列をもとに計算します (`integrity` が省略された場合)。

公開済みコンテンツの場合:

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
    "digestSRI": "sha256-6o+sfGX7WJsNU1YPUlH3T56bJDR43Laz6nm142RJyNk="
  }
}
```

fetch API での HTTP GET リクエストによってアクセスして得られるバイト列をもとに計算します (`integrity` が省略された場合)。

### Originator Profile Set (OPS)

リクエストボディに `originators` プロパティを含め、必ず Originator Profile Set (OPS) を含める必要があります (MUST)。

### 発行日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、リクエスト時点の日時が発行日時だとみなされます。

### 期限切れ日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、発行日時の 1 年後が期限切れ日時だとみなされます。

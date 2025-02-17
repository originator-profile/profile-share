Website Profile (WSP) を登録・更新するためのエンドポイントです。必要なパラメータをリクエストのボディに付与して POST メソッドを送ることで登録できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/wsp \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H content-type:application/json \
    -d '{...}'
```

このエンドポイントは更新にも使用します。
既に Website Profile (WSP) が登録されている場合、既存の WSP を更新します。

プロパティの詳細については [Website Profile (WSP) Data Model](https://docs.originator-profile.org/rfc/website-profile/) をご確認ください。

### `digestSRI` の計算

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

### 発行日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、リクエスト時点の日時が発行日時だとみなされます。

### 期限切れ日時

[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式で指定します。指定しない場合、発行日時の 1 年後が期限切れ日時だとみなされます。

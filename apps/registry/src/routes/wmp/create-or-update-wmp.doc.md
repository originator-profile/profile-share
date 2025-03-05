Web Media Profile (WMP) を登録・更新するためのエンドポイントです。必要なパラメータをリクエストのボディに付与して POST メソッドを送ることで登録できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/wmp \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H content-type:application/json \
    -d '{...}'
```

このエンドポイントは更新にも使用します。
既に Web Media Profile (WMP) が登録されている場合、既存の WMP を更新します。

プロパティの詳細については [Web Media Profile (WMP) Data Model](https://docs.originator-profile.org/rfc/web-media-profile/) をご確認ください。

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

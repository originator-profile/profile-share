Content Attestation Set を削除するためのエンドポイントです。必要なパラメータをリクエストクエリーに付与して DELETE メソッドを送ることで削除できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X DELETE https://dprexpt.originator-profile.org/cas?id=urn:uuid:1d45253a-4c4b-4f68-863c-077e24245532 \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8
```

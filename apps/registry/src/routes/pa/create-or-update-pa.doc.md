Profile Annotation (PA) を登録・更新するためのエンドポイントです。必要なパラメータをリクエストのボディに付与して POST メソッドを送ることで登録できます。

このエンドポイントは Basic 認証による認証が必要です。必要な認証情報はサーバー管理者から受け取ってください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/pa \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H content-type:application/json \
    -d '{...}'
```

このエンドポイントは更新にも使用します。
既に Profile Annotation (PA) が登録されている場合、既存の PA を更新します。

プロパティの詳細については [Profile Annotation (PA) Data Model](https://docs.originator-profile.org/rfc/pa/) および [Existence Certificate in Japan Implementation Guidelines](https://docs.originator-profile.org/rfc/pa-guide/existence/) をご確認ください。

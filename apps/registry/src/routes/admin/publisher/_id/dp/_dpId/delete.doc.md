署名付き DP (SDP) を削除するためのエンドポイントです。クエリパラメータ、ボディパラメータは不要です。

このエンドポイントは呼び出しに Basic 認証による認証が必要です。必要な認証情報は CIP から受け取ってください。受け取った認証情報は Basic 認証及び、このエンドポイントの URL の中の `{id}` で使用します。

リクエスト例:

```shell
curl -X DELETE https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/dp/040a260d-b677-4f6f-9fb8-f1d4c990825c \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8
```

上記の例では CIP から受け取った認証情報が `8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8` だとしています。

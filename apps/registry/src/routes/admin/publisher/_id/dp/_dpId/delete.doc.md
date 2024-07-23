署名付き DP (SDP) を削除するためのエンドポイントです。クエリパラメータ、ボディパラメータは不要です。

リクエスト例:

```shell
curl -X DELETE https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/dp/040a260d-b677-4f6f-9fb8-f1d4c990825c \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8
```

このエンドポイントは呼び出しに Basic 認証による認証が必要です。必要な認証情報は CIP から受け取ってください。
エンドポイントの URL にはアカウントID `8fe1b860-558c-5107-a9af-21c376a6a27c` と削除したい SDP の DP ID `41632705-9600-49df-b80d-a357d474f37e`を指定します。また、`-u` オプションで上記アカウント ID とパスワードを `:` で連結した値を Basic 認証の認証情報として利用するようにしています。
ここでは CIP から受け取った認証情報が `8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8` だとしています。

レジストリに登録済みの Profile Set を取得するためのエンドポイントです。クエリパラメータ `url` を付与して、 GET リクエストを送ってください。 `url` には、記事の URL を指定してください。記事に紐づいた Profile Set が返ってきます。`url` は RFC 3986 の形式でエンコーディングしてください（通常のクエリパラメータのエンコーディング方式です）。[シリアライズの結果が等しい](https://url.spec.whatwg.org/#url-equivalence) URL の SDP が Profile Set として取得できます。

このエンドポイントは認証不要であり、記事を閲覧した全てのユーザーが Profile Set を取得・検証することができます。

リクエスト例:

```shell
curl https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F
```

上記の例は、curl コマンドで DP レジストリ (`dprexpt.originator-profile.org`) のエンドポイントに　 GET リクエストを送っています。
`url` クエリパラメータに `https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F` を付与し、 `https://media.example.com/2023/06/hello/` に紐づく Profile Set の取得を要求します。

このファイルには指定された記事の URL に対して登録した SDP およびその SDP の発行元組織の SOP が含まれます。ブラウザではそれらの署名を検証し、閲覧中の URL と一致する（[シリアライズの結果が等しい](https://url.spec.whatwg.org/#url-equivalence)）ことを確認の上で画面に表示します。

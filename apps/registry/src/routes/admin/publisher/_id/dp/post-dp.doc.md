コンテンツに対する署名付き DP (SDP) を DP レジストリに登録するためのエンドポイントです。必要なパラメータをリクエストのボディー部に付与して POST メソッドを送ることで登録ができます。パラメータは JSON 形式で与えてください。

このエンドポイントは、呼び出しに Basic 認証による認証が必要です。必要な認証情報は CIP から受け取ってください。受け取った認証情報は、Basic 認証及び、このエンドポイントの URL の中の `{id}` で使用します。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/dp/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ"}'
```

上記の例は、 curl コマンドで DP レジストリ (`dprexpt.originator-profile.org`) の DP 登録エンドポイントへ POST リクエストを送っています。

CIP から受け取った認証情報が `8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8` だとしています。

エンドポイントの URL は、アカウント ID を入れて `https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/dp/` とし、 `-u` オプションで上記アカウント ID とパスワードを `:` で連結した値を Basic 認証の認証情報として利用するようにしています。

`-d` オプションでパラメータを指定しています。パラメータはリクエストのボディ部に JSON 形式で渡されます。このエンドポイントが受け付けるパラメータは `jwt` だけです。このパラメータにコンテンツに対する署名付き DP (SDP) を与えてください。以下は例です。

```json
{
  "jwt": "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ"
}
```

上記のリクエストに対する成功レスポンスは次のようになります。

レスポンス例（見やすく整形しています）:

```json
{
  "id": "00f470eb-eafd-4a38-854c-fbb6968a159e",
  "url": "https://media.example.com/articles/hello-world/",
  "accountId": "8fe1b860-558c-5107-a9af-21c376a6a27c",
  "title": null,
  "image": null,
  "description": null,
  "author": null,
  "editor": null,
  "datePublished": null,
  "dateModified": null,
  "location": ".wp-block-post-content",
  "bodyFormatValue": "text",
  "proofJws": "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..osWwJEO-TY48YBWQ0HQaQ4pfNZoTdKVgu5bP_mUEmmF4z00lazVdr1eL_wuLAMz7f2-wO8QZv8kWPITq5C-o4g",
  "categories": []
}
```

レスポンスの中の一部の値は、 `jwt` パラメータの中のクレームになっています。
`id` は `jwt` のペイロードの `sub` クレームの値に、 `url`, `location`, `proofJws` は `dp` クレームの `item` プロパティの中の値から取られています。この `url` の値は Profile Set を取得するもう一方のエンドポイントで使用します。

`accountId` はエンドポイントの URL 内のアカウントIDの値です。

`image` プロパティを指定することで画像を拡張機能に表示することができます。詳細は [画像の表示](/media-study-202307/image/) を参照してください。

このエンドポイントは、記事新規作成時だけでなく、記事更新時に SDP を修正したいときにも使用することができます。
登録する SDP と id の等しい SDP がすでに DP レジストリに存在する場合には、既存の SDP を上書き更新します。そのため、 SDP 修正時もこのエンドポイントを利用して SDP の更新ができます。

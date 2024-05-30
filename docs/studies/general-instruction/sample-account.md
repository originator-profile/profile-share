---
sidebar_position: 1
---

# 試験用レジストリアカウント情報

[Originator Profile 技術研究組合 (OP CIP)](https://originator-profile.org/) 提供 DP Store では、試用のために下記のアカウント情報が登録されています。
このアカウント情報を使って実際に API を確認することもできます。

試験用 OP ID

```
media.example.com
```

試験用アカウント ID

```
8fe1b860-558c-5107-a9af-21c376a6a27c
```

試験用 API 認証情報 (**本実験以外では決して使用しないでください**)

```
8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8
```

試験用鍵ペア (**本実験以外では決して使用しないでください**)

プライベート鍵（ JWK 形式）

```json
{
  "kty": "EC",
  "kid": "D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE",
  "x": "2OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg",
  "y": "f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM",
  "crv": "P-256",
  "d": "ahNz8S20FnuMaFezOGlfQwBN5-rem8AnKvtHGDqOpHk"
}
```

プライベート鍵（PKCS#8 形式）

```pem
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgahNz8S20FnuMaFez
OGlfQwBN5+rem8AnKvtHGDqOpHmhRANCAATY4qaq5Q+KaSyGQlBZaKH77O75TU2Q
OwoiZb+jeRt46H/W4HjB/6i0uS7zsnN3R6CmCZlX7rRDPVa29lnhHprT
-----END PRIVATE KEY-----
```

公開鍵

```json
{
  "kty": "EC",
  "kid": "D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE",
  "x": "2OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg",
  "y": "f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM",
  "crv": "P-256"
}
```

試験用アカウントの詳細

```json
{
  "id": "8fe1b860-558c-5107-a9af-21c376a6a27c",
  "domainName": "media.example.com",
  "url": "https://media.example.com/",
  "roleValue": "group",
  "name": "会員 (試験用)",
  "description": null,
  "email": null,
  "phoneNumber": null,
  "postalCode": "100-0000",
  "addressCountry": "JP",
  "addressRegion": "東京都",
  "addressLocality": "千代田区",
  "streetAddress": "",
  "contactTitle": null,
  "contactUrl": null,
  "privacyPolicyTitle": null,
  "privacyPolicyUrl": null,
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null
}
```

SOP の例

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNlcnRpZmllciIsImRvbWFpbk5hbWUiOiJvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119LHsidHlwZSI6ImhvbGRlciIsImRvbWFpbk5hbWUiOiJtZWRpYS5leGFtcGxlLmNvbSIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vIiwibmFtZSI6IuS8muWToSAo6Kmm6aiT55SoKSIsInBvc3RhbENvZGUiOiIxMDAtMDAwMCIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Y2D5Luj55Sw5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IiIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiMk9LbXF1VVBpbWtzaGtKUVdXaWgtLXp1LVUxTmtEc0tJbVdfbzNrYmVPZyIsInkiOiJmOWJnZU1IX3FMUzVMdk95YzNkSG9LWUptVmZ1dEVNOVZyYjJXZUVlbXRNIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJENUQ1UDNVclYxVl82VV9xOXlLdl9qWl9xOFNoSXZyeHk3RTJReU9mV1lFIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoibWVkaWEuZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg1MzczMTcsImV4cCI6MTcyMDE1OTcxN30.HmflTdUnbgLKpXbbCtO6eV4nR6Ncttlv_4sCJUsHujeLO2QHS2_Ot6VddzECiOcLX_UotBRVqhvJ_J1OQJNVpw
```

この SOP を修正して SOP を発行する方法は [jwt.io の使い方](./jwt-io.md)を参照してください。

SDP の例

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ
```

この SDP を修正して SDP を発行する方法は [jwt.io の使い方](./jwt-io.md)を参照してください。

登録するコマンドの例 (curl)

```console
$ curl -X POST https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/dp/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ"}'
```

更新するコマンドの例 (curl)

```console
$ curl -X PUT https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8  \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ"}'
```

HTML の例

```html
<!doctype html>
<title>メディア (試験用)</title>
<link
  rel="alternate"
  type="application/ld+json"
  href="https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F"
/>
```

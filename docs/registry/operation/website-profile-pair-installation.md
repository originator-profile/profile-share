# website Profile Pair の発行・設置

1. OP ID とプライベート鍵を用意してください。プライベート鍵は Site Profile の署名に利用します。

2. 次のような JSON ファイルを用意してください。`site-profile.json` というファイル名だとします。 id には UUID を利用してください。

```json
{
  "id": "ca729848-9265-48bf-8e33-887a43ba34b9",
  "title": "<サイト名>",
  "image": "<サイトを表すサムネイル画像のURL>",
  "description": "<このサイトの説明>",
  "allowedOrigins": ["<保有するサイト（ドメイン）をオリジン形式で列挙>"]
}
```

:::info

image プロパティを参照した画像表示は、本実験に対応した拡張機能の初版では幅 80px \* 高さ 45px の表示領域にアスペクト比を保持して表示されます。また、CORS を許可しておいてください。表示のされ方の詳細は[画像の表示](../../media-study-202307/image.md)を参照してください。

:::

3. 次のコマンドを実行してください。ここで OP ID は example.com 、署名に使うプライベート鍵は example.priv.json とします。コマンドの出力が Site Profile です。

```
profile-registry publisher:sign --site-profile -i example.priv.json --id example.com --input site-profile.json　
```

4. レジストリから発行された SOP と Site Profile を合わせて website Profile Pair を作成します。 website Profile Pair は次のような形式の JSON です。ここで OP ID は example.com とします。

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "website": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "example.com",
      "profile": "<SOP の JWT>"
    },
    "dp": {
      "sub": "ca729848-9265-48bf-8e33-887a43ba34b9",
      "profile": "<Site Profile の JWT>"
    }
  }
}
```

5. 作成した JSON ファイル (website Profile Pair) を保有するサイトの /.well-known/ にファイル名 pp.json で配置してください。

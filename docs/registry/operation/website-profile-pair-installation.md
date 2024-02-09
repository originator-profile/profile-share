# website Profile Pair の発行・設置

1. OP ID とプライベート鍵を用意してください。プライベート鍵は[サイトプロファイル](/terminology/site-profile.md)への署名に利用します。

2. 次のような `site-profile.json` ファイルをご用意ください。id には UUID を生成して指定します。

```json
{
  "id": "<UUID>",
  "title": "<サイト名>",
  "image": "<サイトを表すサムネイル画像のURL>",
  "description": "<サイトの説明>"
}
```

:::info

image プロパティを参照した画像表示は、本実験に対応した拡張機能の初版では幅 80px \* 高さ 45px の表示領域にアスペクト比を保持して表示されます。また、CORS を許可しておいてください。表示のされ方の詳細は[画像の表示](../../media-study-202307/image.md)を参照してください。

:::

3. 次のコマンドを実行してください。ここで OP ID は example.com 、署名に使うプライベート鍵は example.priv.json とします。コマンド実行後、画面上に表示される "eyJ" から始まる文字列が署名付きサイトプロファイルです。

```
$ profile-registry publisher:sign \
    --site-profile \
    -i example.priv.json \
    --id example.com \
    --allowed-origins '*' \
    --input site-profile.json
eyJ…
```

4. レジストリから発行された SOP と署名付きサイトプロファイルを合わせて website Profile Pair を作成します。 website Profile Pair は次のような形式の JSON です。ここで OP ID は example.com とします。

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
      "sub": "<UUID>",
      "profile": "<署名付きサイトプロファイル>"
    }
  }
}
```

5. 作成した JSON ファイル (website Profile Pair) を保有するサイトの /.well-known/ にファイル名 pp.json で配置してください。

# ad Profile Pair の発行

1. OP ID とプライベート鍵を用意してください。プライベート鍵は広告用 [Signed Document Profile](/spec/#signed-document-profile)（Ad Profile）の署名に利用します。

2. 次のような `ad.json` ファイルをご用意ください。id には UUID を生成して指定します。

```json
{
  "id": "<UUID>",
  "title": "<広告名>",
  "image": "<画像URL>",
  "description": "<広告の説明>"
}
```

:::info

image プロパティを参照した画像表示は、本実験に対応した拡張機能の初版では幅 80px \* 高さ 45px の表示領域にアスペクト比を保持して表示されます。また、CORS を許可しておいてください。表示のされ方の詳細は[画像の表示](../../media-study-202307/image.md)を参照してください。

:::

3. 次のコマンドを実行してください。ここで OP ID は example.com 、署名に使うプライベート鍵は example.priv.json とします。コマンド実行後、画面上に表示される "eyJ" から始まる文字列が Ad Profile です。

```
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id example.com \
    --allowed-origins '*' \
    --input ad.json
eyJ…
```

4. レジストリから発行された SOP と Ad Profile を合わせて ad Profile Pair を作成します。 ad Profile Pair は次のような形式の JSON です。ここで OP ID は example.com とします。

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "ad": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "example.com",
      "profile": "<SOP の JWT>"
    },
    "dp": {
      "sub": "ca729848-9265-48bf-8e33-887a43ba34b9",
      "profile": "<Ad Profile>"
    }
  }
}
```

ad Profile Pair を設置するには、[iframe に埋め込む HTML コンテンツへの ad Profile Pair の設置](./iframe-profile-installation.md)を参照してください。
